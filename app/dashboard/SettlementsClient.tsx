'use client'

import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowUpRight, Download } from 'lucide-react'

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef']

function buildRevenueChart(transactions: any[]) {
  const months: Record<string, number> = {}
  transactions.forEach((t) => {
    const d = new Date(t.created_at)
    const key = d.toLocaleString('en-US', { month: 'short' })
    months[key] = (months[key] ?? 0) + (t.creator_payout_usd != null ? t.creator_payout_usd : (t.amount_usd ?? 0) * 0.85)
  })
  // Ensure last 6 months are represented
  const now = new Date()
  const result = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('en-US', { month: 'short' })
    result.push({ month: key, revenue: Math.round(months[key] ?? 0) })
  }
  return result
}

interface Props {
  transactions: any[]
}

export default function SettlementsClient({ transactions }: Props) {
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.creator_payout_usd != null ? t.creator_payout_usd : (t.amount_usd ?? 0) * 0.85), 0)
  const totalVolume = transactions.reduce((sum, t) => sum + (t.amount_usd ?? 0), 0)
  const avgSale = transactions.length > 0 ? totalVolume / transactions.length : 0
  const revenueData = buildRevenueChart(transactions)

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settlement Ledger</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Official record of protocol transactions and node earnings.</p>
        </div>
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-black text-[10px] tracking-widest px-3 py-1">
          NODE_ID: FD-ALPHA
        </Badge>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Available Balance - dark card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet size={80} />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                    <Wallet size={24} />
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[10px] tracking-wider uppercase">
                    Verified Balance
                  </Badge>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Available for Withdrawal</p>
                <h3 className="text-4xl font-black mt-1 tracking-tighter">
                  ${totalRevenue.toFixed(0)}<span className="text-lg text-slate-500">.00</span>
                </h3>
                <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-indigo-900/40">
                  Initiate Payout
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gross Volume */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-slate-200 bg-white h-full">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <TrendingUp size={24} />
                  </div>
                  {transactions.length > 0 && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-black bg-emerald-50 px-2.5 py-1 rounded-full">
                      <ArrowUpRight size={14} />
                      Growing
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Protocol Gross Volume</p>
                  <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">
                    ${totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume.toFixed(0)}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-3 font-medium uppercase tracking-widest bg-slate-50 w-fit px-2 py-0.5 rounded-md">
                    {transactions.length} Settlement{transactions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Average Sale */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-slate-200 bg-white h-full">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <CreditCard size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Unit Cost
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Average License Sale</p>
                  <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">
                    ${avgSale.toFixed(0)}<span className="text-lg text-slate-400 font-medium">.{(avgSale % 1 * 100).toFixed(0).padStart(2, '0')}</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {transactions.length} Protocol Event{transactions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-slate-200 bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-slate-50">
              <div>
                <CardTitle className="text-xl font-black tracking-tight">Financial Performance</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Provider Node FD-ALPHA-Series</CardDescription>
              </div>
              <Select defaultValue="6m">
                <SelectTrigger className="w-[140px] h-10 border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Monthly View</SelectItem>
                  <SelectItem value="6m">Quarterly View</SelectItem>
                  <SelectItem value="1y">Yearly Archive</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="h-[320px] p-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorRevDash)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Yield Pie */}
          <Card className="border-slate-200 bg-white">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black tracking-tight">Category Yield</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Domain Share Breakdown</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] flex flex-col items-center pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Commercial Training', value: 40 },
                      { name: 'Fine-Tuning', value: 30 },
                      { name: 'No Derivatives', value: 20 },
                      { name: 'Other', value: 10 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} className="focus:outline-none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full px-4 pb-4">
                {['Commercial', 'Fine-Tuning', 'Restricted', 'Other'].map((cat, i) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{cat}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settlement Logs Table */}
        <Card className="border-slate-200 bg-white overflow-hidden">
          <CardHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-xl font-black tracking-tight">Settlement Logs</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Immutable record of protocol distributions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <DollarSign size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">No settlements yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow className="hover:bg-transparent h-14">
                    <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] pl-8">Tx Identifier</TableHead>
                    <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Date (UTC)</TableHead>
                    <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Dataset</TableHead>
                    <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Amount</TableHead>
                    <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Payout</TableHead>
                    <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id} className="hover:bg-indigo-50/10 h-16 border-slate-50 group">
                      <TableCell className="font-mono text-[10px] font-black text-slate-400 pl-8 group-hover:text-indigo-600 transition-colors bg-slate-50/30">
                        FD-{t.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="text-slate-600 font-bold text-xs">
                        {new Date(t.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="font-black text-slate-900 text-sm tracking-tight max-w-[180px] truncate">
                        {t.dataset?.title ?? '—'}
                      </TableCell>
                      <TableCell className="font-black text-slate-900">
                        ${t.amount_usd?.toFixed(2) ?? '—'}
                      </TableCell>
                      <TableCell className="font-black text-emerald-700">
                        ${(t.creator_payout_usd ?? (t.amount_usd * 0.85))?.toFixed(2) ?? '—'}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 shadow-sm">
                          CONFIRMED
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
