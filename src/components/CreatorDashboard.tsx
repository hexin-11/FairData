import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_DATASETS, REVENUE_STATS } from '@/constants';
import { FileText, ImageIcon, Code, ArrowUpRight, Download, DollarSign, Users, Upload, CheckCircle, Clock, Tag, ShieldCheck, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreatorDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Provider Dashboard</h1>
          <p className="text-slate-500 mt-1">Submit high-quality text data and track verification status.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-200">System Logs</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100">Upload Dataset</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Settled Revenue', value: '$172.4k', icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Purchases', value: '903', icon: Download, trend: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Verified Sets', value: '12', icon: CheckCircle, trend: '+2', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending Review', value: '3', icon: Clock, trend: 'Ongoing', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="subtle-shadow border-slate-200 hover:border-indigo-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
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
        {/* Main Chart */}
        <Card className="lg:col-span-2 subtle-shadow border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Settlement History</CardTitle>
                <CardDescription>Verified sales revenue available for withdrawal.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-xs uppercase tracking-widest">
                Analytics Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_STATS}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Upload / Audit Status */}
        <Card className="subtle-shadow border-slate-200">
          <CardHeader>
            <CardTitle>MVP Data Entry</CardTitle>
            <CardDescription>Upload raw text for protocol audit.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <p className="text-sm font-bold text-slate-800 tracking-tight">Upload Text Corpus</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium italic">Protocol supports .txt, .jsonl, .csv</p>
            </div>
            
            <div className="mt-8 space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Audit Pipeline</p>
              {[
                { name: 'Legal Review', status: 'Pending', icon: ShieldCheck, color: 'text-amber-500' },
                { name: 'Text Tagging', status: 'In Progress', icon: Tag, color: 'text-indigo-500' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center", item.color)}>
                      <item.icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 leading-none">{item.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.status}</p>
                    </div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Datasets Table */}
      <Card className="subtle-shadow border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
          <div>
            <CardTitle>Catalog Node Status</CardTitle>
            <CardDescription>Official record of audited data assets on protocol.</CardDescription>
          </div>
          <Tabs defaultValue="all" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
              <TabsTrigger value="all" className="text-xs font-bold">All</TabsTrigger>
              <TabsTrigger value="active" className="text-xs font-bold">Verified</TabsTrigger>
              <TabsTrigger value="draft" className="text-xs font-bold">Audit</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest pl-6">Collection Hash</TableHead>
                <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Format</TableHead>
                <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Base Price</TableHead>
                <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Tags</TableHead>
                <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right pr-6">Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DATASETS.slice(0, 3).map((dataset) => (
                <TableRow key={dataset.id} className="hover:bg-indigo-50/20">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                        <Database size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{dataset.title}</p>
                        <p className="text-[10px] font-mono text-slate-400 bg-slate-100 w-fit px-1 rounded mt-1">FD-{dataset.id.padStart(6, '0')}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-wider bg-white border-slate-200">Text/JSON</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-slate-800">${dataset.price}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {dataset.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{t}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-1">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-bold h-5 px-2">
                        AUDITED
                      </Badge>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                      <ArrowUpRight size={16} />
                    </Button>
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
