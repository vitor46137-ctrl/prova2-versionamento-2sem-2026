import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAfRoQarYBHPvAmcsH_lwByUJIVOjPqafM",
  authDomain: "provafilipe2.firebaseapp.com",
  projectId: "provafilipe2",
  storageBucket: "provafilipe2.firebasestorage.app",
  messagingSenderId: "235096233656",
  appId: "1:235096233656:web:68bac20bb92f62e5ad064d",
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);