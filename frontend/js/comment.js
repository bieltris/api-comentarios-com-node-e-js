import { criarSpanErro } from './errorHandle.js';

const path = 'http://localhost:3000/api';
const commentsContainer = document.getElementById('comments-list-container');

export function setupDivEditables() {
    const divEditables = document.querySelectorAll('div[contenteditable="true"]');
    console.log('Configurando divs editaveis');

    function resizeDivEditable(div) {
        div.style.height = 'auto';
        div.style.height = div.scrollHeight + 'px';
    }


    divEditables.forEach(div => {
        div.addEventListener('input', (e) => {
            resizeDivEditable(e.target);
            sincronizarInputHidden(e.target);
        })
        resizeDivEditable(div);
        div.textContent = div.textContent.trim() === '' ? div.dataset.placeholder : div.textContent;
    })
}


export function carregarComentarios(videoId) {
    commentsContainer.innerHTML = '<p class="loading-message">Carregando comentários...</p>';

    fetch(`${path}/comments?videoId=${videoId}`)
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

export function enviarComentario(event, videoId) {
    event.preventDefault();

    const form = event.target;
    const divEditable = form.querySelector('div[contenteditable="true"]');
    const usuarioInput = form.querySelector('#input-usuario');
    const textoHiddenInput = form.querySelector('#input-comentario'); 

    if (divEditable.textContent.trim() === divEditable.dataset.placeholder) {
        textoHiddenInput.value = '';
    } else {
        textoHiddenInput.value = divEditable.innerHTML;
    }

    const novoComentario = {
        videoId: videoId,
        user: usuarioInput.value,
        text: textoHiddenInput.value 
    };

    if (!novoComentario.user.trim() || !novoComentario.text.trim()) {
        alert("Nome e comentário não podem estar vazios.");
        return;
    }

    fetch(`${path}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoComentario),
    })
    .then(async response => {
        if (!response.ok) {
            if (response.status === 400) {
                const err = await response.json();
                throw new Error(err.error);
            }
        }
        return response.json();
    })
    .then(data => {
        console.log('Comentário salvo:', data);
        
        usuarioInput.value = '';
        textoHiddenInput.value = '';
        divEditable.textContent = divEditable.dataset.placeholder; 
        divEditable.style.color = ''; 
        
        carregarComentarios(videoId);

        const errorSpan = form.querySelector('#error');
        if (errorSpan) {
            errorSpan.remove();
        }
    })
    .catch(error => {
        console.error('Erro ao salvar comentário:', error);
        
        const oldErrorSpan = form.querySelector('#error');
        if (oldErrorSpan) {
            oldErrorSpan.remove();
        }

        const newErrorSpan = criarSpanErro(error.message);
        form.appendChild(newErrorSpan);
    });
}