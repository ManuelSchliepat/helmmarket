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

  // Ensure initialSkills is never null
  initialSkills = initialSkills || placeholderSkills;

  return <MarketplaceClient initialSkills={initialSkills} />
}
