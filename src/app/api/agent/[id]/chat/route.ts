import { streamText, tool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { messages } = await request.json()

    // 1. Fetch agent and attached skills using admin client
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('*, agent_skills(*, skills(*))')
      .eq('id', agentId)
      .eq('user_id', userId) // Security: ensure user owns the agent
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // 2. Prepare tools from skills
    const agentTools: Record<string, any> = {}

    for (const as of agent.agent_skills || []) {
      const skill = as.skills
      const config = skill.config as any
      const permissions = as.permissions_map || {}

      if (config && config.operations) {
        for (const op of config.operations) {
          const opName = `${skill.slug}__${op.name}`
          const perm = permissions[op.name] || 'ask'

          if (perm === 'deny') continue

          agentTools[opName] = tool({
            description: `[Skill: ${skill.name}] ${op.description}`,
            parameters: z.object({
              args: z.record(z.any()).optional()
            }).passthrough(),
            execute: async (args) => {
              const startTime = Date.now()
              console.log(`Executing tool: ${opName} with args:`, args)
              
              let result: any
              let status: 'success' | 'error' = 'success'
              let errorMessage: string | null = null

              try {
                  // Real execution logic via MCP Bridge (internal fetch)
                  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'
                  const executeRes = await fetch(`${baseUrl}/api/mcp/${skill.slug}/execute`, {
                      method: 'POST',
                      headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer test-install-token' 
                      },
                      body: JSON.stringify({
                          toolName: op.name,
                          arguments: args
                      })
                  })

                  if (!executeRes.ok) {
                      const errData = await executeRes.json()
                      throw new Error(errData.error || 'Execution failed')
                  }

                  const data = await executeRes.json()
                  result = data.content?.[0]?.text || data
              } catch (e: any) {
                  console.error(`Tool execution error [${opName}]:`, e)
                  result = { error: e.message }
                  status = 'error'
                  errorMessage = e.message
              }

              const executionTime = Date.now() - startTime

              // AUDIT LOG: skill_executions using admin client
              await supabaseAdmin.from('skill_executions').insert({
                user_id: userId,
                agent_id: agentId,
                skill_id: skill.id,
                operation_name: op.name,
                input_args: args,
                output_result: result,
                execution_time_ms: executionTime,
                status,
                error_message: errorMessage
              }).catch(err => console.error("Failed to log execution:", err))

              return result
            }
          })
        }
      }
    }

    // 3. Choose model
    const model = openrouter(agent.model_id)

    // 4. Stream response
    const result = streamText({
      model,
      messages,
      tools: agentTools,
      system: `You are an AI assistant named ${agent.name}. 
Description: ${agent.description || 'No description'}.
You have access to specific marketplace skills. 
When using a tool, explain what you are doing.`,
      maxSteps: 5,
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error('[API] Unhandled error in chat route:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
