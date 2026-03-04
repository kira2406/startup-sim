import { login, signup } from '@/actions/auth'
import Link from 'next/link'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error: string }> }) {

    const params = await searchParams
    const error = params?.error

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="flex flex-col w-full max-w-sm gap-4 p-8 border rounded shadow-md bg-white">
        <h1 className="text-2xl font-bold text-center text-gray-900">Startup Simulator</h1>
        
        {error && (
          <p className="p-2 text-sm text-center text-red-500 bg-red-100 rounded">
            {error}
          </p>
        )}

        <label htmlFor="email" className='text-sm font-medium text-gray-700'>Email</label>
        <input className="w-full p-3 border border-gray-300 rounded text-black" id="email" name="email" type="email" required />

        <label htmlFor="password" className='text-sm font-medium text-gray-700'>Password</label>
        <input className="w-full p-3 border border-gray-300 rounded text-black" id="password" name="password" type="password" required />

        <div className="flex justify-end mt-1">
          <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="flex gap-4 mt-4">
          <button formAction={login} className="flex-1 p-2 text-white bg-blue-600 rounded cursor-pointer">
            Log In
          </button>
          <button formAction={signup} className="flex-1 p-2 text-black bg-gray-200 rounded cursor-pointer">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}