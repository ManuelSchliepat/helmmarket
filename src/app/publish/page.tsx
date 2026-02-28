import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SkillSubmissionForm } from '@/components/publish/SkillSubmissionForm'
import { getDeveloper } from '@/services/supabase/skills'

export default async function PublishPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/onboarding')
  }

  const developer = await getDeveloper(userId)
  
  if (!developer?.stripe_account_id) {
    redirect('/onboarding')
  }

  return (
    <div className="container mx-auto pt-32 pb-16 px-4 md:px-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Publish Your Skill</h1>
        <p className="text-xl text-gray-500">
          Share your AI Agent capabilities with the Helm community. 
          Provide accurate metadata and permission requirements for review.
        </p>
      </header>

      <SkillSubmissionForm />
    </div>
  )
}
