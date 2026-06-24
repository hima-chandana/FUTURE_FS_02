import express from 'express';
import { createLead, getLeads, getLeadById, updateLead, deleteLead } from '../controllers/leads.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public route for contact form
router.post('/', createLead);

// Protected routes for admin dashboard
router.get('/', verifyToken, getLeads);
router.get('/:id', verifyToken, getLeadById);
router.put('/:id', verifyToken, updateLead);
router.delete('/:id', verifyToken, deleteLead);

export default router;
