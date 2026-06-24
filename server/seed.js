import { db } from './config/firebase.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  const email = 'admin@minicrm.com';
  const password = 'password123';
  const name = 'Admin User';

  const q = query(collection(db, "admins"), where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await addDoc(collection(db, "admins"), {
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  });

  console.log(`Admin created successfully! Email: ${email}, Password: ${password}`);
  process.exit(0);
};

seedAdmin();
