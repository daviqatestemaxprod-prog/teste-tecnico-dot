import { faker } from '@faker-js/faker';

describe('Funcionalidade: Módulo PIM (Funcionários)', () => {

  beforeEach(() => {
    // Usando a baseUrl de forma elegante!
    cy.visit('/auth/login');
  });

  it('CT01: Validar autenticação com sucesso', () => {
    // Usando nosso Custom Command
    cy.login('Admin', 'admin123');

    // Validação
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-topbar-header-breadcrumb > .oxd-text').should('contain', 'Dashboard');
  });

  it('CT02: Validar obrigatoriedade dos campos no cadastro de funcionário', () => {
    // Precisamos logar primeiro
    cy.login('Admin', 'admin123');

    // Navega para o módulo PIM no menu lateral
    cy.contains('span', 'PIM').click();

    // Clica na aba de Adicionar Funcionário
    cy.contains('a', 'Add Employee').click();

    // Clica no botão de Salvar sem preencher nenhum campo
    cy.get('button[type="submit"]').click();

    // Validação: Verifica se as mensagens de erro "Required" apareceram sob os 2 campos obrigatórios (First e Last name)
    cy.get('.oxd-input-field-error-message')
      .should('have.length', 2)
      .and('contain', 'Required');
  });

  it('CT03: Validar fluxo End-to-End (E2E) de cadastro e pesquisa de funcionário', () => {
    // 1. Login e navegação
    cy.login('Admin', 'admin123');
    cy.contains('span', 'PIM').click();
    cy.contains('a', 'Add Employee').click();

    // 2. Geração de massa de dados dinâmica com Faker
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    // 3. Preenchimento e salvamento
    cy.get('input[name="firstName"]').type(firstName);
    cy.get('input[name="lastName"]').type(lastName);
    cy.get('button[type="submit"]').click();

    // 4. Validação do Toast (Mensagem flutuante de Sucesso)
    // O timeout extra garante que o Cypress espere a requisição do backend concluir
    cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');

    // 5. Pesquisa na Employee List
    cy.contains('a', 'Employee List').click();

    // Mapeamento resiliente: Encontra o bloco que contém o texto "Employee Name" e depois acha o input dentro dele
    cy.contains('.oxd-input-group', 'Employee Name')
      .find('input')
      .type(firstName);

    // Aciona a busca
    cy.get('button[type="submit"]').click();

    // 6. Validação na Tabela (Grid de resultados)
    cy.get('.oxd-table-body', { timeout: 10000 })
      .should('contain', firstName)
      .and('contain', lastName);
  });

});