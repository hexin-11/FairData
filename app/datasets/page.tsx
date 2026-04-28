import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Dataset } from '@/lib/types'
import { LICENSE_LABELS, LICENSE_COLORS } from '@/lib/license'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BadgeCheck, Database, Star, Lock, Search } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

async function getDatasets(): Promise<Dataset[]> {
  const { data } = await supabaseAdmin
    .from('datasets')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  return (data as Dataset[]) ?? []
}

export const revalidate = 60

export default async function DatasetsPage() {
  const datasets = await getDatasets()

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search datasets..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="hidden xl:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Online</span>
              </div>
            </div>
          </div>
          <Link
            href="/upload"
            className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] px-6 h-11 rounded-xl shadow-xl shadow-slate-200 flex items-center gap-2 transition-colors"
          >
            <Database size={16} />
            List Dataset
          </Link>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data Catalog</h1>
                <p className="text-slate-500 mt-1 font-medium">
                  Licensed datasets with verified provenance and automated certificate generation.
                </p>
              </div>
              <Badge variant="outline" className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-2 font-bold text-[10px] tracking-wider uppercase w-fit">
                <BadgeCheck size={14} />
                Verified Providers
              </Badge>
            </div>

            {datasets.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No datasets yet</h3>
                <p className="text-slate-500 mt-2">Be the first to list a dataset.</p>
                <Link href="/upload" className="text-indigo-600 font-medium mt-4 inline-block hover:underline">
                  List your dataset →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {datasets.map((dataset) => (
                  <Link
                    key={dataset.id}
                    href={`/datasets/${dataset.id}`}
                    className="group bg-white h-full flex flex-col hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden border border-slate-100 rounded-2xl"
                  >
                    {/* Card image area */}
                    <div className="h-44 bg-slate-900 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-700">
                        <div className="w-24 h-24 border border-indigo-500/50 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 border border-indigo-500/30 rounded-full flex items-center justify-center">
                            <Database size={32} className="text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/10 text-white border border-white/20 backdrop-blur-md uppercase text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full">
                          Dataset
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        {dataset.sha256_hash && (
                          <span className="text-[10px] font-mono text-indigo-300/80 tracking-tighter truncate max-w-[140px]">
                            {dataset.sha256_hash.slice(0, 16).toUpperCase()}
                          </span>
                        )}
                        <div className="bg-white px-3 py-1 rounded-lg text-sm font-black text-slate-900 shadow-xl ml-auto">
                          ${dataset.price_usd}
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs font-bold text-slate-700">New</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lock size={12} className="text-indigo-600" />
                          {LICENSE_LABELS[dataset.license_type]}
                        </div>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">
                        {dataset.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed font-semibold opacity-70 flex-1">
                        {dataset.description}
                      </p>
                      <div className="mt-4">
                        <Separator className="bg-slate-100 mb-4" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-medium">{formatBytes(dataset.file_size)}</span>
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">View Listing →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
