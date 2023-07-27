// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/Auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuuGWWqsueWDcKbQAs1qcJ0nRv2rJcEa4",
  authDomain: "lion-trade-e038a.firebaseapp.com",
  projectId: "lion-trade-e038a",
  storageBucket: "lion-trade-e038a.appspot.com",
  messagingSenderId: "568429232611",
  appId: "1:568429232611:web:9b241e5348cc09d04de0d6",
  measurementId: "G-J44TYM14RS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export  const auth = getAuth