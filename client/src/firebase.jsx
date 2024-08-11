// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-mernstack-e458c.firebaseapp.com",
  projectId: "blog-mernstack-e458c",
  storageBucket: "blog-mernstack-e458c.appspot.com",
  messagingSenderId: "329364995936",
  appId: "1:329364995936:web:efa03e0b1d13daaaafe805"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);










