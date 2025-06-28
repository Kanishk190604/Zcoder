'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex-col  items-center justify-items-center bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-indigo-600">Zcoder</h1>
        <div className="bg-white p-6 rounded  text-center text-gray-600">
          <h2 className="text-xl font-semibold mb-2">Welcome to Zcoder 🚀</h2>
          <p>Start building your coding journey. Sign in or sign up to continue.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/signin')}
            className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-4 py-2 rounded bg-white border border-indigo-500 text-indigo-500 hover:bg-indigo-50"
          >
            Sign Up
          </button>
        </div>
      </header></div>

  );
}
