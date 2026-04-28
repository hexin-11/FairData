import Link from 'next/link'
import SignupForm from './SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black text-white px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">FairData</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-sm text-gray-500 mb-8">
            List your datasets and get paid when AI companies license them.
          </p>
          <SignupForm />
          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-black font-medium underline">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
