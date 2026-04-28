import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { requireWorkEmail } from '@/lib/freemail'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { creator_email, file_name, file_size, title, description, license_type, price_usd, no_pii_confirmed, ip_confirmed } = body

    if (!creator_email || !file_name || !file_size || !title || !description || !license_type || !price_usd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      requireWorkEmail(creator_email)
    } catch {
      return NextResponse.json({ error: 'Please use a work email address.' }, { status: 400 })
    }

    if (!no_pii_confirmed || !ip_confirmed) {
      return NextResponse.json({ error: 'You must confirm no PII and IP ownership.' }, { status: 400 })
    }

    const MAX_SIZE = 2 * 1024 * 1024 * 1024
    if (file_size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 2GB limit' }, { status: 400 })
    }

    const supabaseClient = await createSupabaseServerClient()
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const filePath = `datasets/${user.id}/${Date.now()}_${file_name}`

    // Generate presigned upload URL (valid 1 hour)
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('datasets')
      .createSignedUploadUrl(filePath)

    if (signedError || !signedData) {
      return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
    }

    // Pre-create dataset record in pending state
    const { data: dataset, error: dbError } = await supabaseAdmin
      .from('datasets')
      .insert({
        creator_id: user.id,
        title,
        description,
        license_type,
        price_usd,
        file_path: filePath,
        file_size,
        no_pii_confirmed,
        ip_confirmed,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: 'Failed to save dataset record' }, { status: 500 })
    }

    return NextResponse.json({
      upload_url: signedData.signedUrl,
      token: signedData.token,
      file_path: filePath,
      dataset_id: dataset.id,
    })
  } catch (err) {
    console.error('Presigned URL error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
