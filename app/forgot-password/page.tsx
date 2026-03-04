// app/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    // Tell Supabase to send the reset email.
    // We pass the redirectTo URL so the email link knows where to send them back!
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/update-password`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setMessage('Check your email! We have sent you a password reset link.')
      setEmail('') // Clear the input
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white border rounded-lg shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-center text-gray-900">
          Reset Password
        </h1>
        <p className="mb-6 text-sm text-center text-gray-600">
          Enter your email address and we will send you a link to reset your password.
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleResetRequest} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 font-bold text-white transition-all bg-blue-600 rounded shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:shadow-none cursor-pointer"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}