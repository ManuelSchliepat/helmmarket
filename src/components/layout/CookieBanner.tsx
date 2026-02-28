'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X } from 'lucide-react'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('helm-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  const accept = () => {
    localStorage.setItem('helm-cookie-consent', 'true')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-4 left-4 md:left-auto md:w-[400px] bg-[#0c0c0e] border border-gray-800 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] backdrop-blur-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-white uppercase text-[10px] tracking-widest">Privacy Preference</h3>
                <button onClick={() => setShow(false)} className="text-gray-600 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
                We use strictly necessary cookies to ensure the platform functions securely. By continuing, you agree to our standard privacy protocols.
              </p>
              <div className="flex gap-3">
                <button onClick={accept} className="flex-1 h-11 bg-white text-black hover:bg-gray-200 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                  Accept All
                </button>
                <button onClick={accept} className="flex-1 h-11 bg-gray-900 text-gray-400 hover:text-white border border-gray-800 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
