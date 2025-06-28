'use client';
import React, { useState, useEffect } from 'react';
import { collectionGroup, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '@/app/lib/firebase';
import { onAuthStateChanged } from "firebase/auth";
import Link from 'next/link';

interface Solution {
  id: string;
  code: string;
  userId?: string;
  Title?: string;
  description?: string;
  problemId?:string;
  createdAt?: any;
}

function Solutions() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  async function getAllSolutionsByUser(userId: string) {
    try {
      const solutionsGroup = collectionGroup(db, "solutions");
      const q = query(solutionsGroup, where("userid", "==", userId));

      const querySnapshot = await getDocs(q);

      const sols: Solution[] = [];
      querySnapshot.forEach((doc) => {
        sols.push({ id: doc.id, ...doc.data() } as Solution);
      });

      return sols;
    } catch (error) {
      console.error("🔥 Error fetching solutions:", error);
      return [];
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ User is logged in:", user.uid);
        const sols = await getAllSolutionsByUser(user.uid);
        console.log("Fetched solutions:", sols);
        setSolutions(sols);
        console.log("my boy",sols);
      } else {
        console.log("❌ No user logged in");
        setSolutions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading solutions...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">📋 Your Solutions</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Title</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((sol, index) => (
              <tr key={sol.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{sol.Title ?? "Untitled"}</td>
                <td className="p-3">
                  <Link href={`/solutions/${sol.problemId}/${sol.id}`} className="text-blue-600 underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {solutions.length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={3}>
                  No solutions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Solutions;
