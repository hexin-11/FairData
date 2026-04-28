'use client'

import { useState } from 'react'
import UploadForm from './UploadForm'
import { Upload, X } from 'lucide-react'

export default function UploadModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] px-6 h-11 rounded-xl shadow-xl shadow-slate-200 flex items-center gap-2 transition-colors"
      >
        <Upload size={16} />
        Upload Dataset
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">List your dataset</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Set your price, choose a license, and upload your file.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-8 py-6">
              <UploadForm onSuccess={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
