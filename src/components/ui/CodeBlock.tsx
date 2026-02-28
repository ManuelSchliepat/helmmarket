'use client'

import { useEffect, useState } from 'react'
import { getHighlighter } from 'shiki'

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    let mounted = true
    async function highlight() {
      try {
        const highlighter = await getHighlighter({
          themes: ['github-dark'],
          langs: ['bash', 'json', 'typescript', 'yaml'],
        })
        if (!mounted) return
        const result = highlighter.codeToHtml(code, { lang, theme: 'github-dark' })
        setHtml(result)
      } catch (e) {
        console.error('Failed to highlight code:', e)
      }
    }
    highlight()
    return () => { mounted = false }
  }, [code, lang])

  if (!html) {
    return (
      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm animate-pulse text-gray-500">
        Loading...
      </pre>
    )
  }

  return (
    <div 
      className="[&>pre]:!bg-gray-900 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:border [&>pre]:border-gray-800"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  )
}
