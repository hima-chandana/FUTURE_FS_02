import express from 'express';
import { createFollowUp, getFollowUps, updateFollowUp, deleteFollowUp } from '../controllers/followUps.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createFollowUp);
router.get('/', getFollowUps);
router.put('/:id', updateFollowUp);
router.delete('/:id', deleteFollowUp);

export default router;
