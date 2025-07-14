import * as firebaseApp from "firebase/app";
import { getFirestore } from "firebase/firestore";

// La configurazione Firebase della tua web app.
// Questa configurazione è legata al tuo progetto specifico.
const firebaseConfig = {
  apiKey: "AIzaSyCvhc9FmzkBhPRwY6BabrWetT1B7B0pFhQ",
  authDomain: "contacicli-red.firebaseapp.com",
  projectId: "contacicli-red",
  storageBucket: "contacicli-red.appspot.com",
  messagingSenderId: "291787864269",
  appId: "1:291787864269:web:10c190e0af0e480f3cd184",
  measurementId: "G-369TDYDWVH"
};

// Inizializza Firebase
const app = firebaseApp.initializeApp(firebaseConfig);

// Inizializza Cloud Firestore ed esportalo per l'uso in altre parti dell'app
export const db = getFirestore(app);
