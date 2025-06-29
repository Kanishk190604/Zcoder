'use client';

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../../lib/firebase"; // update path to your initialized Firestore instance
import Link from "next/link";
import { useRouter } from 'next/navigation';


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
// type ProblemStatus = {
//   question_id:string;
//   status:boolean
// };

export default function AllProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const[problemStatus,setStatus]=useState<any>([])
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadProblems();
        setLoading(true);
        loadStatus(user.uid);
      } else {router.push("/Authentication");
       
      }
    });

    return () => unsubscribe();
  }, [router]);
  // useEffect(() => {
  //   console.log("Updated problemStatus:", problemStatus);
  // }, [problemStatus]);
  
  const loadStatus = async (userId: string)=>{  try {const listRef = collection(db, "users", userId, "problemlist");
  const snapshot = await getDocs(listRef);

  const problemList = snapshot.docs.map(doc => {return {
    id: doc.id,
    ...doc.data(), // contains: question_id and status
  }});
 
  console.log("this is status",problemList)
  setStatus(problemList);

    
  } catch (err) {
    console.error("Failed to fetch problemStatuses:", err);
  } finally {
    setLoading(false);
  }
  }
  

  const loadProblems = async () => { 
    try {
      const snapshot = await getDocs(collection(db, "problems"));
      const problemList: Problem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Problem, 'id'>)
      }));
      setProblems(problemList);
      console.log(problemList);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    } 
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
            problems.map((p, index) =>{ console.log("this is 1",problemStatus);
              console.log("this is problem",p);
            const q=problemStatus.find((element:any)=>{return element.question_id===p.id})

            console.log("reqired",q)
              return(
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{p.title}</td>
                <td className="p-3 line-clamp-2">{p.description}</td>
                <td className="p-3">
                  <Link href={`/user/${p.id}`} className="text-blue-600 underline">
                    Solve
                  </Link>
                </td>
                <td>{q.status && (
  <span className="inline-flex items-center gap-2 px-2 py-1 text-green-700 bg-green-100 rounded-full text-sm font-medium">
    ✅ 
  </span>)}</td>
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
