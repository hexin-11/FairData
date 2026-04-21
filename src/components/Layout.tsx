import React from 'react';
import { LayoutDashboard, ShoppingBag, BarChart3, Upload, ShieldCheck, Search, Bell, Boxes, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'creator' | 'marketplace' | 'revenue';
  setActiveView: (view: 'creator' | 'marketplace' | 'revenue') => void;
}

export default function Layout({ children, activeView, setActiveView }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl rotate-12 absolute opacity-20 scale-110"></div>
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center relative z-10 shadow-lg shadow-indigo-200">
              <Boxes className="text-white w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">FairData</span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Protocol</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <div className="py-2">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Supply Side</p>
            <Button
              variant={activeView === 'creator' ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3 px-3 h-10 mb-1 font-medium transition-all duration-200", 
                activeView === 'creator' ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setActiveView('creator')}
            >
              <Database size={18} />
              Provider Hub
            </Button>
            <Button
              variant={activeView === 'revenue' ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3 px-3 h-10 font-medium transition-all duration-200", 
                activeView === 'revenue' ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setActiveView('revenue')}
            >
              <BarChart3 size={18} />
              Settlements
            </Button>
          </div>

          <div className="py-6">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Demand Side</p>
            <Button
              variant={activeView === 'marketplace' ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3 px-3 h-10 font-medium transition-all duration-200", 
                activeView === 'marketplace' ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm" : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setActiveView('marketplace')}
            >
              <ShoppingBag size={18} />
              Data Market
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Jane Doe</p>
              <p className="text-xs text-slate-500 truncate">Pro Creator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search protocol nodes..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="hidden xl:flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Online</span>
               </div>
               <Separator orientation="vertical" className="h-4 bg-slate-200" />
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Block Height:</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">17,492,023</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative group">
              <Bell size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </Button>
            <Separator orientation="vertical" className="h-6 bg-slate-100" />
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] px-6 h-11 rounded-xl shadow-xl shadow-slate-200">
              <Upload size={16} className="mr-2" />
              Ingest Data
            </Button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
