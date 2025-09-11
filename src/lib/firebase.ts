import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDpUR5eovtsEtU3yuycy0FpUC-D9QBO3rU",
  authDomain: "hack-7de9f.firebaseapp.com",
  projectId: "hack-7de9f",
  storageBucket: "hack-7de9f.firebasestorage.app",
  messagingSenderId: "135842027753",
  appId: "1:135842027753:web:62f4b6ac85c2a4cc663878"
}

// Firebase 초기화
const app = initializeApp(firebaseConfig)

// Firebase 서비스들
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
