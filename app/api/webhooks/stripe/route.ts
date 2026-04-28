import { NextRequest, NextResponse } from 'next/server'

export const config = { api: { bodyParser: false } }
import { stripe, PLATFORM_FEE_RATE } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generateCertificatePdf, computeRowHash } from '@/lib/certificate'
import { sendCertificateEmail } from '@/lib/email'
import { isFreemailDomain } from '@/lib/freemail'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as import('stripe').Stripe.Checkout.Session
  const { dataset_id, buyer_email, license_type, is_freemail } = session.metadata ?? {}

  if (is_freemail === 'true') {
    console.warn(`Freemail buyer detected: ${buyer_email} — proceeding anyway for MVP`)
  }

  try {
    // Fetch dataset (need sha256_hash and title)
    const { data: dataset, error: datasetError } = await supabaseAdmin
      .from('datasets')
      .select('id, title, sha256_hash, price_usd')
      .eq('id', dataset_id)
      .single()

    if (datasetError || !dataset) {
      throw new Error(`Dataset not found: ${dataset_id}`)
    }

    if (!dataset.sha256_hash) {
      throw new Error(`SHA-256 hash not yet computed for dataset ${dataset_id}`)
    }

    const amountUsd = (session.amount_total ?? 0) / 100
    const platformFeeUsd = parseFloat((amountUsd * PLATFORM_FEE_RATE).toFixed(2))
    const creatorPayoutUsd = parseFloat((amountUsd - platformFeeUsd).toFixed(2))
    const payoutScheduledAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // +10 days

    // Create transaction
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        dataset_id: dataset.id,
        buyer_email,
        buyer_company: session.customer_details?.name ?? 'Unknown',
        stripe_payment_id: session.payment_intent as string,
        amount_usd: amountUsd,
        platform_fee_usd: platformFeeUsd,
        creator_payout_usd: creatorPayoutUsd,
        status: 'completed',
        payout_scheduled_at: payoutScheduledAt.toISOString(),
      })
      .select()
      .single()

    if (txError || !transaction) {
      throw new Error(`Failed to create transaction: ${txError?.message}`)
    }

    const issuedAt = new Date()

    // Generate PDF
    const pdfBytes = await generateCertificatePdf({
      transactionId: transaction.id,
      datasetTitle: dataset.title,
      datasetHash: dataset.sha256_hash,
      buyerEmail: buyer_email,
      buyerCompany: session.customer_details?.name ?? 'Unknown',
      licenseType: license_type,
      priceUsd: amountUsd,
      issuedAt,
    })

    // Store PDF in Supabase Storage
    const pdfPath = `certificates/${transaction.id}.pdf`
    const { error: pdfUploadError } = await supabaseAdmin.storage
      .from('certificates')
      .upload(pdfPath, pdfBytes, { contentType: 'application/pdf' })

    if (pdfUploadError) {
      throw new Error(`PDF upload failed: ${pdfUploadError.message}`)
    }

    // Insert certificate (append-only)
    const { data: certificate, error: certError } = await supabaseAdmin
      .from('certificates')
      .insert({
        transaction_id: transaction.id,
        dataset_hash: dataset.sha256_hash,
        buyer_email,
        license_type,
        price_usd: amountUsd,
        issued_at: issuedAt.toISOString(),
        pdf_path: pdfPath,
      })
      .select()
      .single()

    if (certError || !certificate) {
      throw new Error(`Failed to create certificate: ${certError?.message}`)
    }

    // Insert audit log row hash
    const rowHash = computeRowHash({
      transactionId: transaction.id,
      datasetHash: dataset.sha256_hash,
      buyerEmail: buyer_email,
      licenseType: license_type,
      priceUsd: amountUsd,
      issuedAt,
    })

    await supabaseAdmin.from('audit_log').insert({
      certificate_id: certificate.id,
      row_hash: rowHash,
    })

    // Email certificate to buyer
    await sendCertificateEmail({
      to: buyer_email,
      datasetTitle: dataset.title,
      transactionId: transaction.id,
      pdfBytes,
    })

    return NextResponse.json({ received: true, transaction_id: transaction.id })
  } catch (err) {
    console.error('Webhook processing error:', err)
    // Return 500 so Stripe retries the webhook
    return NextResponse.json({ error: 'Certificate generation failed' }, { status: 500 })
  }
}
