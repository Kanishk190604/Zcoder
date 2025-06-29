'use client';
import React from "react";
import { useRouter } from "next/navigation";
import {useEffect} from "react"
import { db } from "../lib/firebase";
import { auth } from "../lib/firebase";
import { updateDoc,doc } from "firebase/firestore";
interface Props {
  codeOutput: string[];
  expectedOutput: any;
  inputs: any;
  ID:any;
  code:any;
}

const SubmissionResult: React.FC<Props> = ({ codeOutput, expectedOutput, inputs,ID,code }) => {
  const router = useRouter();

  const firstMismatchIndex = codeOutput.findIndex((output, i) =>
    (output ?? "").trim() !== (expectedOutput[i].output ?? "").trim()
  );

  // ✅ All test cases passed
  useEffect(() => {async function ChangeStatus(){ const user = auth.currentUser;
    await updateDoc(doc(db, "users", user!.uid, "problemlist", ID), {
    status: true, // or "completed"
  });
}
if (firstMismatchIndex === -1) {

ChangeStatus();}
   
  
   
  }, [ID])
  
  if (firstMismatchIndex === -1) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-md">
        <p>✅ All test cases passed!</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Go to Dashboard
        </button>
        <button
           onClick={() =>{const encryptedcode=encodeURIComponent(code)
            router.push(`/submit/${ID}?code=${encryptedcode}`)}
           
          }
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
         Add solution
        </button>
      </div>
    );
  }

  // ❌ Show first failed test case
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md">
      <p>❌ Some test cases failed.</p>
      <div className="mt-3">
        <p><strong>Input:</strong></p>
        <pre className="bg-white p-2 rounded">{inputs[firstMismatchIndex].input}</pre>
        <p className="mt-2"><strong>Expected Output:</strong></p>
        <pre className="bg-white p-2 rounded">{expectedOutput[firstMismatchIndex].output}</pre>
        <p className="mt-2"><strong>Your Output:</strong></p>
        <pre className="bg-white p-2 rounded">{codeOutput[firstMismatchIndex]}</pre>
      </div>
    </div>
  );
};

export default SubmissionResult;

