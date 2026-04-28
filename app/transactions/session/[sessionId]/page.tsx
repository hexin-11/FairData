import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

export default async function SessionRedirectPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params

  try {
    // Get payment_intent from Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const paymentIntentId = session.payment_intent as string | null

    if (paymentIntentId) {
      // Look up transaction by payment_intent
      const { data: transaction } = await supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('stripe_payment_id', paymentIntentId)
        .single()

      if (transaction) {
        redirect(`/transactions/${transaction.id}`)
      }
    }
  } catch (err) {
    console.error('Session lookup error:', err)
  }

  // Webhook hasn't fired yet — show processing page with auto-refresh
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black text-white px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">FairData</Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Processing payment…</h1>
          <p className="text-sm text-gray-500 mb-6">
            Your certificate is being generated. This usually takes a few seconds.
          </p>
          {/* Auto-refresh every 3 seconds */}
          <meta httpEquiv="refresh" content="3" />
          <p className="text-xs text-gray-400">Page refreshes automatically.</p>
        </div>
      </main>
    </div>
  )
}
