describe('Módulo PIM - Gerenciamento de Funcionários', () => {

    beforeEach(() => {
        // 1. Faz o login ignorando instabilidades do ambiente demo
        cy.visit('/auth/login', { failOnStatusCode: false });
        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        // 2. Navega até o módulo PIM pelo menu lateral
        cy.contains('.oxd-main-menu-item', 'PIM').click();

        // 3. Valida se a página principal carregou corretamente
        cy.get('.oxd-topbar-header-title').should('contain', 'PIM');
        cy.get('.oxd-table-filter').should('be.visible');
    });

    // --- SEÇÃO 1: FILTROS E BUSCA ---
    describe('Filtros de Busca na Listagem de Funcionários', () => {

        it('Deve buscar um funcionário por ID com sucesso', () => {
            cy.get('.oxd-table-filter').within(() => {
                cy.contains('label', 'Employee Id')
                    .closest('.oxd-input-group')
                    .find('input')
                    .type('01715');

                cy.get('button[type="submit"]').click();
            });

            cy.get('.oxd-loading-spinner').should('not.exist');

            cy.get('.oxd-table-card')
                .should('have.length.at.least', 1)
                .and('contain', 'Amelia');
        });

        it('Deve limpar os filtros ao clicar no botão Reset', () => {
            cy.get('.oxd-table-filter').within(() => {
                cy.contains('label', 'Employee Id')
                    .closest('.oxd-input-group')
                    .find('input')
                    .type('99999');

                cy.contains('button', 'Reset').click();

                cy.contains('label', 'Employee Id')
                    .closest('.oxd-input-group')
                    .find('input')
                    .should('have.value', '');
            });
        });
    });

    // --- SEÇÃO 2: LISTAGEM E ESTRUTURA ---
    describe('Validação da Tabela de Registros', () => {

        it('Deve validar que a tabela específica de funcionários foi renderizada', () => {
            cy.get('.oxd-table.orangehrm-employee-list').should('be.visible');
            cy.get('.oxd-table.orangehrm-employee-list')
                .find('.oxd-table-card')
                .should('have.length.at.least', 1);
        });

        it('Deve validar a presença dos botões de ação na listagem', () => {
            cy.get('.orangehrm-horizontal-padding > .oxd-text').should('contain', 'Records Found');
            cy.get('.oxd-table-card').first().within(() => {
                cy.get('.bi-pencil-fill').should('be.visible');
                cy.get('.bi-trash').should('be.visible');
            });
        });
    });

    // --- SEÇÃO 3: FLUXO COMPLETO DE CADASTRO (ADD EMPLOYEE) ---
    describe('Cadastro de Novo Funcionário', () => {

        it('Deve cadastrar um novo funcionário com sucesso e validar os detalhes pessoais', () => {
            // 1. Clica no botão "+ Add" usando a classe exata identificada no DevTools
            cy.get('button.oxd-button--secondary').contains('Add').click();
            cy.url().should('include', '/pim/addEmployee');

            // 2. Preenche o Nome Completo com base nos dados informados nos prints
            cy.get('input[name="firstName"]').should('be.visible').type('DAVI');
            cy.get('input[name="middleName"]').type('ALBUQUERQUE');
            cy.get('input[name="lastName"]').type('DOS SANTOS');

            // 3. Substitui o Employee ID gerado automaticamente pelo valor do print
            cy.get('.oxd-input-group')
                .contains('label', 'Employee Id')
                .closest('.oxd-input-group')
                .find('input')
                .clear() // Limpa o ID padrão incremental do sistema
                .type('112387');

            // 4. Clica no botão verde "Save" para submeter o formulário
            cy.contains('button', 'Save').click();

            // 5. Validações pós-cadastro (Com base no seu último print da tela Personal Details)
            // O sistema redireciona automaticamente para a tela de visualização de detalhes do usuário criado
            cy.url({ timeout: 15000 }).should('include', '/pim/viewPersonalDetails');

            // Valida se o nome completo do funcionário aparece renderizado no perfil do painel esquerdo
            cy.get('.orangehrm-edit-employee-name', { timeout: 10000 })
                .should('be.visible')
                .and('contain', 'DAVI DOS SANTOS');

            // Valida se os campos dentro do novo formulário vieram preenchidos corretamente
            cy.get('input[name="firstName"]').should('have.value', 'DAVI');
            cy.get('input[name="lastName"]').should('have.value', 'DOS SANTOS');
        });
    });
});