'use client'
import React,{use, useEffect, useState} from 'react'
import { doc, getDoc } from "firebase/firestore";

import { collectionGroup, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

function solution({ params }: { params: Promise<{ solId: string; problemId:string }> }) {const {solId,problemId} = use(params);

const [sol, setSol] = useState<any>(null);

async function getSolution(problemId: string, solId: string) {
  if (!problemId || !solId) {
    console.error("Problem ID or Solution ID is undefined!");
    return null;
  }
  const docRef = doc(db, "problems", problemId, "solutions", solId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("❌ Document not found");
    return null;
  }
}

useEffect(() => {
  const fetchData = async () => {
    const solutionData = await getSolution(problemId, solId);
    if (solutionData) {
      setSol(solutionData);
      console.log("Here is the solution data:", solutionData);
    }
  };

  fetchData();
}, [problemId, solId]);

console.log("State sol:", sol);

return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      {sol && <h2 className="text-2xl font-bold mb-4 border-b pb-2"> {sol.title}</h2>}
  
      {sol ? (
        <>
          <div className="mb-4">
           
            <p><span className="font-semibold">Aproach:</span> {sol.description}</p>
           
          </div>
  
          <div>
            <p className="font-semibold mb-1">Code:</p>
            <pre className="bg-gray-100 text-sm p-4 rounded overflow-x-auto">
  {sol.code}
            </pre>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Loading solution...</p>
      )}
    </div>
  );
}

export default solution;