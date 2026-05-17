describe('Módulo Claim - Gerenciamento de Despesas e Reembolsos', () => {

    beforeEach(() => {
        // Realiza o login e acessa o módulo Claim
        cy.visit('/auth/login');
        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.contains('span', 'Claim').click();

        // Garante que a página carregou
        cy.get('.oxd-topbar-header-title').should('contain', 'Claim');
        cy.get('.oxd-table-body', { timeout: 10000 }).should('be.visible');
    });

    // --- SEÇÃO: NAVEGAÇÃO BÁSICA ---

    it('Deve carregar a página de "Employee Claims" por padrão', () => {
        cy.get('.oxd-topbar-body-nav-tab.--visited').should('contain', 'Employee Claims');
        cy.contains('button', 'Assign Claim').should('be.visible');
    });

    // --- SEÇÃO: AÇÕES E NAVEGAÇÃO ---

    it('Deve redirecionar para a tela de atribuição ao clicar em "+ Assign Claim"', () => {
        cy.contains('button', 'Assign Claim').click();

        cy.url().should('include', 'claim/assignClaim');
        // Busca especificamente um elemento h6 que contenha o texto
        cy.contains('h6', 'Assign Claim').should('be.visible');
    });

    it('Deve abrir os detalhes de um reembolso ao clicar em "View Details"', () => {
        cy.get('.oxd-table-body .oxd-table-row').first().within(() => {
            cy.contains('button', 'View Details').click();
        });

        cy.url().should('include', 'claim/submitClaim');
    });

    // --- SEÇÃO: FILTROS E BUSCA ---

    it('Deve buscar um reembolso com sucesso utilizando o Reference ID', () => {
        // eq(0) para pegar a primeira coluna, que é o Reference Id de fato
        cy.get('.oxd-table-body .oxd-table-row').first().find('.oxd-table-cell').eq(0).invoke('text').then((referenceId) => {

            cy.contains('label', 'Reference Id')
                .parent()
                .parent()
                .find('input')
                .first()
                .type(referenceId);

            cy.intercept('GET', '**/claim/employees/requests**').as('searchClaims');
            cy.contains('button', 'Search').click({ force: true });
            cy.wait('@searchClaims');

            cy.get('.oxd-table-body .oxd-table-row').should('have.length', 1);
            cy.get('.oxd-table-body .oxd-table-row').first().should('contain', referenceId);
        });
    });

    it('Deve limpar os filtros ao clicar no botão "Reset"', () => {
        const textoTeste = '202307180000003';

        cy.contains('label', 'Reference Id')
            .parent()
            .parent()
            .find('input')
            .first()
            .type(textoTeste)
            .blur(); // Simula o usuário tirando o foco do campo para registrar o estado

        // Intercepta o recarregamento da tabela após o reset
        cy.intercept('GET', '**/claim/employees/requests**').as('resetClaims');
        cy.contains('button', 'Reset').click({ force: true });
        cy.wait('@resetClaims');

        // Valida se o campo foi esvaziado
        cy.contains('label', 'Reference Id')
            .parent()
            .parent()
            .find('input')
            .first()
            .should('be.empty'); // 'be.empty' é mais semântico para verificar se um campo está vazio
    });

    it('Deve buscar reembolsos utilizando o filtro de Status', () => {
        cy.contains('label', 'Status')
            .parent()
            .parent()
            .find('.oxd-select-text')
            .click();

        cy.get('.oxd-select-dropdown').contains('Submitted').click();

        cy.intercept('GET', '**/claim/employees/requests**').as('searchClaims');
        cy.contains('button', 'Search').click({ force: true });
        cy.wait('@searchClaims');

        cy.get('.oxd-table-body').should('be.visible');

        cy.get('.oxd-table-body .oxd-table-row').each(($row) => {
            cy.wrap($row).should('contain', 'Submitted');
        });
    });
});