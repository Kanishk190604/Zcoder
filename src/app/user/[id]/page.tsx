'use client';

import TestCaseTabs from "@/app/Components/Cases_bar";
import ErrorMessage from "@/app/Components/Error";
import LoadingSpinner from "@/app/Components/Loader";
import SubmissionResult from "@/app/Components/Submit_result";
import React, { useState, use, useEffect } from 'react';
import {collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { doc,getDoc } from "firebase/firestore";
import Link from "next/link";

 // your Firestore export


// interface Problem {
//     id: string;
//     run_test_cases:any;
//     description: string;
//     uid: string;  
//     createdAt:any;
//     submit_test_cases:any;
//     title: string;

//   }

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const { id } = use(params); // unwrap async params

const[Solutions,setSolutions]=useState([]);

async function getSolutionsForProblem(problemId:any) {
  const solutionsRef = collection(db,"problems",problemId,"solutions");
  const q = query(solutionsRef, where("problemId", "==", problemId));

  const querySnapshot = await getDocs(q);
  const solutions:any = [];
  querySnapshot.forEach((doc) => {
    solutions.push({ id: doc.id, ...doc.data() });
  });
  

  return solutions;
}


useEffect(() => {
  async function fetchSolutions() {console.log("Fetching solution")
    const sols = await getSolutionsForProblem(id);
    console.log("hi",sols)
    setSolutions(sols);
  }
  fetchSolutions();
  
}, [id]);
console.log("These are the solutions:", Solutions);

  const [code, setCode] = useState<string>('');
  const [Language, setLanguage] = useState<string>("Python");
  const [CodeOutput, setCodeOutput] = useState<string[]>([]);
  const [CodeError, setCodeError] = useState<string[]>([]);
  const [SubmitOutput, setSubmitOutput] = useState<string[]>([]);
  //const [SubmitError, setSubmitError] = useState<string[]>([]);
  const[Run,SetRun]=useState<boolean>(false);
  const[Loading,SetLoading]=useState<boolean>(false);
  const [ShowResult, setShowResult] = useState(false);
  // const [firstFailed, setFirstFailed] = useState<null | {
  //   input: string;
  //   expected: string;
  //   actual: string;
  // }>(null);


  const [problems, setProblems] = useState<any>();
 // const [loading, setLoading] = useState(true);
  useEffect(() => {   async function fetchUserProblems() {
    //setLoading(true);
    const docRef = doc(db, "problems", id); // problemId is the document ID
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  const question = {
    id: docSnap.id,
    ...docSnap.data()
  };
  console.log("Found problem:", question);
  setProblems(question);
  //setLoading(false);
} else {
  console.log("❌ Problem not found");
}

  
    
  }

  fetchUserProblems(); 
    
  
  }, [id])
  
  ;

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(false);
    setCodeOutput([]);
    setCodeError([]);
    SetRun(true);
   // setFirstFailed(null); // reset
  
    const outputs: string[] = [];
    const errors: string[] = [];
  
    if (problems) {
      for (let i = 0; i < problems.submit_test_cases.length; i++) {
        const element = problems.submit_test_cases[i].input;
  
        const res = await fetch("/api/compiler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: Language,
            version: "10.2.0",
            source: code,
            testcase: element,
          }),
        });
  
        const data = await res.json();
        const actual = (data.run?.stdout ?? "").trim();
       // const expected = problems.submit_test_cases[i].output.trim();
  
        outputs.push(actual);
        errors.push(data.run?.stderr ?? "");
  
       
  
        await new Promise((res) => setTimeout(res, 200)); // avoid rate limit
      }
  
      setSubmitOutput(outputs);
      setCodeError(errors);
      setShowResult(true);
    }
  };


  const handleRun = async (e: React.FormEvent) => {SetLoading(true)
    SetRun(false);
    setCodeOutput([])
    setCodeError([])
    e.preventDefault();
    console.log("This is problem",problems);
    for (const element of problems!.run_test_cases) {
        
        const res = await fetch("/api/compiler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: Language,
          version: "10.2.0",
          source: code,
          testcase:element.input
        }),
      });
    
      const data = await res.json();
      console.log('Full response:', data);

      if (data.run && typeof data.run.stdout !== 'undefined') {console.log('INPUT',element)
       
        setCodeOutput((prev)=>[...prev,data.run.stdout]);
        setCodeError((prev)=>[...prev,data.run.stderr]);
         console.log('Output:',CodeOutput);
;
        console.log('Error',data.run.stderr);
      } else if (data.output) {
        console.log('Output:', data.output);
      } else if (data.message) {
        console.error('API error message:', data.message);
      } else {
        console.log('Unexpected API response structure', data);
      }
    await delay(200);}
        
     ;
     SetLoading(false);
     SetRun(true);
     console.log("output before transfer",CodeOutput);
  };

  return (
    <div>
      <div className="flex">
        {/* Question Description */}
        {ShowResult?<SubmissionResult codeOutput={SubmitOutput} expectedOutput={problems!.submit_test_cases}  inputs={problems!.submit_test_cases} ID={id} code={code}/>:
            <div className=" bg-gray-100 p-4 rounded-md overflow-auto w-3/5">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {problems? problems.description : "We ran into a problem."}
          </pre>
        </div>}

        {/* Code Submission Form */}
        <div className="w-2/5" >
          <form onSubmit={handleCodeSubmit} className="bg-white p-4 rounded-md shadow-md">
            <div>
                <label htmlFor="my-select" className="font-semibold  mr-10px">
                    Choose the language :
                </label>
                <select 
                onChange={(e)=>{setLanguage(e.target.value)}}
        id="my-select"
        className="border p-2 rounded"  >
        <option value="" disabled>
          Select one
        </option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>
      <Link
  href={`/solutions/${id}`}
  className="inline-block mx-[6rem] mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:from-green-600 hover:to-green-800 transition-transform duration-300"
>
  View Solution
</Link>
   
            </div>
  
            <label htmlFor="code" className="block mb-2 font-semibold">
              Enter your code:
            </label>

            <textarea
             wrap="off"
              id="code"
              placeholder="Write your code here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={10}
              className="w-full p-3 font-mono text-sm border border-gray-300 rounded-md resize-y overflow-scroll"
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Submit
            </button>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 m-4"
             onClick={handleRun}>Run</button>

          </form>
          
          {Run&& CodeError[0]?<ErrorMessage message={CodeError[0]}/>:<TestCaseTabs codeOutput={CodeOutput} codeError={CodeError} id={id} />}
          {Loading &&<LoadingSpinner/>}
         
          
        </div>
      </div>
    </div>
  );
}
