# Teste Técnico - Analista de Testes (QA) | DOT

Projeto de automação de testes E2E desenvolvido em Cypress. O objetivo deste repositório é demonstrar a validação e cobertura modular do sistema OrangeHRM (Open Source Demo), utilizando boas práticas de arquitetura de software, geração de massa de dados dinâmicos e Integração Contínua.

## 🛠️ Tecnologias e Ferramentas
* **Framework:** Cypress (v15.x)
* **Linguagem:** JavaScript / Node.js
* **Massa de Dados:** `@faker-js/faker` (Geração de dados dinâmicos para evitar conflitos de restrição de unicidade)
* **CI/CD:** GitHub Actions (Pipeline configurada para execução automatizada em modo *headless*)
* **Versionamento:** Git Flow (Feature branches e Merge via Pull Requests)

---

## 🎯 Arquitetura e Escopo dos Testes
A automação foi estruturada de forma modular, separando os contextos de negócio em arquivos distintos dentro de `cypress/e2e/`. Isso garante escalabilidade e facilita a manutenção dos scripts.

### Módulos Cobertos:
* **PIM (Gestão de Funcionários):**
  * Autenticação e controle de sessão (`Custom Commands`).
  * Fluxo End-to-End de cadastro de novos colaboradores.
  * Validação de obrigatoriedade de campos e manipulação de elementos dinâmicos (switches e expansão de formulários).
* **My Info (Perfil do Colaborador):**
  * Atualização de dados pessoais e de contato.
  * Manipulação avançada de componentes Dropdown e validação de persistência em diferentes seções (Custom Fields).
  * Manutenção de grids/tabelas (Inserção e Exclusão de Contatos de Emergência).
* **Buzz (Rede Social Interna):**
  * Criação de postagens de texto no feed.
  * Abertura e fechamento de modais complexos (`.oxd-dialog-sheet`) para mídias.
  * Interações isoladas por componentes de card (Curtidas e Comentários).
* **Demais Módulos (Dashboard, Recruitment, Claim):**
  * Validação de renderização de painéis, navegação entre menus e fluxos secundários de RH.

---

## ⏱️ Estimativa de Tempo e Esforço (WBS)

Abaixo está o racional utilizado para estimar o esforço total desta entrega, considerando o trabalho colaborativo (pair programming/code review) e a extensão da cobertura:

* **Análise e Planejamento (Mapeamento de cenários e BDD):** 3 horas
* **Configuração do Projeto (Setup Cypress, Faker, Git e Estrutura):** 1 hora
* **Desenvolvimento da Automação (Scripts, mapeamento de DOM e isolamento de escopo):** 7 horas
* **Implementação da Pipeline (CI/CD GitHub Actions):** 1 hora
* **Revisão Final, Merge e Documentação (README):** 1 hora
* **Total Estimado:** 13 horas de esforço técnico.

---

## 🚀 Como executar este projeto localmente

**Pré-requisitos:**
* [Node.js](https://nodejs.org/) instalado (versão 20 ou superior recomendada).
* Git instalado.

**Passo a passo:**
1. Clone este repositório:
   ```bash
   git clone https://github.com/daviqatestemaxprod-prog/teste-tecnico-dot.git

2. Acesse a pasta do projeto:
   ```bash
   cd teste-tecnico-dot

3. Instale as dependências:
    npm install

4. Para abrir a Interface Gráfica do Cypress e acompanhar os testes visualmente:
    npx cypress open

5. Para executar todos os testes em background (Modo Headless), simulando a pipeline:
    npx cypress run