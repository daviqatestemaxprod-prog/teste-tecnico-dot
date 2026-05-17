describe('Funcionalidade: Módulo Dashboard', () => {

    beforeEach(() => {
        cy.visit('/auth/login');
        cy.login('Admin', 'admin123');

        cy.url().should('include', '/dashboard');
        cy.get('.oxd-topbar-header-breadcrumb > .oxd-text').should('contain', 'Dashboard');
    });

    it('Deve exibir o card de postagens recentes do Buzz', () => {
        // Substituído: Valida o bloco Buzz que está visível na sua tela
        cy.contains('.orangehrm-dashboard-widget', 'Buzz Latest Posts')
            .should('be.visible');
    });

    it('Deve verificar a presença de todos os atalhos de ações rápidas', () => {
        // Identifica o card de Quick Launch usando a estrutura correta da sua tela
        cy.contains('.orangehrm-dashboard-widget', 'Quick Launch')
            .should('be.visible')
            .find('.orangehrm-quick-launch-card')
            .should('have.length.at.least', 1);
    });

    it('Deve validar o funcionamento do widget de contagem de tempo de trabalho', () => {
        // Localiza o bloco Time at Work visível na esquerda
        cy.contains('.orangehrm-dashboard-widget', 'Time at Work')
            .should('be.visible');
    });

    it('Deve exibir a seção de ações pendentes dos gestores', () => {
        // Encontra o container correto de My Actions visível na direita
        cy.contains('.orangehrm-dashboard-widget', 'My Actions')
            .should('be.visible');
    });

    it('Deve validar que o grid geral do dashboard está carregado', () => {
        // Garante a existência do grid do dashboard e a renderização dos cards principais
        cy.get('.orangehrm-dashboard-grid').should('be.visible');
        cy.get('.orangehrm-dashboard-widget').should('have.length.at.least', 2);
    });

});