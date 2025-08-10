
import {setupDivEditables, divEditables} from './comment.js';

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', (event) => {

    });
    document.addEventListener('focusin', (event) => {
        const target = event.target;

        if (target.closest('div[contenteditable="true"]')){
            target.textContent = target.textContent.trim() === target.dataset.placeholder ? '' : target.textContent;
        }
    });
    document.addEventListener('focusout', (event) => {
        const target = event.target;

        if (target.closest('div[contenteditable="true"]')) {
            target.textContent = target.textContent.trim() === '' ? target.dataset.placeholder : target.textContent;
        }
    });
    setupDivEditables();

    const commentsContainer = document.getElementById('comments-list-container');
    const videoId = 1;


    function carregarComentarios() {
        commentsContainer.innerHTML = '<p class="loading-message">Carregando comentários...</p>';

        fetch(`http://localhost:3000/comentarios?videoId=${videoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro de rede. A API está rodando?');
                }
                return response.json();
            })
            .then(comentarios => {
                commentsContainer.innerHTML = '';

                if (comentarios.length === 0) {
                    commentsContainer.innerHTML = '<p>Seja o primeiro a comentar!</p>';
                    return;
                }

                comentarios.forEach(comentario => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment';
                    
                    commentElement.innerHTML = `
                        <p><strong>${comentario.usuario}:</strong> ${comentario.texto}</p>
                    `;
                    commentsContainer.appendChild(commentElement);
                });
            })
            .catch(error => {
                commentsContainer.innerHTML = `<p style="color: red;">Falha ao carregar: ${error.message}</p>`;
                console.error(error);
            });
    }

    carregarComentarios();
    
    const form = document.getElementById('form-novo-comentario');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const divEditable = form.querySelector('div[contenteditable="true"]');
        const usuarioInput = document.getElementById('input-usuario');
        const textoInput = document.getElementById('input-comentario');
        
        const novoComentario = {
            videoId: videoId,
            usuario: usuarioInput.value,
            texto: textoInput.value
        };

        fetch('http://localhost:3000/comentarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoComentario),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Comentário salvo:', data);
            textoInput.value = '';
            divEditable.textContent = divEditable.dataset.placeholder;
            carregarComentarios();
        })
        .catch(error => console.error('Erro ao salvar comentário:', error));
    });

});