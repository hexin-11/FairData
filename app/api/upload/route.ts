import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { triggerHashCompute } from '@/lib/triggerHashCompute'

const ALLOWED_TYPES = new Set([
  'application/zip',
  'text/csv',
  'application/jsonlines',
  'text/plain',
  'application/octet-stream', // fallback for zip/jsonl
])
const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024 // 2GB
const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024 // 100MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const licenseType = formData.get('license_type') as string
    const priceUsd = parseFloat(formData.get('price_usd') as string)
    const noPiiConfirmed = formData.get('no_pii_confirmed') === 'true'
    const ipConfirmed = formData.get('ip_confirmed') === 'true'

    if (!file || !title || !description || !licenseType || isNaN(priceUsd)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!noPiiConfirmed || !ipConfirmed) {
      return NextResponse.json({ error: 'You must confirm no PII and IP ownership.' }, { status: 400 })
    }

    const validLicenses = ['commercial_training', 'fine_tuning_only', 'no_derivatives']
    if (!validLicenses.includes(licenseType)) {
      return NextResponse.json({ error: 'Invalid license type' }, { status: 400 })
    }

    if (priceUsd <= 0) {
      return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 2GB limit' }, { status: 400 })
    }

    // Large files (>100MB) should use presigned URL upload — reject here
    if (file.size > LARGE_FILE_THRESHOLD) {
      return NextResponse.json(
        { error: 'File too large for direct upload. Use /api/upload/presigned instead.' },
        { status: 400 }
      )
    }

    // Get authenticated user from session
    const supabaseClient = await createSupabaseServerClient()
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Upload file to Supabase Storage
    const filePath = `datasets/${user.id}/${Date.now()}_${file.name}`
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabaseAdmin.storage
      .from('datasets')
      .upload(filePath, arrayBuffer, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
    }

    // Insert dataset record (sha256_hash populated later by Edge Function)
    const { data: dataset, error: dbError } = await supabaseAdmin
      .from('datasets')
      .insert({
        creator_id: user.id,
        title,
        description,
        license_type: licenseType,
        price_usd: priceUsd,
        file_path: filePath,
        file_size: file.size,
        no_pii_confirmed: noPiiConfirmed,
        ip_confirmed: ipConfirmed,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: 'Failed to save dataset record' }, { status: 500 })
    }

    triggerHashCompute(dataset.id, filePath)

    return NextResponse.json({ dataset_id: dataset.id, status: 'pending' })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
