document.addEventListener('DOMContentLoaded', () => {

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

        const usuarioInput = document.getElementById('input-usuario');
        const textoInput = document.getElementById('input-texto');
        
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
            usuarioInput.value = '';
            textoInput.value = '';
            carregarComentarios();
        })
        .catch(error => console.error('Erro ao salvar comentário:', error));
    });

});