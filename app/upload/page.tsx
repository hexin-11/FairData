import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Dataset } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import ProviderHubClient from './ProviderHubClient'

async function getMyDatasets(userId: string): Promise<Dataset[]> {
  const { data } = await supabaseAdmin
    .from('datasets')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })
  return (data as Dataset[]) ?? []
}

async function getMyTransactions(userId: string) {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select('*, dataset:dataset_id(title, creator_id)')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10)
  return data ?? []
}

export default async function ProviderHubPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const datasets = user ? await getMyDatasets(user.id) : []
  const transactions = user ? await getMyTransactions(user.id) : []

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        <ProviderHubClient datasets={datasets} transactions={transactions} />
      </main>
    </div>
  )
}
