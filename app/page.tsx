'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Crypto Dashboard</h1>

        {session ? (
          <>
            <p className="mb-4">Welcome, <strong>{session.user?.name}</strong>!</p>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">You are not signed in.</p>
            <button
              onClick={() => signIn('github')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign in with GitHub
            </button>
          </>
        )}
      </div>
    </div>
  );
}
