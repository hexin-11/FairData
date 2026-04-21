import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, ShieldCheck, Download, ShoppingCart, Star, Calendar, 
  FileText, Globe, Lock, Info, CheckCircle2, ClipboardCheck, QrCode, Share2 
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Dataset } from '@/types';

interface DatasetDetailProps {
  dataset: Dataset;
  onBack: () => void;
}

export default function DatasetDetail({ dataset, onBack }: DatasetDetailProps) {
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'confirming' | 'completed'>('idle');
  const txHash = "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join("");

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-6xl mx-auto space-y-10 pb-20"
    >
      <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-900 transition-colors" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to Data Market
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-indigo-600 text-white border-none uppercase text-[10px] font-black tracking-widest px-3 py-1">
                {dataset.type} SERIES
              </Badge>
              {dataset.isVerified && (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1.5 px-3 py-1 font-bold text-[10px]">
                  <ShieldCheck size={14} />
                  PROTOCOL VERIFIED
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">{dataset.title}</h1>
              <p className="text-slate-400 font-mono text-xs">COLLECTION_ID: {(Math.random().toString(16) + "000000").slice(2, 10).toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-500 font-medium pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-500" fill="currentColor" />
                <span className="font-bold text-slate-900">{dataset.rating}</span>
                <span className="text-slate-300">/ 5.0</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Download size={18} className="text-slate-400" />
                <span className="font-bold text-slate-900">{dataset.downloads}</span>
                <span className="text-slate-400 font-normal">Licenses Issued</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" />
                <span className="text-slate-400 font-normal">Verified: {dataset.createdAt}</span>
              </div>
            </div>
          </div>

          <section className="space-y-4">
             <div className="flex items-center gap-2 text-slate-900">
                <ClipboardCheck size={20} className="text-indigo-600" />
                <h3 className="text-xl font-bold tracking-tight">Audit Summary</h3>
             </div>
             <Card className="border-slate-200 subtle-shadow bg-white/50">
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Provenance Record</p>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          Original source data has been traced to verified providers with full copyright compliance hashes recorded on the FairData Protocol.
                        </p>
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
                      { label: 'Cleaned', val: '100%' },
                      { label: 'Legal Audit', val: 'Passed' },
                      { label: 'Compliance', val: 'Verified' },
                    ].map(st => (
                      <div key={st.label}>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">{st.label}</p>
                         <p className="text-sm font-black text-slate-800">{st.val}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
             </Card>
          </section>

          <Card className="border-slate-200 subtle-shadow overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg">Data Protocol Samples</CardTitle>
              <CardDescription>Verified sample entries from the current series.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {dataset.sampleData.map((sample, i) => (
                  <div key={i} className="group p-5 rounded-2xl bg-slate-900 scale-[0.99] hover:scale-100 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2 text-slate-500">
                         <FileText size={14} />
                         <span className="text-[11px] font-mono font-bold tracking-tight">{sample}</span>
                       </div>
                       <Badge variant="outline" className="text-[9px] font-mono border-slate-700 text-slate-400">ENTRY_{i+102}</Badge>
                    </div>
                    <pre className="text-emerald-400 font-mono text-xs overflow-x-auto p-2 bg-black/30 rounded-lg">
                      <code>
                        {`{ 
  "id": "hash_${i}a4f2...", 
  "label": "verified",
  "provenance_node": "FD-NODE-003",
  "content": "${sample.replace('.jpg', '').replace('.txt', '').replace('.py', '').replace('.mp4', '')} analysis complete..." 
}`}
                      </code>
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing & Purchase */}
        <div className="space-y-6">
          <Card className="border-slate-200 subtle-shadow sticky top-8 bg-white overflow-hidden">
            <div className="h-1 bg-indigo-600 w-full" />
            <CardContent className="p-8 space-y-8">
              <div className="space-y-1 text-center lg:text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Settlement Price</p>
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">${dataset.price}<span className="text-xl">.00</span></h2>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold">USD/LICENSE</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-base font-black uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100">
                      <ShoppingCart size={20} />
                      Acquire License
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <AnimatePresence mode="wait">
                       {purchaseStep === 'idle' && (
                         <motion.div 
                           key="step1"
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="p-8 space-y-6"
                         >
                            <DialogHeader>
                              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                                 <ShieldCheck size={28} />
                              </div>
                              <DialogTitle className="text-2xl font-black tracking-tighter">Confirm Acquisition</DialogTitle>
                              <DialogDescription className="font-medium text-slate-500">
                                Please review the protocol terms for <strong>{dataset.title}</strong>.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                               <div className="flex justify-between items-center text-sm font-bold">
                                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Data Origin</span>
                                  <span className="text-slate-900">{dataset.creator}</span>
                               </div>
                               <Separator className="bg-slate-200/50" />
                               <div className="flex justify-between items-center text-sm font-bold">
                                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">License Type</span>
                                  <span className="text-indigo-600">{dataset.license}</span>
                               </div>
                               <Separator className="bg-slate-200/50" />
                               <div className="flex justify-between items-center text-sm font-bold">
                                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Total Due</span>
                                  <span className="text-slate-900">${dataset.price}.00</span>
                               </div>
                            </div>

                            <DialogFooter className="flex-col sm:flex-col gap-3">
                               <Button 
                                 className="w-full h-12 bg-indigo-600 font-bold uppercase tracking-widest"
                                 onClick={() => {
                                   setPurchaseStep('confirming');
                                   setTimeout(() => setPurchaseStep('completed'), 1500);
                                 }}
                               >
                                 Settle & Issue Certificate
                               </Button>
                               <Button variant="ghost" className="text-slate-400 font-bold text-xs uppercase tracking-widest h-10">Decline Settlement</Button>
                            </DialogFooter>
                         </motion.div>
                       )}

                       {purchaseStep === 'confirming' && (
                         <motion.div 
                           key="step2"
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]"
                         >
                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <div>
                               <h3 className="text-xl font-black tracking-tight">Verifying Ledger</h3>
                               <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Generating License Certificate...</p>
                            </div>
                         </motion.div>
                       )}

                       {purchaseStep === 'completed' && (
                         <motion.div 
                           key="step3"
                           initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                           className="p-0 overflow-hidden"
                         >
                            <div className="bg-emerald-500 p-8 flex flex-col items-center justify-center text-white text-center">
                               <CheckCircle2 size={56} className="mb-4" />
                               <h3 className="text-2xl font-black tracking-tighter">License Issued</h3>
                               <p className="text-emerald-100 text-xs font-bold uppercase tracking-[0.2em] mt-1">FairData Protocol Settlement Complete</p>
                            </div>
                            <div className="p-8 space-y-6 bg-white">
                               <div className="border-2 border-dashed border-slate-100 p-6 rounded-2xl relative">
                                  <div className="absolute top-4 right-4 text-slate-100">
                                     <QrCode size={48} />
                                  </div>
                                  <div className="space-y-4">
                                     <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificate Hash</p>
                                        <p className="text-[11px] font-mono bg-slate-50 p-2 rounded break-all mt-1">{txHash}</p>
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Category</p>
                                           <p className="text-sm font-black text-slate-900">{dataset.type.toUpperCase()}</p>
                                        </div>
                                        <div>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</p>
                                           <p className="text-sm font-black text-slate-900">{new Date().toISOString().split('T')[0]}</p>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  <Button variant="outline" className="flex-1 h-11 font-bold text-xs uppercase tracking-widest gap-2 bg-slate-50 border-slate-100">
                                     <Download size={16} />
                                     Download PDF
                                  </Button>
                                  <Button variant="outline" className="h-11 px-4 border-slate-100 bg-slate-50">
                                     <Share2 size={18} />
                                  </Button>
                               </div>
                               <Button variant="link" className="w-full text-indigo-600 font-bold text-xs uppercase tracking-widest" onClick={() => setPurchaseStep('idle')}>
                                  Close Terminal
                               </Button>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full h-14 rounded-xl border-slate-200 font-bold text-slate-600 gap-3 hover:bg-slate-50 transition-all">
                  <Download size={20} />
                  Download Protocol Sample
                </Button>
              </div>

              <Separator className="bg-slate-100" />

              <div className="space-y-5">
                <h4 className="font-black text-slate-900 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  <Lock size={16} className="text-indigo-600" />
                  Smart-License Terms
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'License Node', value: dataset.license },
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
                    Settlements are processed via the Protocol Gateway. Automated compliance checks are performed prior to certificate issuance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 subtle-shadow bg-slate-50/30">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Node Operator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-700 font-black text-2xl shadow-sm">
                  {dataset.creator.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-slate-900 tracking-tight">{dataset.creator}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                     <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Active Node</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full h-11 rounded-xl bg-white border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors">Explorer Profile</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
