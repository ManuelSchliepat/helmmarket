'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SkillSubmissionForm() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price_cents: 0,
    registry_endpoint: '',
    permissions: [] as string[],
    tags: [] as string[]
  })
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [currentTag, setCurrentTag] = useState('')

  const availablePermissions = ['internet-access', 'read-files', 'write-files', 'execute-scripts', 'user-identity']

  const handleTogglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm) 
        ? prev.permissions.filter(p => p !== perm) 
        : [...prev.permissions, perm]
    }))
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }))
      }
      setCurrentTag('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-20 bg-green-50 rounded-lg border border-green-200">
        <h2 className="text-2xl font-bold text-green-700">Skill Submitted!</h2>
        <p className="mt-2 text-green-600">Your skill is now pending review. We'll notify you once it's live.</p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus('idle')}>Submit Another</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Basic Information</h2>
        <Input 
          placeholder="Skill Name" 
          value={formData.name} 
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') }))} 
          required 
        />
        <Input 
          placeholder="Registry Slug (e.g. data-analyzer)" 
          value={formData.slug} 
          onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))} 
          required 
        />
        <textarea 
          placeholder="Description" 
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Permissions & Security</h2>
        <p className="text-sm text-gray-500 mb-4">Select the permissions your skill requires from the host environment.</p>
        <div className="flex flex-wrap gap-2">
          {availablePermissions.map(perm => (
            <Badge 
              key={perm} 
              variant={formData.permissions.includes(perm) ? 'default' : 'outline'}
              className="cursor-pointer py-1.5 px-3"
              onClick={() => handleTogglePermission(perm)}
            >
              {perm}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Metadata & Registry</h2>
        <Input 
          type="number" 
          placeholder="Price (Cents) - e.g. 500 for $5.00" 
          value={formData.price_cents} 
          onChange={e => setFormData(prev => ({ ...prev, price_cents: parseInt(e.target.value) }))} 
          required 
        />
        <Input 
          placeholder="Package Registry Name (e.g. @helm-market/analyzer)" 
          value={formData.registry_endpoint} 
          onChange={e => setFormData(prev => ({ ...prev, registry_endpoint: e.target.value }))} 
          required 
        />
        <Input 
          placeholder="Add tags (press Enter)" 
          value={currentTag} 
          onChange={e => setCurrentTag(e.target.value)}
          onKeyDown={handleAddTag}
        />
        <div className="flex flex-wrap gap-1">
          {formData.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="px-2">
              {tag} 
              <span className="ml-2 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}>×</span>
            </Badge>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting...' : 'Submit Skill for Review'}
      </Button>
    </form>
  )
}
