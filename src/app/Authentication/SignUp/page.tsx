'use client';
import { useState } from 'react';

//import { initializeApp } from "firebase/app";
import { db } from "@/app/lib/firebase"; // Ensure your firebase config is correct
import { collection,getDocs,setDoc,doc,getDoc } from "firebase/firestore";


import { app } from "../../lib/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);


export default function Signup() {
    const signupUser=(email:string,password:string)=>{ 
       
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
   console.log(userCredential)
  })
  .catch((error) => {console.log(error);
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // // ..
  });
    }


   

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [message, setMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {e.preventDefault();
    console.log("button Clicked");
    signupUser(email,password);  
    console.log("function Clicked");
   
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email,
      });
  
      console.log("✅ New user added to Firestore");
      const problemSnapshot = await getDocs(collection(db, "problems",));
      


      // ✅ Step 3: Add each problem to this user's problemlist
       problemSnapshot.docs.map((problemDoc) => {
        const problemId = problemDoc.id;
        const problemStatusRef = doc(db, "users", user.uid, "problemlist", problemId);
  
        return setDoc(problemStatusRef, {
          question_id: problemDoc.id,
          status: false,
        });});
    } else {
      console.log("ℹ️ User already exists");
    }};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        {/* {message && (
          <div className="mt-4 text-sm text-center text-gray-700">{message}</div>
        )} */}
      </form>
    </div>
  );
}

    




