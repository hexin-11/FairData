import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { stripe } from '@/lib/stripe'
import { isFreemailDomain } from '@/lib/freemail'

export async function POST(req: NextRequest) {
  try {
    const { dataset_id, buyer_email } = await req.json()

    if (!dataset_id || !buyer_email) {
      return NextResponse.json({ error: 'Missing dataset_id or buyer_email' }, { status: 400 })
    }

    // Fetch dataset
    const { data: dataset, error } = await supabaseAdmin
      .from('datasets')
      .select('*')
      .eq('id', dataset_id)
      .eq('status', 'active')
      .single()

    if (error || !dataset) {
      return NextResponse.json({ error: 'Dataset not found or unavailable' }, { status: 404 })
    }

    const amountCents = Math.round(dataset.price_usd * 100)
    const platformFeeCents = Math.round(amountCents * 0.15)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: dataset.title,
              description: `License: ${dataset.license_type.replace(/_/g, ' ')}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      customer_email: buyer_email,
      metadata: {
        dataset_id: dataset.id,
        buyer_email,
        license_type: dataset.license_type,
        is_freemail: isFreemailDomain(buyer_email) ? 'true' : 'false',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/transactions/session/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/datasets/${dataset.id}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
