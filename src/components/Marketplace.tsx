import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_DATASETS } from '@/constants';
import { Search, Filter, Star, Download, ShieldCheck, ExternalLink, FileText, ImageIcon, Code, BadgeCheck, Lock, Database, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dataset } from '@/types';

interface MarketplaceProps {
  onSelectDataset: (dataset: Dataset) => void;
}

export default function Marketplace({ onSelectDataset }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredDatasets = MOCK_DATASETS.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data Catalog</h1>
          <p className="text-slate-500 mt-1 font-medium">Protocol-audited datasets with verified provenance and automated licensing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-2 font-bold text-[10px] tracking-wider uppercase">
            <BadgeCheck size={14} />
            KYC Verified Providers
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-2xl border border-slate-200 subtle-shadow shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search by collection hash, domain, or provenance..." 
            className="pl-11 h-11 border-slate-200 focus:ring-indigo-500 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] h-11 border-slate-200 rounded-xl font-medium">
              <SelectValue placeholder="Data Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="text">Text (LLM Training)</SelectItem>
              <SelectItem value="image">Vision (Diffusion)</SelectItem>
              <SelectItem value="code">Code (Coding Agents)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11 rounded-xl gap-2 border-slate-200 font-medium px-5">
            <Filter size={16} />
            License Type
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDatasets.map((dataset, i) => (
            <motion.div
              key={dataset.id}
              layout
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="group h-full flex flex-col hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer overflow-hidden border-slate-100 rounded-2xl" onClick={() => onSelectDataset(dataset)}>
                <CardHeader className="p-0">
                  <div className="h-44 bg-slate-900 relative overflow-hidden">
                    {/* Abstract Tech Background */}
                    <div className="absolute inset-0 opacity-40">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
                      <div className="grid grid-cols-8 gap-1 p-2">
                        {Array.from({ length: 32 }).map((_, idx) => (
                          <div key={idx} className="h-2 bg-indigo-500/10 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-700">
                      <div className="w-24 h-24 border border-indigo-500/50 rounded-full flex items-center justify-center">
                         <div className="w-16 h-16 border border-indigo-500/30 rounded-full flex items-center justify-center">
                           <Database size={32} className="text-white" />
                         </div>
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md uppercase text-[9px] font-black tracking-widest px-2 py-0.5">
                        {dataset.type} SERIES
                      </Badge>
                      {dataset.isVerified && (
                        <Badge className="bg-emerald-500 text-white border-none flex items-center gap-1.5 text-[9px] font-black px-2 py-0.5 shadow-lg shadow-emerald-500/20">
                          <CheckCircle size={10} />
                          COMPLIANT
                        </Badge>
                      )}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                       <span className="text-[10px] font-mono text-indigo-300/80 tracking-tighter truncate max-w-[120px]">
                         HASH: {(Math.random().toString(16) + "00000000").slice(2, 18).toUpperCase()}
                       </span>
                       <div className="bg-white px-3 py-1 rounded-lg text-sm font-black text-slate-900 shadow-xl">
                          ${dataset.price}
                       </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1 bg-white">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold text-slate-700">{dataset.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <Lock size={12} className="text-indigo-600" />
                       {dataset.license}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">
                    {dataset.title}
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed font-semibold opacity-70">
                    {dataset.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {dataset.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex flex-col gap-4 bg-white mt-auto">
                  <Separator className="bg-slate-100" />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                        {dataset.creator.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-800 font-bold leading-none">{dataset.creator}</span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">Verified Node</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-slate-50 hover:bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-wider h-8 rounded-lg px-4 border border-transparent hover:border-indigo-100">
                      View Audit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredDatasets.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No datasets found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
          <Button variant="link" className="text-indigo-600 mt-4" onClick={() => { setSearchQuery(''); setFilterType('all'); }}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
