import { db } from '../db-mock.js';
import crypto from 'crypto';

export const addNote = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { content, adminName } = req.body;

    const newNote = {
      id: crypto.randomUUID(),
      leadId,
      content,
      adminName: adminName || req.user?.name || 'Admin',
      createdAt: new Date().toISOString()
    };

    db.notes.push(newNote);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error adding note", error: error.message });
  }
};

export const getNotesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const notes = db.notes
      .filter(n => n.leadId === leadId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const noteIndex = db.notes.findIndex(n => n.id === id);
    
    if (noteIndex !== -1) {
      db.notes[noteIndex].content = req.body.content;
      res.status(200).json(db.notes[noteIndex]);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    db.notes = db.notes.filter(n => n.id !== id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};
