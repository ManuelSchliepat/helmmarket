'use client'

import { useState, useEffect } from 'react'
import { I18nProvider, useI18n } from '@/lib/i18n-context'
import { AccountTab } from './AccountTab'
import { InstallsTab } from './InstallsTab'
import { BillingTab } from './BillingTab'
import { PublisherTab } from './PublisherTab'
import { DangerZoneTab } from './DangerZoneTab'
import { motion, AnimatePresence } from 'framer-motion'
import { User as LucideUser, Download, CreditCard, ShieldCheck, AlertTriangle, Menu, X } from 'lucide-react'

interface SettingsClientProps {
  user: any; // Supabase user record with extra columns
  initialInstalls: any[];
}

function SettingsContent({ user, initialInstalls }: SettingsClientProps) {
  const { t, language } = useI18n()
  const [activeTab, setActiveTab] = useState('account')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs = [
    { id: 'account', label: t('account'), icon: LucideUser },
    { id: 'installs', label: t('installs'), icon: Download },
    { id: 'billing', label: t('billing'), icon: CreditCard },
    ...(user.is_publisher ? [{ id: 'publisher', label: t('publisher'), icon: ShieldCheck }] : []),
    { id: 'danger', label: t('dangerZone'), icon: AlertTriangle, color: 'text-red-500' }
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-12 py-12">
      {/* Desktop Navigation */}
      <aside className="hidden lg:block w-64 shrink-0">
        <nav className="flex flex-col gap-1 sticky top-32">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
              } ${tab.color || ''}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Navigation (Accordion-style) */}
      <div className="lg:hidden mb-8">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white font-medium"
        >
          <div className="flex items-center gap-3">
            {tabs.find(t => t.id === activeTab)?.label}
          </div>
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-zinc-900/50 border-x border-b border-zinc-800 rounded-b-2xl mt-[-1rem] pt-4"
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium border-t border-zinc-800/50 ${
                    activeTab === tab.id ? 'text-white' : 'text-zinc-500'
                  } ${tab.color || ''}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <main className="flex-1">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'account' && <AccountTab user={user} />}
              {activeTab === 'installs' && <InstallsTab initialInstalls={initialInstalls} />}
              {activeTab === 'billing' && <BillingTab />}
              {activeTab === 'publisher' && <PublisherTab user={user} />}
              {activeTab === 'danger' && <DangerZoneTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export function SettingsClient({ user, initialInstalls }: SettingsClientProps) {
  return (
    <I18nProvider initialLanguage={user.preferred_language || 'en'}>
      <SettingsContent user={user} initialInstalls={initialInstalls} />
    </I18nProvider>
  )
}
