import { db } from '../db-mock.js';
import crypto from 'crypto';

export const createLead = async (req, res) => {
  try {
    const newLead = {
      id: crypto.randomUUID(),
      ...req.body,
      status: req.body.status || 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.leads.push(newLead);
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: "Error creating lead", error: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = [...db.leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error: error.message });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = db.leads.find(l => l.id === id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lead", error: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const leadIndex = db.leads.findIndex(l => l.id === id);
    
    if (leadIndex === -1) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const updateData = {
      ...db.leads[leadIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    db.leads[leadIndex] = updateData;
    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ message: "Error updating lead", error: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    db.leads = db.leads.filter(l => l.id !== id);
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead", error: error.message });
  }
};
