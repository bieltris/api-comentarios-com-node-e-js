
import { findCommentsByVideo, buildComment } from '../services/commentService.js';

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