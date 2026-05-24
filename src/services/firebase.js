// Import the initializeApp function from the Firebase app SDK
import { initializeApp } from "firebase/app";
// Import getAuth and GoogleAuthProvider from the Firebase auth SDK
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Import getFirestore from the Firebase firestore SDK
import { getFirestore } from "firebase/firestore";

// Define the Firebase configuration object using the obtained SDK credentials
const firebaseConfig = {
// Set the Firebase project ID
  projectId: "gen-lang-client-0924742674",
// Set the Firebase web app ID
  appId: "1:286402347315:web:710ef20666fdd317d2be46",
// Set the Firebase storage bucket URL
  storageBucket: "gen-lang-client-0924742674.firebasestorage.app",
// Set the Firebase API key for authentication and requests
  apiKey: "AIzaSyD9V-sHm2wBJiVVLqLyQiVCRX8a1fIucrM",
// Set the Firebase auth domain for OAuth redirects
  authDomain: "gen-lang-client-0924742674.firebaseapp.com",
// Set the Firebase messaging sender ID
  messagingSenderId: "286402347315",
// Set the Google Analytics measurement ID
  measurementId: "G-K76VK50C02"
// Close the configuration object
};

// Initialize the Firebase application instance
const app = initializeApp(firebaseConfig);

// Initialize and export the Firebase authentication service
export const auth = getAuth(app);

// Initialize and export the Google authentication provider
export const googleProvider = new GoogleAuthProvider();

// Initialize and export the Cloud Firestore database service
export const db = getFirestore(app);
