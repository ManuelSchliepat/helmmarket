import { getSkills } from '@/services/supabase/skills'
export const dynamic = 'force-dynamic'
import MarketplaceClient from './MarketplaceClient'
import { placeholderSkills } from '@/lib/placeholder-data'

export default async function SkillsPage() {
  let initialSkills = [];
  try {
    initialSkills = await getSkills();
  } catch (e) {
    console.warn("Failed to fetch skills from Supabase, using placeholders for marketplace demo.");
    initialSkills = placeholderSkills;
  }

  // Ensure initialSkills is never null and map Supabase data to expected format
  const mappedSkills = (initialSkills || []).map((s: any) => ({
    ...s,
    // Map joined categories to category field
    category: s.category || s.categories?.slug || 'general',
    // Ensure arrays exist
    tags: s.tags || [],
    compliance_labels: s.compliance_labels || [],
    // Default values for fields that might be missing in DB but expected in UI
    provider_switchable: s.provider_switchable ?? true,
    price_cents: s.price_cents ?? 0,
    updated_at: s.updated_at || new Date().toISOString()
  }));

  const finalSkills = mappedSkills.length > 0 ? mappedSkills : placeholderSkills;

  return <MarketplaceClient initialSkills={finalSkills} />
}
