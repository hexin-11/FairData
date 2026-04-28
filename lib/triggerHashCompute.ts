// Calls the compute-hash Edge Function after a file is uploaded.
// Fire-and-forget — hash computation is async; dataset starts as 'pending' and
// becomes 'active' once the Edge Function updates it.
export async function triggerHashCompute(datasetId: string, filePath: string): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.FUNCTION_SECRET

  if (!supabaseUrl || !secret) {
    console.warn('triggerHashCompute: missing SUPABASE_URL or FUNCTION_SECRET — skipping')
    return
  }

  const url = `${supabaseUrl}/functions/v1/compute-hash`

  // Do not await — hash computation runs in the background
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ dataset_id: datasetId, file_path: filePath }),
  }).catch((err) => console.error('triggerHashCompute failed:', err))
}
