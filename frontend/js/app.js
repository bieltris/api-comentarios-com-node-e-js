
import { setupDivEditables, carregarComentarios, enviarComentario, toggleReplyForm, toggleEditDiv, editComment } from './comment.js';

export let videoId = 1;

document.addEventListener('DOMContentLoaded', () => {

    const path = 'http://localhost:3000/api'

    document.addEventListener('click', (event) => {
        const target = event.target;

        if (target.closest('button.btn-reply-comment')) {
            toggleReplyForm(target);
        }

        if(target.closest(".edit-comment") || target.closest('.btn-cancel-confirm')) {
            toggleEditDiv(target);
        }

        if(target.closest('.btn-edit-confirm')) {
            editComment(target);
        }
    });
    document.addEventListener('focusin', (event) => {
        const target = event.target;

        if (target.closest('div[contenteditable="true"]')) {
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
    
    
    const form = document.getElementById('form-novo-comentario');
    form.addEventListener('submit', (event) => enviarComentario(event, videoId));
    carregarComentarios(videoId);

});