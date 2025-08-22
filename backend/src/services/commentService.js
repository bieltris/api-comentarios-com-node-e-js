

const db = {
    comments: [
        {
            id: 1, videoId: 1, usuario: "Arakaki", texto: "Muito bom o vídeo, aprendi bastante!", respostas: [
                { id: 101, usuario: "Gabriel", texto: "Concordo, a parte sobre injeção foi top!" }
            ]
        },
        { id: 2, videoId: 1, usuario: "Martins", texto: "Alguém sabe o nome da ferramenta do minuto 3:45?", respostas: [] },
        { id: 3, videoId: 2, usuario: "Luciano", texto: "Esse vídeo de câmbio salvou meu dia!", respostas: [] }
    ]
};


export function findCommentsByVideo(videoId) {
    return db.comments.filter(c => c.videoId == videoId);
}

export function buildComment(commentData) {
    console.log(`Service: Creating new comment.`);
    const newComment = {
        id: Date.now(),
        videoId: parseInt(commentData.videoId),
        usuario: commentData.user,
        texto: commentData.text,
        respostas: []
    };
    db.comments.push(newComment);
    return newComment;
}


export function editCommentInDb(dataComentario) {
    const comentario = db.comments.find(com => com.id == dataComentario.commentId);


    if (!comentario) {
        return { success: false, error: "Comentário não encontrado." };
    }

    if (dataComentario.usuario !== comentario.usuario) {
        return { success: false, error: "Você não tem permissão para editar este comentário." };
    }

    comentario.texto = dataComentario.texto;

    console.log("Comentário atualizado no 'DB':", comentario);

    return { success: true, data: comentario };
}

export function deleteCommentById(dataComentario) {
    const { commentId, usuario } = dataComentario;

    const commentIndex = db.comments.findIndex(comment => comment.id === commentId);

    if (commentIndex === -1) {
        return { success: false, error: "Comentário não encontrado." };
    }

    const comentario = db.comments[commentIndex];

    if (usuario !== comentario.usuario) {
        return { success: false, error: "Você não tem permissão para deletar este comentário." };
    }

    db.comments.splice(commentIndex, 1);

    return { success: true };

}