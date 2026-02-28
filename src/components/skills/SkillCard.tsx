'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function SkillCard({ skill }: { skill: any }) {
  const price = (skill.price_cents / 100).toFixed(2)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{skill.name}</CardTitle>
          <Badge variant="secondary">{skill.categories?.name || 'Uncategorized'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {skill.description || 'No description provided.'}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {(skill.tags || []).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <span className="text-lg font-bold">${price}</span>
        <Button size="sm" asChild>
          <Link href={`/skills/${skill.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
