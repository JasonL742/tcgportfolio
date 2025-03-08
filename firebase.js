// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRIF4544FjnRrTMxEaYpk9KsUga15dqgg",
  authDomain: "tcgportfolio-94e6f.firebaseapp.com",
  projectId: "tcgportfolio-94e6f",
  storageBucket: "tcgportfolio-94e6f.firebasestorage.app",
  messagingSenderId: "153714450173",
  appId: "1:153714450173:web:45ae3732b3df2ca7186894",
  measurementId: "G-B1FCVWP95W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };