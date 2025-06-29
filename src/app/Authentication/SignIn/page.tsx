'use client';
import { useState } from 'react';



import { app } from "../../lib/firebase";
import { getAuth, signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth(app);


const provider = new GoogleAuthProvider();


export default function SignIn() {const GoogleSignIn=()=>{
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential!.accessToken;
    // The signed-in user info.
    //const user = result.user;
   


// Set token in cookie
document.cookie = `token=${token}; path=/`
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {console.log(error);
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // // The email of the user's account used.
    // const email = error.customData.email;
    // // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // // ...
  });
}
    const signinUser=(email:string,password:string)=>{
       
        signInWithEmailAndPassword (auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(error);
    console.error(errorCode);
    console.error(errorMessage);
    // ..
  });
    }


   

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [message, setMessage] = useState('');

  const handleSignin = async (e: React.FormEvent) => {e.preventDefault();
    signinUser(email,password);  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign IN</h2>

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
          Sign In
        </button>
        <button
          className="w-full bg-blue-600 text-white my-2 py-2 rounded hover:bg-blue-700 transition "
          onClick={GoogleSignIn}
        >
          Sign In With Google
        </button>

        {/* {message && (
          <div className="mt-4 text-sm text-center text-gray-700">{message}</div>
        )} */}
      </form>
    </div>
  );
}

    




