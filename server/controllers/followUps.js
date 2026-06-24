import { db } from '../db-mock.js';
import crypto from 'crypto';

export const createFollowUp = async (req, res) => {
  try {
    const newFollowUp = {
      id: crypto.randomUUID(),
      ...req.body,
      status: req.body.status || 'Pending',
      createdAt: new Date().toISOString()
    };

    db.followUps.push(newFollowUp);
    res.status(201).json(newFollowUp);
  } catch (error) {
    res.status(500).json({ message: "Error creating follow-up", error: error.message });
  }
};

export const getFollowUps = async (req, res) => {
  try {
    const followUps = [...db.followUps].sort((a, b) => new Date(a.date) - new Date(b.date));
    res.status(200).json(followUps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching follow-ups", error: error.message });
  }
};

export const updateFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const index = db.followUps.findIndex(f => f.id === id);
    
    if (index !== -1) {
      db.followUps[index] = { ...db.followUps[index], ...req.body };
      res.status(200).json(db.followUps[index]);
    } else {
      res.status(404).json({ message: "Follow-up not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating follow-up", error: error.message });
  }
};

export const deleteFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    db.followUps = db.followUps.filter(f => f.id !== id);
    res.status(200).json({ message: "Follow-up deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting follow-up", error: error.message });
  }
};
