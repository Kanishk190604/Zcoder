"use client";
import { useState } from "react";
import { db,auth } from "@/app/lib/firebase"; // Ensure your firebase config is correct
import { collection, addDoc, serverTimestamp,getDocs,setDoc,doc } from "firebase/firestore";

export default function CreateProblemForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [runCases, setRunCases] = useState([
    { input: "", output: "" },
    { input: "", output: "" },
    { input: "", output: "" }
  ]);
  const [submitCases, setSubmitCases] = useState([
    { input: "", output: "" },
    { input: "", output: "" },
    { input: "", output: "" }
  ]);

  const addSubmitCase = () => {
    if (submitCases.length < 10) {
      setSubmitCases([...submitCases, { input: "", output: "" }]);
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to create a problem.");
      return;
    }

    try {
      await addDoc(collection(db, "problems"), {
        uid: user.uid,
        title,
        description,
        run_test_cases: runCases,
        submit_test_cases: submitCases,
        createdAt: serverTimestamp(),
      });
     
      alert("Problem successfully created!");
      const problemSnapshot = await getDocs(collection(db, "problems",));
       problemSnapshot.docs.map((problemDoc) => {
        const problemId = problemDoc.id;
        const problemStatusRef = doc(db, "users", user.uid, "problemlist", problemId);
  
        return setDoc(problemStatusRef, {
          question_id: problemDoc.id,
          status: false,
        });});
      setTitle("");
      setDescription("");
      setRunCases([
        { input: "", output: "" },
        { input: "", output: "" },
        { input: "", output: "" }
      ]);
      setSubmitCases([
        { input: "", output: "" },
        { input: "", output: "" },
        { input: "", output: "" }
      ]);
    } catch (error) {
      console.error("Error creating problem:", error);
      alert("Failed to create problem.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-3xl font-bold mb-6">Create Problem</h2>

      <input
        type="text"
        className="w-full p-3 border mb-4 rounded"
        placeholder="Problem Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full h-60 p-3 border mb-6 rounded"
        placeholder="Problem Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <h3 className="text-xl font-semibold mb-2">Run Test Cases (Visible)</h3>
      {runCases.map((tc, i) => (
        <div key={i} className="grid grid-cols-2 gap-4 mb-3">
          <input
            className="p-2 border rounded"
            placeholder={`Run Input ${i + 1}`}
            value={tc.input}
            onChange={(e) => {
              const updated = [...runCases];
              updated[i].input = e.target.value;
              setRunCases(updated);
            }}
            required
          />
          <input
            className="p-2 border rounded"
            placeholder={`Run Output ${i + 1}`}
            value={tc.output}
            onChange={(e) => {
              const updated = [...runCases];
              updated[i].output = e.target.value;
              setRunCases(updated);
            }}
            required
          />
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-6 mb-2">Submit Test Cases (Hidden)</h3>
      {submitCases.map((tc, i) => (
        <div key={i} className="grid grid-cols-2 gap-4 mb-3">
          <input
            className="p-2 border rounded"
            placeholder={`Submit Input ${i + 1}`}
            value={tc.input}
            onChange={(e) => {
              const updated = [...submitCases];
              updated[i].input = e.target.value;
              setSubmitCases(updated);
            }}
            required={i < 3}
          />
          <input
            className="p-2 border rounded"
            placeholder={`Submit Output ${i + 1}`}
            value={tc.output}
            onChange={(e) => {
              const updated = [...submitCases];
              updated[i].output = e.target.value;
              setSubmitCases(updated);
            }}
            required={i < 3}
          />
        </div>
      ))}

      {submitCases.length < 10 && (
        <button
          type="button"
          onClick={addSubmitCase}
          className="mt-2 mb-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          ➕ Add Submit Test Case
        </button>
      )}

      <button
        type="submit"
        className="px-6 py-3 bg-green-600 text-white rounded text-lg"
      >
        ✅ Submit Problem
      </button>
    </form>
  );
}
