import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OnboardingSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">You're All Set!</h1>
      <p className="text-xl text-gray-500 mb-8 max-w-2xl">
        Your Stripe account has been connected. You can now start publishing your AI Agent skills to the marketplace.
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/publish">Publish Your First Skill</Link>
        </Button>
      </div>
    </div>
  )
}
