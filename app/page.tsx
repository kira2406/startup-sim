// app/page.tsx
import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the menu by default
  redirect('/menu')
}