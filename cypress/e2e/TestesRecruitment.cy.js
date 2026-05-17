import { faker } from '@faker-js/faker';

describe('Funcionalidade: Recruitment', () => {
    beforeEach(() => {
        cy.visit('/auth/login');
        // Usando nosso Custom Command
        cy.login('Admin', 'admin123');

        // Validação
        cy.url().should('include', '/dashboard');
        cy.get('.oxd-topbar-header-breadcrumb > .oxd-text').should('contain', 'Dashboard');
        cy.contains('span', 'Recruitment').click();
    });

    it("Deve adicionar um recruitment com sucesso", () => {
        // Massa de dados dinâmica gerada pelo Faker
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email();
        //  Acessar o módulo de Recrutamento
        cy.url().should('include', '/recruitment');
        // Clicar no botão para adicionar novo candidato
        cy.contains('button', ' Add ').click();
        // Preencher os dados do formulário
        cy.get('[name="firstName"]').type(firstName);
        cy.get('[name="lastName"]').type(lastName);
        // Mapeando o campo de e-mail a partir da Label
        cy.contains('label', 'Email')
            .parent()
            .parent()
            .find('input')
            .type(email);
        // Salvar o registro
        cy.get('button[type="submit"]').click();
        // Validando se a mensagem de sucesso ao salvar
        cy.contains('Successfully Saved').should('be.visible');
        // Voltar para a listagem de candidatos
        cy.contains('.oxd-topbar-body-nav-tab', 'Candidates').click();
        cy.get('.oxd-table').should('be.visible'); // Aguarda a tabela renderizar
        // Localizar o candidato recém-criado na tabela e clicar para excluir, para não acumular individuo
        cy.contains('.oxd-table-row', firstName)
            .find('.bi-trash')
            .click();
        // Confirmar a exclusão no modal
        cy.contains('button', ' Yes, Delete ').click();
        // Validação final: Mensagem de sucesso ao excluir
        cy.contains('Successfully Deleted').should('be.visible');
        // Garante que o e-mail do faker criado não está mais na listagem
        cy.get('.oxd-table').should('not.contain', email);
    });

    it('Deve exibir alerta de campo obrigatório ao tentar salvar em branco', () => {
        // Acessa a tela de cadastro de candidato
        cy.contains('button', ' Add ').click();

        // Submete o formulário sem preencher os dados
        cy.get('button[type="submit"]').click();

        // Garante que os textos de erro estão visíveis na tela
        cy.contains('.oxd-input-field-error-message', 'Required').should('be.visible');

        // Valida que o erro aparece para First Name, Last Name e Email
        cy.get('.oxd-input-field-error-message').should('have.length.at.least', 3);
    });

    it('Deve filtrar candidatos por status com sucesso', () => {
        // Seleciona o status no campo dropdown
        cy.contains('label', 'Status')
            .parent()
            .parent()
            .find('.oxd-select-text')
            .click();

        cy.get('.oxd-select-dropdown').contains('Application Initiated').click();

        // Executa a busca com o filtro aplicado
        cy.get('button[type="submit"]').click();

        // Valida que a tabela foi atualizada e permanece visível
        cy.get('.oxd-table-body').should('be.visible');
    });

    it('Deve realizar o fluxo completo de contratação de um candidato', () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email();

        cy.contains('button', ' Add ').click();

        cy.get('[name="firstName"]').type(firstName);
        cy.get('[name="lastName"]').type(lastName);
        cy.contains('label', 'Email').parent().parent().find('input').type(email);

        cy.contains('label', 'Vacancy').parent().parent().find('.oxd-select-text').click();
        cy.get('.oxd-select-dropdown').children().eq(1).click();

        cy.get('button[type="submit"]').click();
        cy.contains('Successfully Saved').should('be.visible');

        cy.contains('button', ' Shortlist ').click();
        cy.get('button[type="submit"]').click();
        cy.contains('Successfully Updated').should('be.visible');

        cy.contains('button', ' Schedule Interview ').click();
        cy.contains('label', 'Interview Title').parent().parent().find('input').type('Entrevista Técnica');

        cy.contains('label', 'Interviewer').parent().parent().find('input').type('a');
        cy.wait(2000);
        cy.get('.oxd-autocomplete-option').first().click();

        cy.contains('label', 'Date').parent().parent().find('input').type('2026-12-01{esc}');

        cy.get('button[type="submit"]').click();

        // Valida se a mensagem na tela é Saved ou Updated dinamicamente
        cy.get('.oxd-toast').should('be.visible').and(($toast) => {
            expect($toast.text()).to.match(/Successfully (Saved|Updated)/);
        });

        cy.contains('button', ' Mark Interview Passed ').click();
        cy.get('button[type="submit"]').click();
        cy.contains('Successfully Updated').should('be.visible');

        cy.contains('button', ' Offer Job ').click();
        cy.get('button[type="submit"]').click();
        cy.contains('Successfully Updated').should('be.visible');

        cy.contains('button', ' Hire ').click();
        cy.get('button[type="submit"]').click();
        cy.contains('Successfully Updated').should('be.visible');

        cy.get('.orangehrm-recruitment-status').should('contain', 'Status: Hired');
    });

    it('Deve rejeitar um candidato no início do processo', () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email();

        cy.contains('button', ' Add ').click();
        cy.get('[name="firstName"]').type(firstName);
        cy.get('[name="lastName"]').type(lastName);
        cy.contains('label', 'Email').parent().parent().find('input').type(email);

        // Corrigido: Seleciona a vaga para habilitar os botões de ação na tela seguinte
        cy.contains('label', 'Vacancy').parent().parent().find('.oxd-select-text').click();
        cy.get('.oxd-select-dropdown').children().eq(1).click();

        cy.get('button[type="submit"]').click();
        cy.contains('Successfully Saved').should('be.visible');

        // Executa a rejeição direta
        cy.contains('button', ' Reject ').click();
        cy.get('button[type="submit"]').click();

        cy.contains('Successfully Updated').should('be.visible');
        cy.get('.orangehrm-recruitment-status').should('contain', 'Status: Rejected');
    });

    it('Deve validar formato incorreto de e-mail no cadastro', () => {
        cy.contains('button', ' Add ').click();

        cy.contains('label', 'Email').parent().parent().find('input').type('email_invalido.com');
        cy.get('button[type="submit"]').click();

        cy.contains('.oxd-input-field-error-message', 'Expected format: admin@example.com').should('be.visible');
    });

    it('Deve baixar o currículo anexado de um candidato', () => {
        // Corrigido: Seletor mapeado pela classe correta da linha da tabela e botão de visualização/edição
        cy.get('.oxd-table-body .oxd-table-row').first().find('.oxd-icon-button').first().click();

        // Verifica o botão de download caso exista um arquivo anexado no primeiro registro
        cy.get('body').then(($body) => {
            if ($body.find('.bi-download').length > 0) {
                cy.get('.bi-download').first().click();
            }
        });
    });

    it('Deve buscar um candidato específico pelo nome na listagem', () => {
        cy.get('.oxd-table-body .oxd-table-row').first().find('.oxd-table-cell').eq(2)
            .invoke('text')
            .then((nomeCompleto) => {
                const primeiroNome = nomeCompleto.split(' ')[0];

                cy.get('[placeholder="Type for hints..."]').first().type(primeiroNome);
                cy.wait(2000);
                cy.get('.oxd-autocomplete-option').first().click();

                cy.get('button[type="submit"]').click();
                cy.get('.oxd-table-body').should('contain', primeiroNome);
            });
    });

    it('Deve resetar os filtros de busca preenchidos', () => {
        cy.contains('label', 'Status').parent().parent().find('.oxd-select-text').click();
        cy.get('.oxd-select-dropdown').children().eq(2).click();

        cy.contains('button', ' Reset ').click({ force: true });
        cy.contains('label', 'Status').parent().parent().find('.oxd-select-text').should('contain', '-- Select --');
    });
});