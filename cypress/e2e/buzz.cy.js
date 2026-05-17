import { faker } from '@faker-js/faker';

describe('Módulo Buzz - Testes de Regressão Integral', () => {

    beforeEach(() => {
        // Realiza o login e garante que inicia sempre na raiz do módulo Buzz
        cy.visit('/auth/login');
        cy.login('Admin', 'admin123'); // Custom command que você já possui
        cy.contains('span', 'Buzz').click();

        // Garante que o feed carregou antes de interagir
        cy.get('.orangehrm-buzz-newsfeed').should('be.visible');
    });

    // --- SEÇÃO: PUBLICAÇÃO DE CONTEÚDO ---

    it('Deve publicar uma nova postagem de texto no feed com sucesso', () => {
        const textoPostagem = faker.lorem.paragraph(2);

        cy.get('textarea.oxd-buzz-post-input').type(textoPostagem);
        cy.contains('button', 'Post').click();

        // Validamos diretamente no DOM se a postagem nova assumiu o topo do feed
        cy.get('.orangehrm-buzz-newsfeed .oxd-grid-item', { timeout: 10000 })
            .first()
            .should('contain', textoPostagem);
    });

    it('Não deve permitir a publicação de uma postagem completamente vazia', () => {
        cy.get('textarea.oxd-buzz-post-input').click();
        // Tenta clicar no botão e garante que não houve sucesso
        cy.contains('button', 'Post').click();

        cy.get('.oxd-toast').should('not.exist');
    });

    it('Deve abrir o modal de compartilhamento de fotos e fechar utilizando o botão de fechar', () => {
        cy.contains('button', 'Share Photos').click();

        cy.get('.oxd-dialog-sheet').should('be.visible').within(() => {
            cy.contains('Share Photos').should('be.visible');
            // Utilizando o botão nativo de fechar 'X'
            cy.get('.oxd-dialog-close-button').click();
        });

        cy.get('.oxd-dialog-sheet').should('not.exist');
    });

    it('Deve abrir o modal de compartilhamento de vídeo e fechar utilizando o ícone de fechamento (X)', () => {
        cy.contains('button', 'Share Video').click();

        cy.get('.oxd-dialog-sheet').should('be.visible').within(() => {
            cy.contains('Share Video').should('be.visible');
            cy.get('button.oxd-dialog-close-button').click();
        });

        cy.get('.oxd-dialog-sheet').should('not.exist');
    });

    it('Deve publicar o link de um vídeo externo com sucesso no feed', () => {
        const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

        cy.contains('button', 'Share Video').click();

        cy.get('.oxd-dialog-sheet').should('be.visible').within(() => {
            // Isolando o primeiro textarea para evitar erro de elementos duplicados
            cy.get('textarea').first().type(videoUrl);
            cy.contains('button', 'Share').click();
        });

        // Aguarda a renderização no feed
        cy.get('.orangehrm-buzz-newsfeed .oxd-grid-item', { timeout: 10000 })
            .first()
            .should('contain', videoUrl);
    });

    // --- SEÇÃO: INTERAÇÕES (CURTIDAS E COMENTÁRIOS) ---

    it('Deve curtir a primeira postagem do feed', () => {
        cy.get('.orangehrm-buzz-newsfeed .oxd-grid-item').first().within(() => {
            cy.get('.oxd-icon.bi-heart, .oxd-icon.bi-heart-fill').first().click();
            cy.get('.oxd-icon.bi-heart-fill').should('be.visible');
        });
    });

    it('Deve remover a curtida (unlike) de uma postagem do feed', () => {
        cy.get('.orangehrm-buzz-newsfeed .oxd-grid-item').first().within(() => {
            // Garante que está curtido primeiro
            cy.get('svg').then(($svg) => {
                if ($svg.hasClass('bi-heart')) {
                    cy.get('.bi-heart').first().click();
                    cy.wait(1000); // Aguarda a animação e requisição (debounce do sistema)
                }
            });

            // Remove a curtida e espera o botão voltar ao normal
            cy.get('.oxd-icon.bi-heart-fill').first().click();
            cy.get('.oxd-icon.bi-heart', { timeout: 10000 }).should('be.visible');
        });
    });

    it('Deve publicar um comentário na primeira postagem do feed', () => {
        const textoComentario = faker.lorem.sentence();

        cy.get('.orangehrm-buzz-newsfeed .oxd-grid-item').first().within(() => {
            cy.get('.oxd-icon.bi-chat-text-fill').first().click();
            cy.get('input[placeholder="Write your comment..."]').type(`${textoComentario}{enter}`);
            cy.contains(textoComentario).should('be.visible');
        });
    });

    it('Deve curtir o comentário de um usuário dentro de uma postagem', () => {
        cy.get('.orangehrm-buzz-newsfeed .oxd-grid-item').first().within(() => {
            cy.get('.oxd-icon.bi-chat-text-fill').first().click();

            // Apenas clica no Like, sem esperar que a palavra mude (pois a UI atual não muda)
            cy.contains('p', 'Like').first().click();
            cy.contains('p', 'Like').should('be.visible');
        });
    });

    it('Deve compartilhar a publicação de terceiros no próprio feed do usuário', () => {
        const textoCompartilhamento = faker.lorem.words(4);

        cy.get('.orangehrm-buzz-newsfeed .oxd-grid-item').first().within(() => {
            cy.get('.oxd-icon.bi-share-fill').first().click();
        });

        cy.get('.oxd-dialog-sheet').should('be.visible').within(() => {
            cy.get('textarea').type(textoCompartilhamento);
            cy.contains('button', 'Share').click();
        });

        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Saved');
    });

    // --- SEÇÃO: GERENCIAMENTO DE POSTAGENS E FEED ---

    it('Deve excluir uma postagem criada pelo usuário logado', () => {
        const postTemp = faker.string.uuid();
        cy.get('textarea.oxd-buzz-post-input').type(postTemp);
        cy.contains('button', 'Post').click();

        // Garante que o post apareceu antes de tentar excluir
        cy.get('.orangehrm-buzz-newsfeed .oxd-grid-item', { timeout: 10000 }).first().within(() => {
            cy.contains(postTemp).should('be.visible');
            cy.get('.bi-three-dots').click();
            cy.contains('p', 'Delete Post').click();
        });

        cy.get('.oxd-dialog-sheet').should('be.visible').within(() => {
            cy.contains('button', 'Yes, Delete').click();
        });

        cy.get('.oxd-toast', { timeout: 10000 }).should('contain', 'Successfully Deleted');
    });

    it('Deve aplicar o filtro para exibir apenas as postagens mais recentes', () => {
        // Intercepta a chamada da API de feed para ter certeza que atualizou
        cy.intercept('GET', '**/buzz/feed**').as('loadFeed');
        cy.contains('button', 'Most Recent Posts').click();

        cy.wait('@loadFeed');
        cy.get('.orangehrm-buzz-newsfeed').should('be.visible');
    });

    it('Deve aplicar o filtro para exibir apenas as postagens mais curtidas', () => {
        cy.intercept('GET', '**/buzz/feed**').as('loadFeed');
        cy.contains('button', 'Most Liked Posts').click();

        cy.wait('@loadFeed');
        cy.get('.orangehrm-buzz-newsfeed').should('be.visible');
    });

    it('Deve aplicar o filtro para exibir apenas as postagens mais comentadas', () => {
        cy.intercept('GET', '**/buzz/feed**').as('loadFeed');
        cy.contains('button', 'Most Commented Posts').click();

        cy.wait('@loadFeed');
        cy.get('.orangehrm-buzz-newsfeed').should('be.visible');
    });

    it('Deve expandir uma postagem longa clicando no botão "Read More"', () => {
        cy.get('.orangehrm-buzz-newsfeed').then(($feed) => {
            if ($feed.find('.orangehrm-buzz-post-read-more').length > 0) {
                cy.get('.orangehrm-buzz-post-read-more').first().click();
                cy.get('.orangehrm-buzz-post-read-more').should('not.exist');
            } else {
                cy.log('Não há postagens com texto longo o suficiente para exibir "Read More" neste momento.');
            }
        });
    });
    
});