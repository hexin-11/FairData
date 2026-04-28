import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ transactionId: string }> }) {
  const { transactionId } = await params

  const { data: certificate, error } = await supabaseAdmin
    .from('certificates')
    .select('pdf_path')
    .eq('transaction_id', transactionId)
    .single()

  if (error || !certificate) {
    return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
  }

  const { data: fileData, error: downloadError } = await supabaseAdmin.storage
    .from('certificates')
    .download(certificate.pdf_path)

  if (downloadError || !fileData) {
    return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
  }

  const arrayBuffer = await fileData.arrayBuffer()

  return new NextResponse(arrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="fairdata-certificate-${transactionId}.pdf"`,
    },
  })
}
