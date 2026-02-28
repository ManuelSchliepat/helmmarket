import { getSkillBySlug } from '@/services/supabase/skills'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SkillDetailPage({ params }: { params: { slug: string } }) {
  const skill = await getSkillBySlug(params.slug)

  if (!skill) {
    notFound()
  }

  const price = (skill.price_cents / 100).toFixed(2)

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link href="/skills" className="text-sm text-gray-500 hover:underline">Marketplace</Link>
              <span className="text-sm text-gray-500">/</span>
              <span className="text-sm text-gray-900 font-medium">{skill.name}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{skill.name}</h1>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary">{skill.categories?.name}</Badge>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Published by {skill.developers?.users?.full_name || 'Verified Developer'}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {skill.description || 'No description provided.'}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Permissions Declaration</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {(skill.permissions || []).length > 0 ? (
                    (skill.permissions || []).map((perm: string) => (
                      <li key={perm} className="flex items-start gap-3">
                        <div className="mt-1 p-1 bg-blue-100 rounded-full text-blue-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{perm}</p>
                          <p className="text-xs text-gray-500">This skill requires access to {perm.replace('-', ' ')}.</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">No special permissions required.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">${price}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full py-6 text-lg" size="lg">Buy Now</Button>
              <p className="text-xs text-center text-gray-500">Secure payments via Stripe</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Registry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-500 font-mono break-all p-2 bg-gray-50 rounded border">
                helm install {skill.registry_endpoint || `@helm-market/${skill.slug}`}
              </p>
              <p className="text-[10px] text-gray-400 italic">Compatible with Helm Framework v1.0+</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
