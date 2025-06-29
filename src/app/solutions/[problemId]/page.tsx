'use client'
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { use } from 'react';
import Link from 'next/link';
import useAuth from '@/app/lib/useAuth';
import { useRouter } from 'next/navigation';
interface Solution {
  id: string;
  code: string;
  userId?: string;
  title?: string;
  description?: string;
  createdAt?: any;
}

function Solutions({ params }: { params: Promise<{ problemId: string }> }) {  const { user, loading } = useAuth();
const router = useRouter();
const {problemId} = use(params); 
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchSolutions() {
      console.log("Fetching solutions");
      const sols = await getSolutionsForProblem(problemId);
      console.log("Fetched solutions:", sols);
      setSolutions(sols);
      setLoading(false);
    }
    fetchSolutions();
  }, [problemId]);


if (loading) {
  return <div>Loading...</div>; // Show loader until Firebase checks auth
}

if (!user) {
  router.push("/Authentication");
  return null;
}
  

  async function getSolutionsForProblem(problemId: string) {if (!problemId) {
    console.error("Problem ID is undefined!");
    return [];
  }
    const solutionsRef = collection(db, "problems", problemId, "solutions");
    const q = query(solutionsRef, where("problemId", "==", problemId));

    const querySnapshot = await getDocs(q);
    const sols: Solution[] = [];
    querySnapshot.forEach((doc) => {
      sols.push({ id: doc.id, ...doc.data() } as Solution);
    });
    return sols;
  }

 
  if (Loading) {
    return <div>Loading solutions...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">📋 All Problems</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">#</th>
            <th className="p-3">Title</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>

        {
            solutions.map((sol, index) =>{ 
            

            
              return(
              <tr key={sol.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{sol.title}</td>
                
                <td className="p-3">
                  <Link href={`/solutions/${problemId}/${sol.id}`} className="text-blue-600 underline">
                    View
                  </Link>
                </td>
                
              </tr>
            )})}
            {solutions.length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={4}>
                  No problems available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>

    // <div className="p-4">
    //   <h2 className="text-xl font-semibold mb-4">Solutions for Problem {problemId}</h2>
    //   {solutions.length === 0 ? (
    //     <p>No solutions found.</p>
    //   ) : (
    //     solutions.map((sol) => (
    //       <div key={sol.id} className="border p-4 rounded mb-2 shadow">
    //         <h3 className="font-bold">{sol.title ?? "Untitled Solution"}</h3>
    //         <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{sol.code}</pre>
    //         {sol.description && <p className="text-gray-600">{sol.description}</p>}
    //       </div>
    //     ))
    //   )}
    // </div>
  );
}

export default Solutions;
