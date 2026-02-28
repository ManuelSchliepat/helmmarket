import { createClient } from '@/utils/supabase/server'

export async function getSkills(filters?: { categoryId?: string; search?: string }) {
  const supabase = await createClient()
  let query = supabase.from('skills').select('*, categories(*), developers(*)').eq('status', 'published')

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getSkillBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*, categories(*), developers(*)')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function createSkill(skillData: any) {
  const supabase = await createClient(true)
  const { data, error } = await supabase.from('skills').insert(skillData).select().single()
  if (error) throw error
  return data
}

export async function getDeveloper(id: string) {
  const supabase = await createClient(true)
  const { data, error } = await supabase.from('developers').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function addToWaitlist(email: string) {
  const supabase = await createClient(true)
  const { data, error } = await supabase.from('waitlist').insert({ email }).select().single()
  if (error && error.code !== '23505') throw error // Ignore duplicate key error (already on list)
  return data
}
