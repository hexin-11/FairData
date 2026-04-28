import Link from 'next/link'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black text-white px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">FairData</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in</h1>
          <p className="text-sm text-gray-500 mb-8">Welcome back.</p>
          <LoginForm />
          <p className="text-sm text-gray-500 text-center mt-6">
            No account?{' '}
            <Link href="/auth/signup" className="text-black font-medium underline">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
