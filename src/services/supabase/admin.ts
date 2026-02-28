import { createClient } from '@/utils/supabase/server'

export async function getAdminStats() {
  const supabase = await createClient(true) // Using service role for admin fetches

  // Total skills (live + in_review)
  const { count: totalSkills } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .in('status', ['published', 'pending_review'])

  // Pending reviews
  const { count: pendingReviews } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review')

  // Total publishers
  const { count: totalPublishers } = await supabase
    .from('developers')
    .select('*', { count: 'exact', head: true })

  // Total Revenue (sum of all installs × skill price)
  const { data: installs } = await supabase
    .from('installs')
    .select('skill_id, skills(price_cents)')

  let totalRevenue = 0;
  if (installs) {
    totalRevenue = installs.reduce((sum, install) => {
      // @ts-ignore
      const price = install.skills?.price_cents || 0;
      return sum + price;
    }, 0);
  }

  return {
    totalSkills: totalSkills || 0,
    totalPublishers: totalPublishers || 0,
    totalRevenue: totalRevenue / 100, // convert to dollars/euros
    pendingReviews: pendingReviews || 0
  }
}

export async function getSkillsForReview() {
  const supabase = await createClient(true)
  const { data, error } = await supabase
    .from('skills')
    .select('*, developers(users(full_name, email)), categories(name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateSkillStatus(skillId: string, status: string, note?: string) {
  const supabase = await createClient(true)
  const updateData: any = { status }
  if (note) updateData.review_note = note
  
  const { error } = await supabase
    .from('skills')
    .update(updateData)
    .eq('id', skillId)

  if (error) throw error
  return true
}

export async function getPublishers() {
  const supabase = await createClient(true)
  const { data, error } = await supabase
    .from('developers')
    .select('*, users(full_name, email), skills(id, price_cents)')
    
  if (error) throw error
  return data
}

export async function updatePublisherVerification(publisherId: string, is_verified: boolean) {
  const supabase = await createClient(true)
  const { error } = await supabase
    .from('developers')
    .update({ is_verified })
    .eq('id', publisherId)

  if (error) throw error
  return true
}
