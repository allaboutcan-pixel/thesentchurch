import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGHOO7iTNiGa3TIl_iBH28Iv8jrE1CsM0",
    authDomain: "the-sent-church.firebaseapp.com",
    projectId: "the-sent-church",
    storageBucket: "the-sent-church.appspot.com",
    messagingSenderId: "507895649830",
    appId: "1:507895649830:web:fda6e55284bef8941df8e7" // Adjusted to web format based on iOS key
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
