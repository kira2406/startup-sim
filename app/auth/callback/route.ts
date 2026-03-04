import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const validTypes = [
  'signup',
  'recovery',
  'invite',
  'email',
  'magiclink',
  'email_change',
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/menu'

  if (!token_hash || !type || !validTypes.includes(type)) {
    return NextResponse.redirect(
      new URL('/login?error=Invalid verification link', request.url)
    )
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    type: type as 'signup' | 'recovery' | 'invite' | 'email' | 'magiclink' | 'email_change',
    token_hash,
  })

  if (error) {
    return NextResponse.redirect(
      new URL('/login?error=Verification failed', request.url)
    )
  }

  return NextResponse.redirect(new URL(next, request.url))
}