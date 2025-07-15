import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

// ATTENZIONE: INCOLLA QUI LA TUA CONFIGURAZIONE FIREBASE
// Puoi trovarla nel tuo progetto Firebase:
// Impostazioni progetto > Le tue app > SDK setup and configuration > seleziona "Config"
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvhc9FmzkBhPRwY6BabrWetT1B7B0pFhQ",
  authDomain: "contacicli-red.firebaseapp.com",
  projectId: "contacicli-red",
  storageBucket: "contacicli-red.firebasestorage.app",
  messagingSenderId: "291787864269",
  appId: "1:291787864269:web:10c190e0af0e480f3cd184",
  measurementId: "G-369TDYDWVH"
};

// Inizializza Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inizializza Cloud Firestore ed esportalo per l'uso in altre parti dell'app
export const db = getFirestore(app);