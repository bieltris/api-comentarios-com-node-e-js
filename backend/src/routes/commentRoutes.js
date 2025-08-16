import express from 'express';
const router = express.Router(); // Get the Express router

// 1. Importando o controller.
import { listComments, createComment, editComment } from '../controller/commentController.js';

// 2. Definindo as rotas e suas ações(funções).
router.get('/comments', listComments);

router.post('/comments', createComment);

router.post('/editComment', editComment)
// 3. Export the router so server.js can use it.
export default router;