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

                const commentElement = criarComentarioElementHtml(comentario);
                const form = criarFormularioReposta();

                commentElement.appendChild(form);
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => {
            commentsContainer.innerHTML = `<p style="color: red;">Falha ao carregar: ${error.message}</p>`;
            console.error(error);
        });
}

function criarComentarioElementHtml(comentario) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    const head = document.createElement('header');
    head.className = 'name';
    head.textContent = comentario.usuario;
    commentElement.appendChild(head);
    const divText = document.createElement('div');
    divText.className = 'comment-text';
    divText.textContent = comentario.texto;
    commentElement.appendChild(divText);
    return commentElement;
}

function criarFormularioReposta() {
    const form = document.createElement('form');
    form.className = 'reply-form';

    const div = document.createElement('div');
    div.className = 'comment-replies';

    const divEditable = criarDivEditable();
    div.appendChild(divEditable);

    const replyActions = document.createElement('div');
    replyActions.className = 'reply-actions';
    div.appendChild(replyActions);

    const btnConfirm = criarBotaoResponder();
    const btnCancel = criarBotaoCancelarResposta();

    replyActions.appendChild(btnConfirm);
    replyActions.appendChild(btnCancel);
    form.appendChild(div);

    return form;
}

function criarDivEditable() {
    const divEditable = document.createElement('div');
    divEditable.setAttribute('contenteditable', 'true');
    divEditable.setAttribute('data-placeholder', 'Responda aqui...');
    divEditable.className = 'reply-input';
    divEditable.textContent = divEditable.dataset.placeholder;
    return divEditable;
}

function criarBotaoResponder() {
    const btnConfirm = document.createElement('button');
    btnConfirm.type = 'submit';
    btnConfirm.className = 'btn-reply';
    btnConfirm.textContent = 'Responder';
    return btnConfirm;
}

function criarBotaoCancelarResposta() {
    const btnCancel = document.createElement('button');
    btnCancel.type = 'button';
    btnCancel.className = 'btn-cancel';
    btnCancel.textContent = 'Cancelar';
    btnCancel.addEventListener('click', () => {
        divEditable.textContent = divEditable.dataset.ploaceholder;
        divEditable.style.color = '';
        divEditable.blur();
        const form = div.closest('form');
        form.style.diplay = 'none';
    })
    return btnCancel;
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