import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Transaction, Certificate, Dataset } from '@/lib/types'
import { LICENSE_LABELS } from '@/lib/license'
import DownloadButton from './DownloadButton'

async function getData(id: string) {
  // Support lookup by either transaction ID or Stripe checkout session ID
  const { data: transaction } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .or(`id.eq.${id},stripe_payment_id.eq.${id}`)
    .single()

  if (!transaction) return null

  const { data: certificate } = await supabaseAdmin
    .from('certificates')
    .select('*')
    .eq('transaction_id', transaction.id)
    .single()

  const { data: dataset } = await supabaseAdmin
    .from('datasets')
    .select('id, title, description')
    .eq('id', transaction.dataset_id)
    .single()

  return { transaction: transaction as Transaction, certificate: certificate as Certificate | null, dataset: dataset as Dataset | null }
}

export default async function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getData(id)
  if (!result) notFound()

  const { transaction, certificate, dataset } = result

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          FairData
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          {transaction.status === 'completed' ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm font-medium mb-6 w-fit">
              <span>✓</span> Payment confirmed
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 text-sm font-medium mb-6 w-fit">
              Status: {transaction.status}
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {dataset?.title ?? 'Dataset'}
          </h1>
          <p className="text-gray-500 text-sm">License purchase confirmation</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 mb-6">
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 uppercase font-medium mb-1">Transaction ID</p>
            <p className="text-sm font-mono text-gray-800 break-all">{transaction.id}</p>
          </div>
          <div className="px-5 py-4 flex gap-8">
            <div>
              <p className="text-xs text-gray-400 uppercase font-medium mb-1">Amount Paid</p>
              <p className="text-sm text-gray-800 font-semibold">
                ${transaction.amount_usd.toFixed(2)} USD
              </p>
            </div>
            {certificate && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium mb-1">License</p>
                <p className="text-sm text-gray-800">{LICENSE_LABELS[certificate.license_type]}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 uppercase font-medium mb-1">Date</p>
              <p className="text-sm text-gray-800">
                {new Date(transaction.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>
          </div>
          {certificate && (
            <div className="px-5 py-4">
              <p className="text-xs text-gray-400 uppercase font-medium mb-1">Dataset SHA-256 Hash</p>
              <p className="text-xs font-mono text-gray-600 break-all">{certificate.dataset_hash}</p>
            </div>
          )}
        </div>

        {/* Certificate download */}
        {certificate ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="font-semibold text-gray-900 mb-1">License Certificate</p>
            <p className="text-sm text-gray-500 mb-5">
              Your PDF certificate is also emailed to {transaction.buyer_email}.
              This page is permanent — bookmark it for re-downloads.
            </p>
            <DownloadButton transactionId={transaction.id} />
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 text-sm text-yellow-800">
            Certificate is being generated. Refresh in a moment, or check your email.
          </div>
        )}
      </main>
    </div>
  )
}
