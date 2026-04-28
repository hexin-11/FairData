import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Sidebar from '@/components/Sidebar'
import SettlementsClient from './SettlementsClient'

async function getMyTransactions(userId: string) {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select('*, dataset:dataset_id(title)')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const transactions = user ? await getMyTransactions(user.id) : []

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        <SettlementsClient transactions={transactions} />
      </main>
    </div>
  )
}
