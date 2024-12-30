// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB1XuwIjJXCPZZwbYftHMQRNTidgIHLlCM",
    authDomain: "engage-a9f91.firebaseapp.com",
    projectId: "engage-a9f91",
    storageBucket: "engage-a9f91.firebasestorage.app",
    messagingSenderId: "205051675032",
    appId: "1:205051675032:web:50014729792af97bec6bed",
    measurementId: "G-L6CV0B4741"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
