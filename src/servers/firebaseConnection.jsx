import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDkPTbkd7nsBZX4q_J9Ca5GrxBTBCcTKrE",
  authDomain: "tickets-e51b9.firebaseapp.com",
  projectId: "tickets-e51b9",
  storageBucket: "tickets-e51b9.appspot.com",
  messagingSenderId: "432925872629",
  appId: "1:432925872629:web:0ffe7c463451c6e88190bc",
  measurementId: "G-D19420VM8S"
};

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export { auth, db, storage }