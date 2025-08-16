
import { findCommentsByVideo, buildComment, editCommentInDb } from '../services/commentService.js';

export function listComments(req, res) {
    const videoId = req.query.videoId;

    if (!videoId) {
        return res.status(400).json({ error: "Erro, video id indefinido;" });
    }

    const commentsForVideo = findCommentsByVideo(videoId);

    res.json(commentsForVideo);
}

export function createComment(req, res) {
    const { videoId, user, text } = req.body;

    if (!videoId || !user || !text) {
        return res.status(400).json({ error: "Preencha todos os campos, nome e comentario." });
    }

    const newComment = buildComment({ videoId, user, text });

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

    if(!editou.success) {
        return res.status(401).json({ error: editou.error });
    }
    return res.status(201).json(editou);
}