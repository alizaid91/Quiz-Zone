import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCH1MDPkbMkk4i19isNWFcc4urZ8HIXFAQ",
  authDomain: "quiz-zone-eabbf.firebaseapp.com",
  projectId: "quiz-zone-eabbf",
  storageBucket: "quiz-zone-eabbf.appspot.com",
  messagingSenderId: "18718187190",
  appId: "1:18718187190:web:c992203af18fc2be7b9017",
  measurementId: "G-HWCS7XBWC2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;
