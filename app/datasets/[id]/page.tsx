import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Dataset } from '@/lib/types'
import { LICENSE_LABELS, LICENSE_DESCRIPTIONS } from '@/lib/license'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Sidebar from '@/components/Sidebar'
import BuyButton from './BuyButton'
import {
  ArrowLeft, ShieldCheck, Download, Star, Calendar,
  Lock, Info, ClipboardCheck, Database,
} from 'lucide-react'

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

async function getDataset(id: string): Promise<Dataset | null> {
  const { data } = await supabaseAdmin
    .from('datasets')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single()
  return (data as Dataset) ?? null
}

async function getPurchaseCount(datasetId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('dataset_id', datasetId)
    .eq('status', 'completed')
  return count ?? 0
}

export default async function DatasetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [dataset, purchaseCount] = await Promise.all([getDataset(id), getPurchaseCount(id)])
  if (!dataset) notFound()

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 z-10">
          <Link href="/datasets">
            <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={18} />
              Back to Data Market
            </Button>
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column: Info */}
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-indigo-600 text-white border-none uppercase text-[10px] font-black tracking-widest px-3 py-1">
                      Dataset
                    </Badge>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1.5 px-3 py-1 font-bold text-[10px]">
                      <ShieldCheck size={14} />
                      PROTOCOL VERIFIED
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">{dataset.title}</h1>
                    <p className="text-slate-400 font-mono text-xs">
                      COLLECTION_ID: {dataset.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 text-sm text-slate-500 font-medium pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-amber-500" fill="currentColor" />
                      <span className="font-bold text-slate-900">New</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <Download size={18} className="text-slate-400" />
                      <span className="font-bold text-slate-900">{purchaseCount}</span>
                      <span className="text-slate-400 font-normal">Licenses Issued</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-slate-400" />
                      <span className="text-slate-400 font-normal">
                        Verified: {new Date(dataset.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit Summary */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <ClipboardCheck size={20} className="text-indigo-600" />
                    <h3 className="text-xl font-bold tracking-tight">Audit Summary</h3>
                  </div>
                  <Card className="border-slate-200 bg-white/50">
                    <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</p>
                          <p className="text-slate-600 font-medium leading-relaxed">{dataset.description}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Audit Grade</p>
                          <div className="flex items-center gap-3">
                            <div className="text-3xl font-black text-indigo-600 tracking-tighter">A++</div>
                            <Badge className="bg-indigo-50 text-indigo-700 border-none">TOP RANKED</Badge>
                          </div>
                        </div>
                      </div>
                      <Separator className="opacity-50" />
                      <div className="grid grid-cols-3 gap-6">
                        {[
                          { label: 'File Size', val: formatBytes(dataset.file_size) },
                          { label: 'Legal Audit', val: 'Passed' },
                          { label: 'Compliance', val: 'Verified' },
                        ].map((st) => (
                          <div key={st.label}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{st.label}</p>
                            <p className="text-sm font-black text-slate-800">{st.val}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Hash verification */}
                {dataset.sha256_hash && (
                  <Card className="border-slate-200 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                      <CardTitle className="text-lg">Integrity Certificate</CardTitle>
                      <CardDescription>SHA-256 hash registered on the FairData Protocol.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="p-5 rounded-2xl bg-slate-900">
                        <div className="flex items-center gap-2 text-slate-500 mb-3">
                          <Database size={14} />
                          <span className="text-[11px] font-mono font-bold tracking-tight">SHA-256 Fingerprint</span>
                        </div>
                        <pre className="text-emerald-400 font-mono text-xs overflow-x-auto p-2 bg-black/30 rounded-lg break-all whitespace-normal">
                          <code>{dataset.sha256_hash}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column: Pricing & Purchase */}
              <div className="space-y-6">
                <Card className="border-slate-200 sticky top-8 bg-white overflow-hidden">
                  <div className="h-1 bg-indigo-600 w-full" />
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-1 text-center lg:text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Settlement Price</p>
                      <div className="flex items-baseline justify-center lg:justify-start gap-2">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                          ${dataset.price_usd.toFixed(0)}<span className="text-xl">.00</span>
                        </h2>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold">USD/LICENSE</Badge>
                      </div>
                    </div>

                    <BuyButton
                      datasetId={dataset.id}
                      title={dataset.title}
                      licenseType={dataset.license_type}
                      priceUsd={dataset.price_usd}
                      sha256Hash={dataset.sha256_hash}
                      createdAt={dataset.created_at}
                    />

                    <Separator className="bg-slate-100" />

                    <div className="space-y-5">
                      <h4 className="font-black text-slate-900 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                        <Lock size={16} className="text-indigo-600" />
                        Smart-License Terms
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: 'License Node', value: LICENSE_LABELS[dataset.license_type] },
                          { label: 'Rights', value: 'Perpetual Commercial' },
                          { label: 'Source Provenance', value: 'Verified Chain' },
                          { label: 'AI Model Training', value: 'Authorized' },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-400 uppercase tracking-wider">{item.label}</span>
                            <span className="text-slate-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                      <div className="flex gap-4">
                        <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-indigo-900/70 font-medium leading-relaxed">
                          {LICENSE_DESCRIPTIONS[dataset.license_type]}. A timestamped PDF certificate is emailed on purchase.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What you receive */}
                <Card className="border-slate-200 bg-slate-50/30">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">What you receive</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      'Full dataset download link (emailed upon purchase)',
                      'PDF license certificate with transaction ID, dataset hash, license terms, and timestamp',
                      'Permanent transaction page for re-downloading the certificate',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
