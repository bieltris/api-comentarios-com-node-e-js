
import { setupDivEditables, carregarComentarios, enviarComentario } from './comment.js';

document.addEventListener('DOMContentLoaded', () => {

    const path = 'http://localhost:3000/api'

    document.addEventListener('click', (event) => {

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
    
    let videoId = 1;
    
    const form = document.getElementById('form-novo-comentario');
    form.addEventListener('submit', (event) => enviarComentario(event, videoId));
    carregarComentarios(videoId);

});