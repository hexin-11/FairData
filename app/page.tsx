import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">FairData</span>
        <div className="flex items-center gap-4">
          <Link href="/datasets" className="text-sm text-gray-400 hover:text-white transition-colors">
            Browse
          </Link>
          <Link
            href="/upload"
            className="text-sm border border-white px-3 py-1.5 rounded hover:bg-white hover:text-black transition-colors"
          >
            List your data
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full mb-6">
            Licensed AI Training Data
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            The compliance artifact<br />for AI training data.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
            Every purchase generates a signed, timestamped PDF license certificate —
            the proof of licensed use that AI legal teams can file.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/datasets"
              className="bg-black text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Browse datasets
            </Link>
            <Link
              href="/upload"
              className="text-gray-700 font-medium px-6 py-3 rounded-md border border-gray-200 hover:border-gray-400 transition-colors"
            >
              List your data
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-50 border-t border-gray-100 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-12">How it works</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse licensed datasets</h3>
                <p className="text-sm text-gray-500">
                  Find curated datasets from verified creators. Each listing shows license type, file size, and SHA-256 hash.
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Purchase via Stripe</h3>
                <p className="text-sm text-gray-500">
                  Pay with a work email. Your company name and payment are recorded for the license record.
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Receive your certificate</h3>
                <p className="text-sm text-gray-500">
                  A PDF license certificate is emailed immediately — with transaction ID, dataset hash, license terms, and timestamp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* License types */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-12">License types</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border border-gray-200 rounded-lg p-5">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full mb-3">
                  Commercial Training
                </span>
                <p className="text-sm text-gray-600">
                  May be used to train any commercial AI model.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full mb-3">
                  Fine-Tuning Only
                </span>
                <p className="text-sm text-gray-600">
                  May only be used to fine-tune an existing base model, not train from scratch.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full mb-3">
                  No Derivatives
                </span>
                <p className="text-sm text-gray-600">
                  May not publish, redistribute, or sublicense the dataset itself.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black text-white py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to license your data?</h2>
            <p className="text-gray-400 mb-8 text-sm">
              Set your price, choose a license, and upload your file.
              FairData handles payments, certificates, and audit records.
            </p>
            <Link
              href="/upload"
              className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              List your dataset
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        FairData — Licensed AI Training Data
      </footer>
    </div>
  )
}
