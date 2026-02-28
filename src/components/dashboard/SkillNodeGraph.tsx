'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// ForceGraph2D needs to be dynamically imported because it uses browser APIs
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
})

interface SkillNode {
  id: string
  name: string
  slug: string
  version: string
  category: string
  installDate: string
}

interface SkillNodeGraphProps {
  skills: SkillNode[]
}

export default function SkillNodeGraph({ skills }: SkillNodeGraphProps) {
  const router = useRouter()

  const graphData = useMemo(() => {
    const nodes = [
      {
        id: 'agent-center',
        name: 'Your Agent',
        color: '#6366f1',
        val: 20,
        isCenter: true,
      },
      ...skills.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        version: s.version,
        installDate: s.installDate,
        color:
          s.category === 'compliance'
            ? '#22c55e'
            : s.category === 'security'
            ? '#f59e0b'
            : s.category === 'analytics' || s.category === 'logging'
            ? '#818cf8'
            : '#a1a1aa',
        val: 10,
        isCenter: false,
      })),
    ]

    const links = skills.map((s) => ({
      source: 'agent-center',
      target: s.id,
      dashed: false,
    }))

    return { nodes, links }
  }, [skills])

  return (
    <div className="w-full h-full relative">
      <ForceGraph2D
        graphData={graphData}
        backgroundColor="#09090b"
        nodeLabel={(node: any) => 
          `<div class="bg-zinc-900 border border-zinc-800 p-2 rounded shadow-xl text-[10px]">
            <div class="font-bold text-white">${node.name}</div>
            ${!node.isCenter ? `<div class="text-zinc-400">v${node.version}</div>
            <div class="text-zinc-500">${new Date(node.installDate).toLocaleDateString()}</div>` : ''}
          </div>`
        }
        nodeRelSize={6}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name
          const fontSize = 12 / globalScale
          ctx.font = `${fontSize}px Inter, sans-serif`
          const textWidth = ctx.measureText(label).width
          const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2)

          // Draw glow for center node
          if (node.isCenter) {
            ctx.beginPath()
            ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI, false)
            ctx.shadowBlur = 15
            ctx.shadowColor = '#6366f1'
            ctx.fillStyle = '#6366f1'
            ctx.fill()
            ctx.shadowBlur = 0 // reset
          } else {
            ctx.beginPath()
            ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false)
            ctx.fillStyle = node.color
            ctx.fill()
          }

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = '#ffffff'
          ctx.fillText(label, node.x, node.y + (node.isCenter ? 18 : 14))
        }}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        linkDashArrowLength={node => (node as any).dashed ? 3 : 0}
        onNodeClick={(node: any) => {
          if (!node.isCenter && node.slug) {
            router.push(`/skills/${node.slug}`)
          }
        }}
        width={undefined} // Auto-resize
        height={undefined}
      />
    </div>
  )
}
