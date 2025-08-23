import express from 'express';
const router = express.Router(); 

import { listComments, createComment, editComment, deleteComment } from '../controller/commentController.js';

router.get('/', listComments);

router.post('/', createComment);

router.put('/', editComment)

router.delete('/:id', deleteComment);

export default router;