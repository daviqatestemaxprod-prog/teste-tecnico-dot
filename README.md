# Teste Técnico - Analista de Testes (QA) | DOT

Projeto de automação de testes E2E desenvolvido em Cypress para avaliação técnica. O foco foi a validação do módulo PIM (Personnel Information Management) do sistema OrangeHRM.

## 🎯 Escolha do Fluxo
A escolha do fluxo de Cadastro de Funcionários no OrangeHRM foi feita por simular um ambiente corporativo real, exigindo controle de sessão (Login), navegação entre módulos, preenchimento de formulários obrigatórios e validação de persistência de dados em grids (tabelas).

---

## 📖 Documentação de Testes (BDD)

### História do Usuário
**Título:** Cadastro de Novo Funcionário no Módulo PIM
**Como** um Administrador do sistema,
**Quero** cadastrar um novo funcionário informando seus dados básicos,
**Para** que o registro do colaborador conste na base de dados da empresa e possa ser pesquisado posteriormente.

### Critérios de Aceite
* O formulário de adição de funcionário só deve estar acessível para usuários autenticados e com permissão de acesso ao módulo PIM.
* Os campos "First Name" e "Last Name" devem ser de preenchimento obrigatório.
* Ao salvar o cadastro com dados válidos, o sistema deve exibir uma mensagem flutuante (toast) de sucesso.
* Após a criação, o novo funcionário deve ser retornável na pesquisa da aba "Employee List".

### Casos de Testes (CTs)
* **CT01:** Validar autenticação com sucesso.
* **CT02:** Validar obrigatoriedade dos campos (First e Last Name) no cadastro de funcionário.
* **CT03:** Validar fluxo End-to-End (E2E) de cadastro com dados dinâmicos e pesquisa de funcionário na grid.

---

## ⏱️ Estimativa de Tempo de Teste

Abaixo está o racional (WBS) utilizado para estimar o esforço desta entrega de automação:

* **Análise e Planejamento (Escolha do site, BDD, CTs):** 2 horas
* **Configuração do Projeto (Setup Cypress, Faker e Estrutura):** 1 hora
* **Desenvolvimento da Automação (Mapeamento de DOM, scripts, Custom Commands):** 4 horas
* **Implementação da Pipeline (CI/CD GitHub Actions):** 1 hora
* **Revisão Final e Documentação (README):** 1 hora
* **Total Estimado:** 9 horas de esforço técnico.

---

## 🚀 Como executar este projeto localmente

**Pré-requisitos:**
* [Node.js](https://nodejs.org/) instalado (versão 18 ou superior recomendada).
* Git instalado.

**Passo a passo:**
1. Clone este repositório:
   ```bash
git clone https://github.com/daviqatestemaxprod-prog/teste-tecnico-dot.git   