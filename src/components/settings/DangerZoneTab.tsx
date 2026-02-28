'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClerk } from '@clerk/nextjs'

export function DangerZoneTab() {
  const { t } = useI18n()
  const { signOut } = useClerk()
  const [showModal, setShowModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== 'DELETE' && confirmText !== 'LÖSCHEN') return
    
    setDeleting(true)
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' })
      if (res.ok) {
        await signOut()
        window.location.href = '/'
      }
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-semibold text-white tracking-tight">{t('dangerZone')}</h2>

      <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-3xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0 border border-red-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-1">{t('deleteAccount')}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">{t('deleteWarning')}</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full font-medium h-10 px-6"
        >
          {t('deleteAccount')}
        </Button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white tracking-tight">{t('deleteAccount')}?</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-zinc-900 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>
              
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed font-medium">
                {t('deleteWarning')} <strong>This action is irreversible.</strong>
              </p>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                  {t('confirmDelete')}
                </label>
                <Input 
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value.toUpperCase())}
                  placeholder={t('deleteAccount').toUpperCase()}
                  className="bg-zinc-900 border-zinc-800 h-12 rounded-xl focus-visible:ring-red-500 text-center font-bold tracking-widest"
                />
              </div>

              <div className="mt-10 flex gap-3">
                <Button 
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1 rounded-full border-zinc-800"
                >
                  {t('cancel')}
                </Button>
                <Button 
                  onClick={handleDelete}
                  disabled={deleting || (confirmText !== 'DELETE' && confirmText !== 'LÖSCHEN')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-lg shadow-red-600/20"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('deleteButton')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
