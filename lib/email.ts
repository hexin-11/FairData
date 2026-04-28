import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCertificateEmail(params: {
  to: string
  datasetTitle: string
  transactionId: string
  pdfBytes: Uint8Array
}) {
  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/transactions/${params.transactionId}`

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'FairData <noreply@fairdata.io>',
    to: params.to,
    subject: `Your FairData License Certificate — ${params.datasetTitle}`,
    html: `
      <p>Thank you for your purchase.</p>
      <p>Your license certificate for <strong>${params.datasetTitle}</strong> is attached to this email.</p>
      <p>You can also download it anytime from your permanent transaction page:<br/>
        <a href="${downloadUrl}">${downloadUrl}</a>
      </p>
      <p>Transaction ID: <code>${params.transactionId}</code></p>
      <hr/>
      <p style="color:#888;font-size:12px;">FairData — Licensed AI Training Data</p>
    `,
    attachments: [
      {
        filename: `fairdata-certificate-${params.transactionId}.pdf`,
        content: Buffer.from(params.pdfBytes).toString('base64'),
      },
    ],
  })
}
