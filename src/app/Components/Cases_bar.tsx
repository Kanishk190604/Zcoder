// components/TestCaseTabs.tsx
'use client'
import { useState,useEffect } from "react";

import { db } from "@/app/lib/firebase";
import { doc,getDoc } from "firebase/firestore";




// interface Problem {
//     id: string;
//     title: string;
//     description: string;
//     uid: string;  
//     run_test_cases:any;
//     submit_test_cases:any;


//   }
const TestCaseTabs = (props:any) => {      
  const [activeTab, setActiveTab] = useState(0);
  const { id,codeOutput,codeError } = props; // unwrap async params
 
  const [problems, setProblems] = useState<any>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {   async function fetchUserProblems() {
    setLoading(true);
    const docRef = doc(db, "problems", id); // problemId is the document ID
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  const question = {
    id: docSnap.id,
    ...docSnap.data()
  };
  console.log("Found problem:", question);
  setProblems(question);
  setLoading(false);
} else {
  console.log("❌ Problem not found");
}

  
    setLoading(false);
   
  
    
  }

  fetchUserProblems(); 
    
  
  }, [])
  
  
  

 
  console.log("This is active tab",codeOutput);
  console.log("error",codeError);
  console.log("testCases",problems);

  
    return (
        <>
          {loading ? (
            <div className="p-4">Loading test cases...</div>
          ) : problems?.run_test_cases ? (
            <div className="p-4 border rounded-md">
              <div className="flex space-x-4 mb-4">
                {problems.run_test_cases.map((_:any, index:any) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === index ? "bg-blue-500 text-white" : "bg-gray-200"
                    } flex items-center gap-2`}
                    onClick={() => setActiveTab(index)}
                  >
                    <div>Test Case {index + 1}</div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        codeOutput[activeTab]?.trim() === problems.run_test_cases[activeTab].output?.trim()
                          ? "bg-green-500"
                          : "bg-red-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
      
              <div className="border p-4 rounded bg-gray-50">
                <div className="flex gap-5">
                  <strong>Input:</strong>
                  <pre>{problems.run_test_cases[activeTab].input}</pre>
                </div>
                <div className="flex gap-5">
                  <strong>Expected Output:</strong>
                  <pre>{problems.run_test_cases[activeTab].output}</pre>
                </div>
                <div className="flex gap-5">
                  <strong>Output:</strong>
                  <pre
                    className={
                      codeOutput[activeTab]?.trim() === problems.run_test_cases[activeTab].output.trim()
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {codeOutput[activeTab]}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-red-500">No test cases available.</div>
          )}
        </>
      );
      
  
};

export default TestCaseTabs;




