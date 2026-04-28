import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import crypto from 'crypto'

export interface CertificateData {
  transactionId: string
  datasetTitle: string
  datasetHash: string
  buyerEmail: string
  buyerCompany: string
  licenseType: string
  priceUsd: number
  issuedAt: Date
}

const LICENSE_LABELS: Record<string, string> = {
  commercial_training: 'Commercial Training — Buyer may use dataset to train any commercial AI model.',
  fine_tuning_only: 'Fine-Tuning Only — Buyer may only fine-tune an existing base model, not train from scratch.',
  no_derivatives: 'No Derivatives — Buyer may not publish, redistribute, or sublicense the dataset itself.',
}

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([612, 792]) // US Letter
  const { width, height } = page.getSize()

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica)
  const fontMono = await doc.embedFont(StandardFonts.Courier)

  const margin = 60
  let y = height - margin

  // Header bar
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.05, 0.05, 0.05) })
  page.drawText('FairData', { x: margin, y: height - 52, size: 28, font: fontBold, color: rgb(1, 1, 1) })
  page.drawText('Licensed AI Training Data', { x: margin, y: height - 70, size: 11, font: fontRegular, color: rgb(0.7, 0.7, 0.7) })

  y = height - 110

  // Title
  page.drawText('LICENSE CERTIFICATE', { x: margin, y, size: 18, font: fontBold, color: rgb(0.05, 0.05, 0.05) })
  y -= 8
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) })
  y -= 24

  // Fields
  const field = (label: string, value: string, mono = false) => {
    page.drawText(label.toUpperCase(), { x: margin, y, size: 8, font: fontBold, color: rgb(0.5, 0.5, 0.5) })
    y -= 16
    const font = mono ? fontMono : fontRegular
    // Word-wrap long values
    const maxWidth = width - margin * 2
    const words = value.split(' ')
    let line = ''
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      const testWidth = font.widthOfTextAtSize(test, 11)
      if (testWidth > maxWidth && line) {
        page.drawText(line, { x: margin, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) })
        y -= 16
        line = word
      } else {
        line = test
      }
    }
    if (line) {
      page.drawText(line, { x: margin, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) })
      y -= 24
    }
  }

  field('Transaction ID', data.transactionId, true)
  field('Dataset', data.datasetTitle)
  field('Dataset SHA-256 Hash', data.datasetHash, true)
  field('Buyer', `${data.buyerCompany} (${data.buyerEmail})`)
  field('License Type', LICENSE_LABELS[data.licenseType] ?? data.licenseType)
  field('Price Paid', `USD $${data.priceUsd.toFixed(2)}`)
  field('Issued At', data.issuedAt.toISOString())

  y -= 8
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) })
  y -= 20

  // Enforcement notice
  const notice =
    'NOTICE: License terms are contractual and self-reported. The platform does not technically ' +
    'enforce usage restrictions post-transaction. This certificate constitutes proof of licensed ' +
    'purchase and the buyer\'s agreement to the stated license terms.'
  const noticeWords = notice.split(' ')
  let noticeLine = ''
  page.drawText('ENFORCEMENT NOTICE', { x: margin, y, size: 8, font: fontBold, color: rgb(0.5, 0.5, 0.5) })
  y -= 14
  for (const word of noticeWords) {
    const test = noticeLine ? `${noticeLine} ${word}` : word
    if (fontRegular.widthOfTextAtSize(test, 9) > width - margin * 2 && noticeLine) {
      page.drawText(noticeLine, { x: margin, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })
      y -= 13
      noticeLine = word
    } else {
      noticeLine = test
    }
  }
  if (noticeLine) page.drawText(noticeLine, { x: margin, y, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })

  // Footer
  page.drawText('fairdata.io', { x: margin, y: 30, size: 9, font: fontRegular, color: rgb(0.6, 0.6, 0.6) })
  page.drawText(`Generated ${data.issuedAt.toISOString()}`, { x: width - 260, y: 30, size: 9, font: fontMono, color: rgb(0.6, 0.6, 0.6) })

  return doc.save()
}

export function computeRowHash(fields: {
  transactionId: string
  datasetHash: string
  buyerEmail: string
  licenseType: string
  priceUsd: number
  issuedAt: Date
}): string {
  const canonical = [
    fields.transactionId,
    fields.datasetHash,
    fields.buyerEmail,
    fields.licenseType,
    fields.priceUsd.toFixed(2),
    fields.issuedAt.toISOString(),
  ].join('|')
  return crypto.createHash('sha256').update(canonical).digest('hex')
}
