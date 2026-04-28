'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, ShieldCheck } from 'lucide-react'
import { LicenseType } from '@/lib/types'
import { LICENSE_LABELS } from '@/lib/license'

interface Props {
  datasetId: string
  title: string
  licenseType: LicenseType
  priceUsd: number
  sha256Hash: string | null
  createdAt: string
}

type Step = 'idle' | 'confirming'

export default function BuyButton({ datasetId, title, licenseType, priceUsd, sha256Hash, createdAt }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('idle')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  async function handleSettle() {
    setError('')
    if (!email.trim()) { setError('Please enter your email.'); return }

    setStep('confirming')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset_id: datasetId, buyer_email: email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStep('idle')
        setError(data.error ?? 'Something went wrong.')
        return
      }
      window.location.href = data.url
    } catch {
      setStep('idle')
      setError('Something went wrong. Please try again.')
    }
  }

  function handleOpenChange(o: boolean) {
    setOpen(o)
    if (!o) { setStep('idle'); setError('') }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-base font-black uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100"
      >
        <ShoppingCart size={20} />
        Acquire License
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {step === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-8 space-y-6"
              >
                <DialogHeader>
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                    <ShieldCheck size={28} />
                  </div>
                  <DialogTitle className="text-2xl font-black tracking-tighter">
                    Confirm Acquisition
                  </DialogTitle>
                  <DialogDescription className="font-medium text-slate-500">
                    Please review the protocol terms for <strong>{title}</strong>.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px]">License Type</span>
                    <span className="text-indigo-600 text-sm">{LICENSE_LABELS[licenseType]}</span>
                  </div>
                  <Separator className="bg-slate-200/50" />
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px]">Total Due</span>
                    <span className="text-slate-900 text-sm">${priceUsd.toFixed(0)}.00</span>
                  </div>
                  <Separator className="bg-slate-200/50" />
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px]">Timestamp</span>
                    <span className="text-slate-900 text-sm">
                      {new Date(createdAt).toISOString().split('T')[0]}
                    </span>
                  </div>
                  {sha256Hash && (
                    <>
                      <Separator className="bg-slate-200/50" />
                      <div className="space-y-1.5">
                        <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Dataset Hash</span>
                        <p className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 break-all leading-relaxed">
                          {sha256Hash}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSettle()}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50"
                  />
                  {error && <p className="text-xs text-red-600 font-medium mt-2">{error}</p>}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleSettle}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold uppercase tracking-widest"
                  >
                    Settle &amp; Issue Certificate
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="text-slate-400 font-bold text-xs uppercase tracking-widest h-10"
                  >
                    Decline Settlement
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'confirming' && (
              <motion.div
                key="confirming"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]"
              >
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <div>
                  <h3 className="text-xl font-black tracking-tight">Verifying Ledger</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
                    Generating License Certificate...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  )
}
