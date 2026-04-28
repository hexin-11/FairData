'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Dataset } from '@/lib/types'
import { LICENSE_LABELS } from '@/lib/license'
import { FileText, ArrowUpRight, Download, DollarSign, CheckCircle, Clock, Tag, ShieldCheck, Database, Loader2, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import UploadForm from './UploadForm'

const REVENUE_STATS = [
  { month: 'Oct', revenue: 12000 }, { month: 'Nov', revenue: 15000 },
  { month: 'Dec', revenue: 18000 }, { month: 'Jan', revenue: 22000 },
  { month: 'Feb', revenue: 19000 }, { month: 'Mar', revenue: 25000 },
]

interface Props {
  datasets: Dataset[]
  transactions: any[]
}

export default function ProviderHubClient({ datasets, transactions }: Props) {
  const [showModal, setShowModal] = useState(false)

  const activeCount = datasets.filter(d => d.status === 'active').length
  const pendingCount = datasets.filter(d => d.status === 'pending').length
  const totalRevenue = transactions.reduce((sum: number, t: any) => sum + (t.creator_payout_usd ?? 0), 0)

  return (
    <>
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Provider Dashboard</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Submit high-quality data and track verification status.</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-slate-200 text-slate-600 font-bold text-xs px-4 h-10 rounded-xl hover:bg-slate-50 transition-colors">
            System Logs
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 h-10 rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2 transition-colors"
          >
            <Upload size={15} />
            Upload Dataset
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Settled Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, trend: 'All time', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Purchases', value: transactions.length.toString(), icon: Download, trend: 'Completed', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Sets', value: activeCount.toString(), icon: CheckCircle, trend: 'Live', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending Review', value: pendingCount.toString(), icon: Clock, trend: 'Ongoing', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-slate-200 hover:border-indigo-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('p-2.5 rounded-xl', stat.bg, stat.color)}>
                      <stat.icon size={20} />
                    </div>
                    <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-slate-100 text-[10px]">
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Settlement History</CardTitle>
                  <CardDescription>Verified sales revenue available for withdrawal.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_STATS}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Upload */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Quick Upload</CardTitle>
              <CardDescription>Upload raw data for protocol audit.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => setShowModal(true)}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <p className="text-sm font-bold text-slate-800 tracking-tight">Upload Dataset</p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium italic">ZIP, CSV, JSONL, TXT — max 2GB</p>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Audit Pipeline</p>
                {[
                  { name: 'Legal Review', status: 'Pending', icon: ShieldCheck, color: 'text-amber-500' },
                  { name: 'Hash Verification', status: 'Auto', icon: Tag, color: 'text-indigo-500' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center', item.color)}>
                        <item.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 leading-none">{item.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.status}</p>
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Datasets Table */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
            <div>
              <CardTitle>Catalog Node Status</CardTitle>
              <CardDescription>Official record of your data assets.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {datasets.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Database size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">No datasets yet. Upload your first dataset.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest pl-6">Dataset</TableHead>
                    <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">License</TableHead>
                    <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Price</TableHead>
                    <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                    <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datasets.map((dataset) => (
                    <TableRow key={dataset.id} className="hover:bg-indigo-50/20">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <Database size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{dataset.title}</p>
                            <p className="text-[10px] font-mono text-slate-400 bg-slate-100 w-fit px-1 rounded mt-1">
                              FD-{dataset.id.slice(0, 6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-wider bg-white border-slate-200">
                          {LICENSE_LABELS[dataset.license_type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-800">${dataset.price_usd}</TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center gap-1">
                          {dataset.status === 'active' ? (
                            <>
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-bold h-5 px-2">ACTIVE</Badge>
                              <div className="flex gap-1">
                                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />)}
                              </div>
                            </>
                          ) : (
                            <>
                              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] font-bold h-5 px-2">PENDING</Badge>
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                {[0,1].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />)}
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors ml-auto text-slate-400">
                          <ArrowUpRight size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">List your dataset</h2>
                <p className="text-sm text-slate-500 mt-0.5">Set your price, choose a license, and upload your file.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="px-8 py-6">
              <UploadForm onSuccess={() => { setShowModal(false) }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
