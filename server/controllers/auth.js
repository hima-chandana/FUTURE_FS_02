import { db } from '../db-mock.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (db.admins.find(a => a.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const newAdmin = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.admins.push(newAdmin);
    res.status(201).json({ message: "User created successfully", id: newAdmin.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = db.admins.find(a => a.email === email);
    
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    let adminIndex = db.admins.findIndex(a => a.id === id);
    if (adminIndex === -1) {
      // Gracefully handle the case where the mock database was reset by the seed script
      db.admins.push({
        id,
        name,
        email,
        passwordHash: 'recovered_hash',
        createdAt: new Date().toISOString()
      });
      adminIndex = db.admins.length - 1;
    } else {
      db.admins[adminIndex].name = name;
      db.admins[adminIndex].email = email;
    }

    // Generate a new token with updated details
    const token = jwt.sign(
      { id, email, name },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      admin: {
        id,
        name,
        email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
