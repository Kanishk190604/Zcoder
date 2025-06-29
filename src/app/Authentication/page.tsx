import Link from 'next/link';

export default function Authentication() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Zcoder</h1>
        <p className="text-gray-600 mb-6">Sharpen your skills with challenges, contests, and more.</p>

        <div className="flex flex-col space-y-4">
          <Link href="/Authentication/SignUp">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              Sign Up
            </button>
          </Link>

          <Link href="/Authentication/SignIn">
            <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
