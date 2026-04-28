'use client'

import { useState } from 'react'

export default function DownloadButton({ transactionId }: { transactionId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(`/api/certificates/${transactionId}`)
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fairdata-certificate-${transactionId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Download failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Downloading…' : 'Download Certificate (PDF)'}
    </button>
  )
}
