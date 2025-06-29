"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
export default function Navbar() {const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);
const handleLogout = () => {
  
  signOut(auth).then(() => {
    console.log("Signed out");
  });
  router.push("/Authentication/SignIn");

};
useEffect(() => {
  // Check login status on mount
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser); // User is signed in
    } else {
      setUser(null); // No user signed in
    }
  });

  return () => unsubscribe(); // Cleanup listener
}, [auth]);


  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold"><Link href={"/"}>Zcoder</Link></h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/user/problem_list" className="hover:text-gray-200">
            Problem Set
          </Link>
          <Link href="/user/create" className="hover:text-gray-200">
            Create Problems
          </Link>
          <Link href="/user/myproblem" className="hover:text-gray-200">
            Created Problems
          </Link>
          <Link href="/user/solutions" className="hover:text-gray-200">
            Created Solutions
          </Link>
          {user &&<button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>}
        </div>
        {/* Hamburger Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
          <Link href="/problem-set" className="hover:text-gray-300">
            Problem Set
          </Link>
          <Link href="/user/create" className="hover:text-gray-300">
            Create Problems
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
