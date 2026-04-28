import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Validate internal secret to prevent unauthorized calls
  const authHeader = req.headers.get('Authorization')
  const expectedSecret = Deno.env.get('FUNCTION_SECRET')
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: { dataset_id: string; file_path: string }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { dataset_id, file_path } = body
  if (!dataset_id || !file_path) {
    return new Response('Missing dataset_id or file_path', { status: 400 })
  }

  try {
    // Download file from Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('datasets')
      .download(file_path)

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError)
      return new Response('File not found in storage', { status: 404 })
    }

    // Compute SHA-256
    const arrayBuffer = await fileData.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const sha256Hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    // Update dataset record
    const { error: updateError } = await supabase
      .from('datasets')
      .update({ sha256_hash: sha256Hash, status: 'active' })
      .eq('id', dataset_id)
      .eq('status', 'pending') // Guard: only update if still pending

    if (updateError) {
      console.error('DB update error:', updateError)
      return new Response('Failed to update dataset', { status: 500 })
    }

    console.log(`Hash computed for dataset ${dataset_id}: ${sha256Hash}`)
    return new Response(JSON.stringify({ dataset_id, sha256_hash: sha256Hash }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response('Internal error', { status: 500 })
  }
})
