'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db, auth } from '@/app/lib/firebase';
import { doc, setDoc,addDoc,serverTimestamp  } from 'firebase/firestore';
import { use } from 'react';
import { collection } from 'firebase/firestore';
export default function SubmitSolution({ params }: { params: Promise<{ id: string }>}) { const [description, setDescription] = useState('');

const [Title, setTitle] = useState('');
const [code, setCode] = useState<any>();
const [ProblemId, setProblemId] = useState<any>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = use(params).id;
//   const codeFromQuery = searchParams.get('code') || 'k';
useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setProblemId(resolvedParams.id);
      console.log('Current searchParams:', searchParams.toString());
      const rawCode = searchParams.get('code');
      if (rawCode) {
        const decodedCode = decodeURIComponent(rawCode);
        setCode(decodedCode);
        console.log("done")
      }else{console.log("no code found")}
    })();
  }, [params, searchParams]);

 

  const handleSubmit = async () => {console.log(code);
    const user = auth.currentUser;
    if (!user) return;

    const submissionsRef = collection(db, "problems",problemId, "solutions");

    await addDoc(submissionsRef, {userid:user.uid,
      Title,
      problemId,
      code,
      description,
      createdAt: new Date(),
    });

    alert("✅ Solution submitted!");
    router.push('/user/problem_list');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">📝 Submit Your Solution</h1>
      <label className="block font-semibold mb-2">Title:</label>
      <textarea
        className="w-full border p-2 mb-4 rounded"
        rows={3}
        value={Title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <label className="block font-semibold mb-2">Description:</label>
      <textarea
        className="w-full border p-2 mb-4 rounded"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Explain your approach..."
      />

      <label className="block font-semibold mb-2">Code:</label>
      <textarea
        className="w-full border p-2 rounded font-mono"
        rows={10}
        value={code}
        
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        ✅ Submit Solution
      </button>
    </div>
  );
}
