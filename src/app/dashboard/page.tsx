import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getDeveloper } from '@/services/supabase/skills'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/onboarding')
  }

  const developer = await getDeveloper(userId)
  
  if (!developer?.stripe_account_id) {
    redirect('/onboarding')
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Developer Dashboard</h1>
          <p className="text-gray-500">Manage your AI Agent Skills and track earnings.</p>
        </div>
        <Button asChild>
          <Link href="/publish">Publish New Skill</Link>
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Skills</h2>
        <Card className="flex items-center justify-center p-12 text-center">
          <div className="space-y-4">
            <p className="text-gray-500">You haven't published any skills yet.</p>
            <Button variant="outline" asChild>
              <Link href="/publish">Publish Your First Skill</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
