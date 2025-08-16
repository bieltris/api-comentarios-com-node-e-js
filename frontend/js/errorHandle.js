
export function criarSpanErro(mensagem){
    const span = document.createElement('span');
    span.id = 'error';
    span.className = 'alert alert-danger text-danger small';
    span.textContent = mensagem;
    return span;
}


export function fraseDeErroVermelha(mensagem){
    const span = document.createElement('span');
    span.id = 'error';
    span.className = 'text-danger small';
    span.textContent = mensagem;
    span.style.background = '#d3e6ffff';
    span.style.borderRadius = '3px';
    span.style.padding = '2px';
    span.style.marginTop = '2px';
    return span;
}