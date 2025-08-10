export const divEditables = document.querySelectorAll('div[contenteditable="true"]');

export function setupDivEditables() {
    console.log('Configurando divs editaveis');
    function resizeDivEditable(div) {
        div.style.height = 'auto';
        div.style.height = div.scrollHeight + 'px';
    }
    function sincronizarInputHidden(div) {
        const inputHidden = div.closest('form').querySelector('input[type="hidden"]');
        inputHidden.value = div.textContent.trim() === div.dataset.placeholder ? '' : div.textContent;
        inputHidden.dispatchEvent(new Event('input')); // Dispara o evento de input para atualizar
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