import { criarSpanErro, fraseDeErroVermelha } from './errorHandle.js';
import * as commentBuild from './commentBuild.js';
import { lastDeleteCommentClicked, closePopUp } from './popUp.js';

const path = 'http://localhost:8080/api';
const commentsContainer = document.getElementById('comments-list-container');
export const pathImg = '../images';

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
    const usuarioNome = document.getElementById('input-usuario');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.dataset.commentId = comentario.id;

    const head = document.createElement('header');

    const divName = commentBuild.nomeUsuarioComentario(comentario);
    head.appendChild(divName);

    const divOptions = document.createElement('div');
    divOptions.className = 'comment-options';

    if (usuarioNome.value == comentario.usuario) {
        const imgEdit = commentBuild.criarOpcaoEditar();
        divOptions.appendChild(imgEdit);
        const imgDelete = commentBuild.criarOpcaoDeletar();
        divOptions.appendChild(imgDelete);
    }

    head.appendChild(divOptions);
    commentElement.appendChild(head);

    const divText = document.createElement('div');
    divText.className = 'comment-text';
    divText.textContent = comentario.texto;
    divText.setAttribute('contenteditable', 'false');
    commentElement.appendChild(divText);

    const editOptions = commentBuild.criarDivOptions();
    commentElement.appendChild(editOptions);

    const footer = commentBuild.criarFooterComentario();
    commentElement.appendChild(footer);

    return commentElement;
}



function criarFormularioReposta() {
    const form = document.createElement('form');
    form.className = 'reply-form';
    form.style.display = 'none';

    const div = document.createElement('div');
    div.className = 'comment-replies';

    const divEditable = commentBuild.criarDivEditable();
    div.appendChild(divEditable);

    const replyActions = document.createElement('div');
    replyActions.className = 'reply-actions';
    div.appendChild(replyActions);

    const btnConfirm = commentBuild.criarBotaoResponder();
    const btnCancel = commentBuild.criarBotaoCancelarResposta();

    replyActions.appendChild(btnConfirm);
    replyActions.appendChild(btnCancel);
    form.appendChild(div);

    return form;
}



export function enviarComentario(event, videoId) {
    event.preventDefault();

    const form = event.target;
    const divEditable = form.querySelector('div[contenteditable="true"]');
    const usuarioInput = document.querySelector('#input-usuario');
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

export function toggleReplyForm(button) {
    const form = button.closest('.comment').querySelector('form');
    const comment = button.closest('.comment');
    const AllForms = document.querySelectorAll(".reply-form");

    const isVisible = form.style.display === 'block';

    AllForms.forEach(form => {
        const editOptions = form.closest('.comment').querySelector('.edit-options');
        form.style.display = 'none';
        if (editOptions.style.display === 'flex') return;
        form.closest('.comment').querySelector("footer").style.display = 'block'
    });

    form.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        const divEditable = form.querySelector('div[contenteditable="true"]');
        divEditable.textContent = divEditable.dataset.placeholder;
        divEditable.style.color = '';
        divEditable.focus();
        const footer = button.closest('footer');
        footer.style.display = 'none';
    } else {
        const footer = comment.querySelector('footer');
        footer.style.display = 'block';
    }

}


export function editComment(button) {
    const comment = button.closest(".comment");
    const id = comment.dataset.commentId;
    const divEditable = comment.querySelector("div[contenteditable='true']");
    const usuario = document.querySelector('#input-usuario');

    const novoTexto = {
        commentId: id,
        texto: divEditable.textContent,
        usuario: usuario.value
    }

    console.log(novoTexto);

    fetch(`${path}/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoTexto),
    })
        .then(async response => {
            if (!response.ok) {
                const err = await response.json();
                throw new Error(`${err.error}`);
            }
            return response;
        })
        .then(response => {
            toggleEditDiv(comment);
            const erro = comment.querySelector("#error");
            if (erro) erro.remove();
        })
        .catch((err) => {
            const erro = comment.querySelector("#error");
            if (erro) erro.remove();

            const span = fraseDeErroVermelha(err);
            comment.appendChild(span);
        })
}

let ultimoEditBtnClicked = null;
export function toggleEditDiv(target) {
    const comentario = target.closest(".comment");
    const divEditable = comentario.querySelector("div[contenteditable]");
    const editOption = comentario.querySelector(".edit-options");
    const footer = comentario.querySelector('footer');
    const formReply = comentario.querySelector('form');

    const isVisible = editOption.style.display === 'flex';

    editOption.style.display = isVisible ? 'none' : 'flex';
    footer.style.display = !isVisible ? 'none' : 'block';
    divEditable.setAttribute("contenteditable", isVisible ? "false" : "true");
    if (ultimoEditBtnClicked && ultimoEditBtnClicked != target) {
        const comentario = ultimoEditBtnClicked.closest(".comment");
        const divEditable = comentario.querySelector("div[contenteditable]");
        const editOption = comentario.querySelector(".edit-options");
        const footer = comentario.querySelector('footer');
        const formReply = comentario.querySelector('form');
        editOption.style.display = 'none';
        divEditable.setAttribute("contenteditable", "false");
        if (formReply.style.display === 'block') return;
        footer.style.display = 'block';
    }
    ultimoEditBtnClicked = target;
}


export function deleteComentario() {

    const btnDeleteCommentClicked = lastDeleteCommentClicked;
    const comment = btnDeleteCommentClicked.closest('.comment');
    const commentId = comment.dataset.commentId;
    const usuario = document.getElementById('input-usuario');
    const dataComentario = {
        usuario: usuario.value,
    }

    fetch(`${path}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataComentario)
    })
    .then(async response => {
        if(!response.ok) {
                const err = await response.json();
                throw new Error(`${err.error}`);
        }
        return response.json();
    })
    .then(data => {
        comment.classList.add('deleting');
        comment.addEventListener('animationend', function animartionRemoveComment(e) {
            e.target.style.display = 'none';
            comment.removeEventListener('animationend', animartionRemoveComment);
        })
        const btnClosePop = document.querySelector('.pop-close');
        closePopUp(btnClosePop);
    })
    .catch(error => {
        console.error(`Error: ${error}`);
        const span = criarSpanErro(error);
        comment.appendChild(span);
    })

}