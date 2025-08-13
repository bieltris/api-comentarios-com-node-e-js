
export function criarSpanErro(mensagem){
    const span = document.createElement('span');
    span.id = 'error';
    span.className = 'alert alert-danger text-danger small';
    span.textContent = mensagem;
    return span;
}