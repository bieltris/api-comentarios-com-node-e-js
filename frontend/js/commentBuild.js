import { pathImg } from './comment.js';
import { toggleReplyForm } from './comment.js';

export function nomeUsuarioComentario(comentario) {
    const divName = document.createElement('div');
    divName.className = 'name';
    divName.textContent = comentario.usuario;
    return divName;
}

export function criarOpcaoEditar() {
    const imgEdit = document.createElement('img');
    imgEdit.src = `${pathImg}/edit.png`;
    imgEdit.alt = 'Editar';
    imgEdit.className = 'edit-comment';
    imgEdit.id = 'edit-comment';
    return imgEdit;
}

export function criarOpcaoDeletar() {
    const imgDelete = document.createElement('img');
    imgDelete.src = `${pathImg}/delete.png`;
    imgDelete.alt = 'Excluir';
    imgDelete.className = 'delete-comment';
    imgDelete.id = 'delete-comment';
    return imgDelete;
}

export function criarFooterComentario() {
    const footer = document.createElement('footer');
    footer.className = 'comment-footer';
    const btnReply = document.createElement('button');
    btnReply.className = 'btn-reply-comment';
    btnReply.textContent = 'Responder';
    footer.appendChild(btnReply);
    return footer;
}


export function criarDivEditable() {
    const divEditable = document.createElement('div');
    divEditable.setAttribute('contenteditable', 'true');
    divEditable.setAttribute('data-placeholder', 'Responda aqui...');
    divEditable.className = 'reply-input';
    divEditable.textContent = divEditable.dataset.placeholder;
    return divEditable;
}

export function criarBotaoResponder() {
    const btnConfirm = document.createElement('button');
    btnConfirm.type = 'submit';
    btnConfirm.className = 'btn-reply';
    btnConfirm.textContent = 'Responder';
    return btnConfirm;
}

export function criarBotaoCancelarResposta() {
    const btnCancel = document.createElement('button');
    btnCancel.type = 'button';
    btnCancel.className = 'btn-cancel';
    btnCancel.textContent = 'Cancelar';
    btnCancel.addEventListener('click', (e) => {
        toggleReplyForm(e.target);
    })
    return btnCancel;
}
