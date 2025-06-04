export default function Login() {
  return (
    <div className="grid place-items-center min-h-screen p-4">
      <form className="flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
