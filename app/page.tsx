'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError('Invalid username or password');
    } else {
      router.push('/dashboard');
    }
  };

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
            <p className="mb-4">Sign in to continue</p>

            <form onSubmit={handleCredentialsLogin} className="space-y-4 text-left">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Sign in with Credentials
              </button>
            </form>

            <div className="my-4">or</div>

            <button
              onClick={() => signIn('github')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign in with GitHub
            </button>

            <p className="mt-4 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Register here
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
