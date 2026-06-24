import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVQXRGEvXf2IFigy8EG26U3k0sg_i58-8",
  authDomain: "minicrm-5c1d1.firebaseapp.com",
  projectId: "minicrm-5c1d1",
  storageBucket: "minicrm-5c1d1.firebasestorage.app",
  messagingSenderId: "231654909877",
  appId: "1:231654909877:web:f0660d4ceef73716f85bfc",
  measurementId: "G-C41BR0YXPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
