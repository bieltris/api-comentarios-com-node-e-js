
import { findCommentsByVideo, buildComment, editCommentInDb, deleteCommentById } from '../services/commentService.js';

export function listComments(req, res) {
    const videoId = req.query.videoId;

    if (!videoId) {
        return res.status(400).json({ error: "Erro, video id indefinido;" });
    }

    const commentsForVideo = findCommentsByVideo(videoId);

    res.json(commentsForVideo);
}

export function createComment(req, res) {
    const { id } = req.params;
    const { videoId, user, text, type } = req.body;

    if (!videoId || !user || !text || !type) {
        return res.status(400).json({ error: "Preencha todos os campos, nome e comentario." });
    }

    const newComment = buildComment({ id, videoId, user, text, type });

    res.status(201).json(newComment);
}

export function editComment(req, res) {
    const { commentId, texto, usuario } = req.body;

    if (!usuario) {
        return res.status(401).json({ error: "Preencha seu Nome!" });
    } else if (!texto) {
        return res.status(401).json({ error: "Apague o comentario!" });
    }

    const editou = editCommentInDb({ commentId, texto, usuario });

    if (!editou.success) {
        return res.status(401).json({ error: editou.error });
    }
    return res.status(201).json(editou);
}

export function deleteComment(req, res) {
    const { usuario } = req.body;
    const { id } = req.params;
    const commentId = parseInt(id);

    if (!commentId) {
        return res.status(400).json({ error: "Comment ID is invalid." });
    }

    const result = deleteCommentById({ commentId, usuario });

    if (result.success) {
        return res.status(200).json({ message: "Comentario apagado com sucesso" });
    } else {
        if (result.error.includes("permissão")) {
            return res.status(403).json({ error: result.error });
        }
        if (result.error.includes("encontrado")) {
            return res.status(404).json({ error: result.error });
        }

        return res.status(500).json({ error: result.error });
    }
}