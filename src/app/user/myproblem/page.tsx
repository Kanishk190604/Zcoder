'use client';

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs,getDoc ,doc} from "firebase/firestore";
import { db } from "../../lib/firebase"; // update path to your initialized Firestore instance
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { query,where } from "firebase/firestore";

type TestCase = {
  input: string;
  output: string;
};

type Problem = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  runTestCases: TestCase[];
  submitTestCases: TestCase[];
  uid:string;
};
type ProblemStatus = {
  question_id:string;
  status:boolean
};

export default function myproblem() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const[problemStatus,setStatus]=useState<any>([])
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadProblems(user);
        
        
      } else {router.push("/Authentication");
       
      }
    });

    return () => unsubscribe();
  }, []);

  (console.log("this is problem status", problemStatus))

  const loadProblems = async (user:any) => { 
    try {const q = query(
        collection(db, "problems"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const problemList: Problem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Problem, 'id'>)
      }));
      setProblems(problemList);
      console.log(problemList);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    } finally{setLoading(false);}
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">📋 All Problems</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {
            problems.map((p, index) =>{ console.log(problemStatus);
              console.log(p);
            const q=problemStatus.find((element:any)=>{return element.question_id===p.uid})

            console.log("reqired",q)
              return(
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{p.title}</td>
                <td className="p-3 line-clamp-2">{p.description}</td>
                <td className="p-3">
                  <Link href={`/user/${p.uid}`} className="text-blue-600 underline">
                    Solve
                  </Link>
                </td>
                {/* <td>{q.status && (
  <span className="inline-flex items-center gap-2 px-2 py-1 text-green-700 bg-green-100 rounded-full text-sm font-medium">
    ✅ 
  </span>)}</td> */}
              </tr>
            )})}
            {problems.length === 0 && (
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
  );
}

