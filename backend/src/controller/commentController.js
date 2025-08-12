
import * as commentService from '../services/commentService.js';

export function listComments(req, res) {
    const videoId = req.query.videoId;

    if (!videoId) {
        return res.status(400).json({ error: "Erro, video id indefinido;" });
    }

    const commentsForVideo = commentService.findCommentsByVideo(videoId);

    res.json(commentsForVideo);
}

export function createComment(req, res) {
    const { videoId, user, text } = req.body;

    if (!videoId || !user || !text) {
        return res.status(400).json({ error: "Preencha todos os campos, nome e comentario." });
    }

    const newComment = commentService.createComment({ videoId, user, text });

    res.status(201).json(newComment);
}