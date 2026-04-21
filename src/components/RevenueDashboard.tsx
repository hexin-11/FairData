import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { REVENUE_STATS, PAYMENT_HISTORY } from '@/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export default function RevenueDashboard() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Settlement Ledger</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Official record of protocol transactions and node earnings.</p>
        </div>
        <Badge variant="outline" className="w-fit bg-indigo-50 text-indigo-700 border-indigo-100 font-black text-[10px] tracking-widest px-3 py-1">
           NODE_ID: FD-7729-ALPHA
        </Badge>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet size={80} />
           </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                <Wallet size={24} />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[10px] tracking-wider uppercase">Verified Balance</Badge>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Available for Withdrawal</p>
            <h3 className="text-4xl font-black mt-1 tracking-tighter">$12,450<span className="text-lg text-slate-500">.00</span></h3>
            <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-indigo-900/40">Initiate Payout</Button>
          </CardContent>
        </Card>

        <Card className="subtle-shadow border-slate-200 bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <TrendingUp size={24} />
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-black bg-emerald-50 px-2.5 py-1 rounded-full">
                <ArrowUpRight size={14} />
                14.2%
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Protocol Gross Volume</p>
            <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">$172.4k</h3>
            <p className="text-[11px] text-slate-400 mt-3 font-medium uppercase tracking-widest bg-slate-50 w-fit px-2 py-0.5 rounded-md">Growth Series A</p>
          </CardContent>
        </Card>

        <Card className="subtle-shadow border-slate-200 bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <CreditCard size={24} />
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Unit Cost
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Average License Sale</p>
            <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tighter">$342<span className="text-lg text-slate-400 font-medium">.50</span></h3>
            <div className="flex items-center gap-2 mt-3">
               <div className="w-2 h-2 rounded-full bg-slate-300"></div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">503 Protocol Events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 subtle-shadow border-slate-200 bg-white overflow-hidden">
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
          <CardContent className="h-[380px] p-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_STATS}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card className="subtle-shadow border-slate-200 bg-white">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-xl font-black tracking-tight">Category Yield</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Domain Share Breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] flex flex-col items-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Image', value: 40 },
                    { name: 'Text', value: 30 },
                    { name: 'Code', value: 20 },
                    { name: 'Audio', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {REVENUE_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full mt-6 px-4">
              {['Vision', 'Text', 'Logic', 'Signal'].map((cat, i) => (
                <div key={cat} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{cat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="subtle-shadow border-slate-200 bg-white overflow-hidden">
        <CardHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-xl font-black tracking-tight">Settlement Logs</CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">Immutable record of protocol distributions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent h-14">
                <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] pl-8">Tx Identifier</TableHead>
                <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Date (UTC)</TableHead>
                <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Series Title</TableHead>
                <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Amount Invoiced</TableHead>
                <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Verification</TableHead>
                <TableHead className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] text-right pr-8">Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENT_HISTORY.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-indigo-50/10 h-16 border-slate-50 group">
                  <TableCell className="font-mono text-[10px] font-black text-slate-400 pl-8 group-hover:text-indigo-600 transition-colors bg-slate-50/30">{payment.id}</TableCell>
                  <TableCell className="text-slate-600 font-bold text-xs">{payment.date}</TableCell>
                  <TableCell className="font-black text-slate-900 text-sm tracking-tight">{payment.datasetName}</TableCell>
                  <TableCell className="font-black text-slate-900">${payment.amount}<span className="text-[10px] ml-0.5 text-slate-300">.00</span></TableCell>
                  <TableCell>
                    {payment.status === 'completed' ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 shadow-sm">
                        CONFIRMED
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-700 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 shadow-sm">
                        SETTLING
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="sm" className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 px-4 h-9 rounded-lg border border-transparent hover:border-indigo-100">Explorer View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
