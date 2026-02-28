'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function AccountTab({ user }: { user: any }) {
  const { t, language, setLanguage } = useI18n()
  const [name, setName] = useState(user.full_name || '')
  const [saving, setSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const handleSave = async (field: string, value: any) => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })
      if (response.ok) {
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 2000)
        if (field === 'preferred_language') {
          setLanguage(value)
        }
      }
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-semibold text-white tracking-tight">{t('account')}</h2>
        {showSaved && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-emerald-500 text-sm font-medium flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> {t('saved')}
          </motion.span>
        )}
      </div>

      <div className="grid gap-10">
        {/* Display Name */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('displayName')}</label>
          <div className="flex gap-3">
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="bg-zinc-900 border-zinc-800 h-12 rounded-xl focus-visible:ring-indigo-500"
              placeholder={t('placeholderName')}
            />
            <Button 
              onClick={() => handleSave('full_name', name)}
              disabled={saving || name === user.full_name}
              className="bg-indigo-600 hover:bg-indigo-500 h-12 px-6 rounded-xl font-medium shrink-0"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('save')}
            </Button>
          </div>
        </div>

        {/* Email - Read Only */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('email')}</label>
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-500 text-sm font-medium">
            {user.email}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('language')}</label>
          <div className="flex gap-2">
            {(['en', 'de'] as const).map(langId => (
              <button
                key={langId}
                onClick={() => handleSave('preferred_language', langId)}
                className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
                  language === langId 
                    ? 'bg-white border-white text-black' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                }`}
              >
                {langId === 'en' ? t('english') : t('german')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
