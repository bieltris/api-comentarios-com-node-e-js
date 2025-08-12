

const db = {
    comentarios: [
        {
            id: 1, videoId: 1, usuario: "Arakaki", texto: "Muito bom o vídeo, aprendi bastante!", respostas: [
                { id: 101, usuario: "Gabriel", texto: "Concordo, a parte sobre injeção foi top!" }
            ]
        },
        { id: 2, videoId: 1, usuario: "Martins", texto: "Alguém sabe o nome da ferramenta do minuto 3:45?", respostas: [] },
        { id: 3, videoId: 2, usuario: "Luciano", texto: "Esse vídeo de câmbio salvou meu dia!", respostas: [] }
    ]
};


function findCommentsByVideo(videoId) {
    return db.comments.filter(c => c.videoId == videoId);
}

function createComment(commentData) {
    console.log(`Service: Creating new comment.`);
    const newComment = {
        id: Date.now(), 
        videoId: parseInt(commentData.videoId),
        user: commentData.user,
        text: commentData.text,
        replies: []
    };
    db.comments.push(newComment);
    return newComment;
}

export default {
    findCommentsByVideo,
    createComment
};