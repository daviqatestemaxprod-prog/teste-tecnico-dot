import { faker } from '@faker-js/faker';

describe('Módulo My Info - Testes de Regressão Integral', () => {

    beforeEach(() => {
        // Realiza o login e garante que inicia sempre na raiz do módulo My Info
        cy.visit('/auth/login');
        cy.login('Admin', 'admin123');
        cy.contains('span', 'My Info').click();
    });

    // --- SEÇÃO: PERSONAL DETAILS ---

    it('Deve alterar o número da licença de motorista e o gênero com sucesso', () => {
        const driversLicense = faker.string.numeric(9);

        cy.contains('.oxd-input-group', "Driver's License Number")
            .find('input')
            .clear()
            .type(driversLicense);

        cy.contains('label', 'Female').click();

        cy.get('button[type="submit"]').first().click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Updated');
    });

    it('Deve permitir atualizar o estado civil do colaborador', () => {
        cy.contains('.oxd-input-group', 'Marital Status')
            .find('.oxd-select-text')
            .click();

        cy.contains('.oxd-select-option', 'Single').click();

        cy.get('button[type="submit"]').first().click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Updated');
    });

    // --- SEÇÃO: CUSTOM FIELDS (CORRIGIDO) ---

    it('Deve atualizar os campos customizados com dados numéricos válidos', () => {
        // Altera o tipo sanguíneo
        cy.contains('.oxd-input-group', 'Blood Type')
            .find('.oxd-select-text')
            .click();
        cy.contains('.oxd-select-option', 'A+').click();

        // CORREÇÃO: Test_Field espera números (ex: 445). Usando string numérica para evitar quebras.
        const numeroCustomizado = faker.string.numeric(3);
        cy.contains('.oxd-input-group', 'Test_Field')
            .find('input')
            .clear()
            .type(numeroCustomizado);

        // ESTRATÉGIA ROBUSTA: Busca o botão de salvar especificamente dentro do bloco de Custom Fields
        cy.contains('h6', 'Custom Fields')
            .parents('.oxd-card-container')
            .find('button[type="submit"]')
            .click();

        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Updated');
    });

    // --- SEÇÃO: CONTACT DETAILS ---

    it('Deve atualizar os dados de contato do telefone celular', () => {
        cy.contains('a', 'Contact Details').click();

        const celular = faker.string.numeric(9);

        cy.contains('.oxd-input-group', 'Mobile')
            .find('input')
            .clear()
            .type(celular);

        cy.get('button[type="submit"]').first().click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Updated');
    });

    // --- SEÇÃO: EMERGENCY CONTACTS (COBERTURA AVANÇADA DE GRID) ---

    it('Deve cadastrar um novo contato de emergência e exibi-lo na tabela', () => {
        cy.contains('a', 'Emergency Contacts').click();
        cy.contains('button', 'Add').click();

        const nomeEmergencia = faker.person.fullName();
        const relacao = 'Friend';
        const telefone = faker.string.numeric(9);

        // Preenche o formulário de emergência
        cy.contains('.oxd-input-group', 'Name').find('input').type(nomeEmergencia);
        cy.contains('.oxd-input-group', 'Relationship').find('input').type(relacao);
        cy.contains('.oxd-input-group', 'Mobile').find('input').type(telefone);

        cy.get('button[type="submit"]').click();

        // Valida o salvamento do novo registro
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');

        // VALIDAÇÃO DE GRID: Garante que o nome inserido agora consta na tabela de contatos
        cy.get('.oxd-table-body').should('contain', nomeEmergencia);
    });

    it('Deve atualizar os e-mails de contato corporativo e pessoal', () => {
        cy.contains('a', 'Contact Details').click();
        const workEmail = faker.internet.email();
        const otherEmail = faker.internet.email();

        cy.contains('.oxd-input-group', 'Work Email').find('input').clear().type(workEmail);
        cy.contains('.oxd-input-group', 'Other Email').find('input').clear().type(otherEmail);

        cy.get('button[type="submit"]').first().click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Updated');
    });

    it('Deve preencher o endereço internacional selecionando o país no dropdown', () => {
        cy.contains('a', 'Contact Details').click();

        // Abre o seletor de país
        cy.contains('.oxd-input-group', 'Country').find('.oxd-select-text').click();
        // Seleciona uma opção da lista de forma dinâmica
        cy.get('.oxd-select-option').eq(2).click();

        cy.get('button[type="submit"]').first().click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Updated');
    });

    it('Deve permitir excluir um contato de emergência existente da tabela', () => {
        cy.contains('a', 'Emergency Contacts').click();

        // Verifica se há pelo menos um registro para excluir, evitando falso-negativo
        cy.get('.oxd-table-body').then(($body) => {
            if ($body.find('.oxd-table-card').length > 0) {
                // Clica no ícone de lixeira do primeiro registro
                cy.get('.bi-trash').first().click();
                // Confirma a ação no modal de confirmação do sistema
                cy.contains('button', 'Yes, Delete').click();
                cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Deleted');
            }
        });
    });

    it('Deve cadastrar um novo dependente com sucesso na listagem', () => {
        cy.contains('a', 'Dependents').click();
        cy.contains('button', 'Add').click();
        const nomeDependente = faker.person.fullName();

        cy.contains('.oxd-input-group', 'Name').find('input').type(nomeDependente);
        cy.contains('.oxd-input-group', 'Relationship').find('.oxd-select-text').click();
        cy.contains('.oxd-select-option', 'Child').click();

        cy.get('button[type="submit"]').click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');
        cy.get('.oxd-table-body').should('contain', nomeDependente);
    });

    it('Deve adicionar uma nova documentação de Passaporte com sucesso', () => {
        cy.contains('a', 'Immigration').click();
        cy.contains('button', 'Add').click();
        const numeroPassaporte = faker.string.alphanumeric(9).toUpperCase();

        cy.contains('.oxd-input-group', 'Number').find('input').type(numeroPassaporte);
        cy.get('button[type="submit"]').click();

        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');
        cy.get('.oxd-table-body').should('contain', numeroPassaporte);
    });

    it('Deve cadastrar uma experiência profissional anterior', () => {
        cy.contains('a', 'Qualifications').click();
        // Isola o escopo pelo título para clicar no botão "Add" correto da seção
        cy.contains('h6', 'Work Experience').parent().find('button').contains('Add').click();

        const empresa = faker.company.name();
        cy.contains('.oxd-input-group', 'Company').find('input').type(empresa);

        cy.get('button[type="submit"]').click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');
        cy.get('.oxd-table-body').should('contain', empresa);
    });

    it('Deve adicionar um registro de nível educacional ao perfil', () => {
        cy.contains('a', 'Qualifications').click();
        cy.contains('h6', 'Education').parent().find('button').contains('Add').click();

        cy.contains('.oxd-input-group', 'Level').find('.oxd-select-text').click();
        cy.get('.oxd-select-option').eq(1).click();

        cy.get('button[type="submit"]').click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');
    });

    it('Deve mapear e adicionar uma nova competência técnica (Skill)', () => {
        cy.contains('a', 'Qualifications').click();
        cy.contains('h6', 'Skills').parent().find('button').contains('Add').click();

        cy.contains('.oxd-input-group', 'Skill').find('.oxd-select-text').click();
        cy.get('.oxd-select-option').eq(1).click();
        cy.contains('.oxd-input-group', 'Years of Experience').find('input').type('3');

        cy.get('button[type="submit"]').click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');
    });

    it('Deve adicionar uma nova proficiência de idioma', () => {
        cy.contains('a', 'Qualifications').click();
        cy.contains('h6', 'Languages').parent().find('button').contains('Add').click();

        cy.contains('.oxd-input-group', 'Language').find('.oxd-select-text').click();
        cy.get('.oxd-select-option').eq(1).click();

        cy.contains('.oxd-input-group', 'Fluency').find('.oxd-select-text').click();
        cy.contains('.oxd-select-option', 'Speaking').click();

        cy.get('button[type="submit"]').click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');
    });

    it('Deve vincular uma nova filiação institucional ao cadastro do funcionário', () => {
        cy.contains('a', 'Memberships').click();
        cy.contains('button', 'Add').click();

        cy.contains('.oxd-input-group', 'Membership').find('.oxd-select-text').click();
        cy.get('.oxd-select-option').eq(1).click();

        cy.get('button[type="submit"]').click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');
    });

    it('Deve preencher e validar a alteração do campo Apelido (Nickname)', () => {
        const apelido = faker.person.firstName();

        cy.contains('.oxd-input-group', 'Nickname').find('input').clear().type(apelido);

        cy.get('button[type="submit"]').first().click();
        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Updated');
    });
});