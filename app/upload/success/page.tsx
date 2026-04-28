import Link from 'next/link'

export default function UploadSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black text-white px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          FairData
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">Dataset submitted</h1>
          <p className="text-gray-500 text-sm mb-8">
            Your dataset is under review. Once approved, it will appear in the marketplace and be available for purchase.
            You&apos;ll receive an email when it&apos;s live.
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-5 text-left mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">What happens next</p>
            <ol className="space-y-2 text-sm text-gray-500 list-none">
              <li className="flex gap-3">
                <span className="text-gray-300 font-mono">1</span>
                File hash is computed and stored (SHA-256)
              </li>
              <li className="flex gap-3">
                <span className="text-gray-300 font-mono">2</span>
                Dataset is reviewed and activated in the marketplace
              </li>
              <li className="flex gap-3">
                <span className="text-gray-300 font-mono">3</span>
                When a buyer purchases, you receive 85% of the sale price via Stripe Connect
              </li>
              <li className="flex gap-3">
                <span className="text-gray-300 font-mono">4</span>
                Payout is released 10 days after sale (after the dispute window closes)
              </li>
            </ol>
          </div>

          <Link
            href="/datasets"
            className="inline-block bg-black text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-800 transition-colors text-sm"
          >
            Browse marketplace
          </Link>
        </div>
      </main>
    </div>
  )
}
