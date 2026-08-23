import { supabase } from '../lib/supabase'

export async function ensureAnonymousSession() {
  const { data: existing } = await supabase.auth.getSession()
  if (existing.session) return existing.session

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  if (!data.session) throw new Error('Supabase 未返回匿名会话')
  return data.session
}
