import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { triggerHashCompute } from '@/lib/triggerHashCompute'

// Called by the client after a large-file presigned upload completes.
export async function POST(req: NextRequest) {
  try {
    const { dataset_id } = await req.json()
    if (!dataset_id) {
      return NextResponse.json({ error: 'Missing dataset_id' }, { status: 400 })
    }

    const { data: dataset, error } = await supabaseAdmin
      .from('datasets')
      .select('id, file_path, status')
      .eq('id', dataset_id)
      .single()

    if (error || !dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })
    }

    if (dataset.status !== 'pending') {
      return NextResponse.json({ error: 'Dataset is not in pending state' }, { status: 409 })
    }

    triggerHashCompute(dataset.id, dataset.file_path)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Upload complete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
