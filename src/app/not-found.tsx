import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TerminalSquare } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center mb-8 relative">
        <TerminalSquare className="w-10 h-10 text-gray-600" />
        <div className="absolute -bottom-2 -right-2 text-3xl">🤔</div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">404 - Skill Not Found</h2>
      <p className="text-lg text-gray-400 mb-8 max-w-md">
        This skill doesn't exist yet. Want to build it?
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-base">
          <Link href="/publish">Build & Publish</Link>
        </Button>
        <Button asChild variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800 h-12 px-8 text-base">
          <Link href="/skills">Return to Marketplace</Link>
        </Button>
      </div>
    </div>
  )
}
