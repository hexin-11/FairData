'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LicenseType } from '@/lib/types'
import { LICENSE_LABELS, LICENSE_DESCRIPTIONS } from '@/lib/license'

const ACCEPTED_TYPES = '.zip,.csv,.jsonl,.txt,.png,.jpg,.jpeg'
const MAX_SIZE = 2 * 1024 * 1024 * 1024 // 2GB
const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024 // 100MB

const LICENSE_OPTIONS: LicenseType[] = ['commercial_training', 'fine_tuning_only', 'no_derivatives']

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export default function UploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [licenseType, setLicenseType] = useState<LicenseType>('commercial_training')
  const [priceUsd, setPriceUsd] = useState('')
  const [noPii, setNoPii] = useState(false)
  const [ipConfirmed, setIpConfirmed] = useState(false)

  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    if (!f) return
    if (f.size > MAX_SIZE) {
      setError('File exceeds 2 GB limit.')
      return
    }
    setError('')
    setFile(f)
  }

  async function uploadLargeFile(f: File, meta: Record<string, unknown>): Promise<string> {
    // Get presigned URL
    const res = await fetch('/api/upload/presigned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...meta, file_name: f.name, file_size: f.size }),
    })
    if (!res.ok) {
      const d = await res.json()
      throw new Error(d.error ?? 'Failed to get upload URL')
    }
    const { upload_url, dataset_id } = await res.json()

    // Upload directly to Supabase Storage with progress
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Upload failed')))
      xhr.onerror = () => reject(new Error('Upload failed'))
      xhr.open('PUT', upload_url)
      xhr.setRequestHeader('Content-Type', f.type || 'application/octet-stream')
      xhr.send(f)
    })

    // Notify server that upload is complete → triggers hash computation
    await fetch('/api/upload/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataset_id }),
    })

    return dataset_id
  }

  async function uploadSmallFile(f: File, meta: Record<string, unknown>): Promise<string> {
    const formData = new FormData()
    formData.append('file', f)
    Object.entries(meta).forEach(([k, v]) => formData.append(k, String(v)))

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const d = await res.json()
    if (!res.ok) throw new Error(d.error ?? 'Upload failed')
    return d.dataset_id
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!file) { setError('Please select a file.'); return }
    if (!title.trim()) { setError('Title is required.'); return }
    if (!description.trim()) { setError('Description is required.'); return }
    if (!priceUsd || parseFloat(priceUsd) <= 0) { setError('Enter a valid price.'); return }
    if (!noPii) { setError('You must confirm the dataset contains no personal data.'); return }
    if (!ipConfirmed) { setError('You must confirm you own or have rights to license this content.'); return }

    const meta = {
      title: title.trim(),
      description: description.trim(),
      license_type: licenseType,
      price_usd: parseFloat(priceUsd),
      no_pii_confirmed: true,
      ip_confirmed: true,
    }

    setUploading(true)
    try {
      const datasetId = file.size > LARGE_FILE_THRESHOLD
        ? await uploadLargeFile(file, meta)
        : await uploadSmallFile(file, meta)

      if (onSuccess) {
        onSuccess()
        router.refresh()
      } else {
        router.push(`/upload/success?id=${datasetId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dataset title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Korean Legal Texts 2020–2024"
          maxLength={120}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the content, source, language, domain, and why it's valuable for AI training."
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-none"
        />
      </div>

      {/* License type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          License type
        </label>
        <div className="space-y-2">
          {LICENSE_OPTIONS.map((lt) => (
            <label
              key={lt}
              className={`flex items-start gap-3 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                licenseType === lt ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="license_type"
                value={lt}
                checked={licenseType === lt}
                onChange={() => setLicenseType(lt)}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{LICENSE_LABELS[lt]}</p>
                <p className="text-xs text-gray-500">{LICENSE_DESCRIPTIONS[lt]}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
            placeholder="500.00"
            className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-gray-500"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">FairData takes 15%. You receive 85% of the sale price.</p>
      </div>

      {/* File */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dataset file
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-md px-6 py-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {file ? (
            <div>
              <p className="text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">{formatBytes(file.size)}</p>
              {file.size > LARGE_FILE_THRESHOLD && (
                <p className="text-xs text-blue-600 mt-1">Large file — will upload directly to storage.</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">Click to select file</p>
              <p className="text-xs text-gray-400 mt-1">ZIP, CSV, JSONL, TXT, PNG/JPG — max 2 GB</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Confirmations */}
      <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-md p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={noPii}
            onChange={(e) => setNoPii(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-sm text-gray-700">
            I confirm this dataset contains <strong>no personal data</strong> (no names, emails, IDs, or any PII).
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ipConfirmed}
            onChange={(e) => setIpConfirmed(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-sm text-gray-700">
            I own or have the right to license all content in this upload. I agree to FairData&apos;s{' '}
            <a href="/terms" className="underline">Terms of Service</a>.
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Upload progress */}
      {uploading && file && file.size > LARGE_FILE_THRESHOLD && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-black h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {uploading ? 'Uploading…' : 'Submit dataset'}
      </button>
    </form>
  )
}
