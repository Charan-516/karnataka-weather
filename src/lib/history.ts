export interface HistoryEntry {
  id?: string
  user_id?: string
  district: string
  mode: 'manual' | 'iot' | 'intelligence'
  condition: string
  confidence: number
  input_params?: Record<string, number>
  created_at?: string
}

async function getClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) return null
    const { createBrowserClient } = await import('@supabase/ssr')
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch { return null }
}

export async function savePrediction(entry: HistoryEntry): Promise<boolean> {
  try {
    const supabase = await getClient()
    if (!supabase) return false
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    const { error } = await supabase.from('prediction_history').insert({
      user_id: user.id,
      district: entry.district,
      mode: entry.mode,
      condition: entry.condition,
      confidence: entry.confidence,
      input_params: entry.input_params || {},
    })
    if (error) console.error('[History] Save error:', error.message)
    return !error
  } catch (err) {
    console.error('[History] Save failed:', err)
    return false
  }
}

export async function fetchHistory(limit = 50): Promise<HistoryEntry[]> {
  try {
    const supabase = await getClient()
    if (!supabase) return []
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const { data, error } = await supabase
      .from('prediction_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) {
      console.error('[History] Fetch error:', error.message)
      return []
    }
    return data || []
  } catch {
    return []
  }
}

export async function deleteHistoryEntry(id: string): Promise<boolean> {
  try {
    const supabase = await getClient()
    if (!supabase) return false
    const { error } = await supabase
      .from('prediction_history')
      .delete()
      .eq('id', id)
    return !error
  } catch {
    return false
  }
}
