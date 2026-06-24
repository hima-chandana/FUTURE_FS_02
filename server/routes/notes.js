import express from 'express';
import { addNote, getNotesByLead, updateNote, deleteNote } from '../controllers/notes.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/lead/:leadId', addNote);
router.get('/lead/:leadId', getNotesByLead);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
