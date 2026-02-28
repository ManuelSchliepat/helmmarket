import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/utils/supabase/server';
import { sendDeveloperRevenue } from '@/lib/email'; // Reusing for general dev emails or create new ones
import { Resend } from 'resend';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function runHelmManagerAgent() {
  const supabase = await createClient(true); // Service role

  const systemPrompt = `You are the Helm Market operations manager. 
Every morning you:
1. Review pending skills — approve clear ones, reject ones missing documentation or with security issues.
2. Check 7-day analytics — flag anomalies.
3. Answer developer questions with helpful responses.
4. Flag any skill with error_rate above 10%.
5. Send a daily summary email to manuelschliepat@gmail.com.

Be concise. Approve fast. Reject with specific reasons.
When unsure about a skill: flag for human review, never auto-approve.
Use the provided tools to interact with the marketplace.`;

  const tools: Anthropic.Tool[] = [
    {
      name: "get_pending_skills",
      description: "Get all skills waiting for review",
      input_schema: {
        type: "object",
        properties: {}
      }
    },
    {
      name: "approve_skill",
      description: "Approve a skill and set quality_status to verified",
      input_schema: {
        type: "object",
        properties: {
          skill_id: { type: "string" },
          reason: { type: "string" }
        },
        required: ["skill_id"]
      }
    },
    {
      name: "reject_skill",
      description: "Reject skill with reason",
      input_schema: {
        type: "object",
        properties: {
          skill_id: { type: "string" },
          reason: { type: "string" }
        },
        required: ["skill_id", "reason"]
      }
    },
    {
      name: "get_analytics_summary",
      description: "Get marketplace analytics for last 7 days",
      input_schema: {
        type: "object",
        properties: {}
      }
    },
    {
      name: "get_developer_questions",
      description: "Get unanswered support tickets from developers",
      input_schema: {
        type: "object",
        properties: {}
      }
    },
    {
      name: "send_developer_reply",
      description: "Send a reply to a developer question",
      input_schema: {
        type: "object",
        properties: {
          message_id: { type: "string" },
          reply: { type: "string" }
        },
        required: ["message_id", "reply"]
      }
    },
    {
      name: "flag_skill",
      description: "Flag a skill for human review if error_rate > 0.1",
      input_schema: {
        type: "object",
        properties: {
          skill_id: { type: "string" },
          reason: { type: "string" }
        },
        required: ["skill_id", "reason"]
      }
    },
    {
      name: "send_summary_email",
      description: "Send the final daily summary email to the administrator",
      input_schema: {
        type: "object",
        properties: {
          content: { type: "string" }
        },
        required: ["content"]
      }
    }
  ];

  let messages: Anthropic.MessageParam[] = [
    { role: 'user', content: 'Start your morning routine and manage the marketplace.' }
  ];

  let summaryActions: string[] = [];

  // Main agent loop
  for (let i = 0; i < 10; i++) { // Limit to 10 turns
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      tools,
    });

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason !== 'tool_use') break;

    const toolResults: Anthropic.ToolUseBlock[] = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );

    const toolOutputs = await Promise.all(toolResults.map(async (toolUse) => {
      const { name, input, id } = toolUse;
      let result: any;

      try {
        switch (name) {
          case 'get_pending_skills':
            const { data: pending } = await supabase
              .from('skills')
              .select('id, name, description, permissions, compliance_labels')
              .eq('quality_status', 'pending');
            result = pending;
            break;

          case 'approve_skill':
            const { skill_id: approveId } = input as any;
            await supabase
              .from('skills')
              .update({ quality_status: 'verified', verified_at: new Date().toISOString() })
              .eq('id', approveId);
            
            // Log action
            await supabase.from('skill_events').insert({
              skill_id: approveId,
              event_type: 'execute',
              triggered_by: 'helm-manager-agent',
              metadata: { action: 'approve', agent: 'helm-manager' }
            });
            
            summaryActions.push(`Approved skill: ${approveId}`);
            result = { success: true };
            break;

          case 'reject_skill':
            const { skill_id: rejectId, reason } = input as any;
            await supabase
              .from('skills')
              .update({ quality_status: 'flagged', review_note: reason })
              .eq('id', rejectId);
            
            // Log action
            await supabase.from('skill_events').insert({
              skill_id: rejectId,
              event_type: 'execute',
              triggered_by: 'helm-manager-agent',
              metadata: { action: 'reject', reason, agent: 'helm-manager' }
            });

            summaryActions.push(`Rejected skill: ${rejectId} - ${reason}`);
            result = { success: true };
            break;

          case 'get_analytics_summary':
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const { data: events } = await supabase
              .from('skill_events')
              .select('event_type, skill_id')
              .gte('created_at', sevenDaysAgo);
            
            // Basic aggregation
            const stats = {
              total_views: events?.filter(e => e.event_type === 'view').length || 0,
              total_installs: events?.filter(e => e.event_type === 'install').length || 0,
              total_executions: events?.filter(e => e.event_type === 'execute').length || 0,
            };
            result = stats;
            break;

          case 'get_developer_questions':
            const { data: messagesData } = await supabase
              .from('developer_messages')
              .select('*')
              .eq('answered', false);
            result = messagesData;
            break;

          case 'send_developer_reply':
            const { message_id, reply } = input as any;
            const { data: msg } = await supabase
              .from('developer_messages')
              .update({ answered: true, agent_reply: reply, replied_at: new Date().toISOString() })
              .eq('id', message_id)
              .select('developer_id, subject')
              .single();
            
            if (msg) {
              const { data: devUser } = await supabase.from('users').select('email').eq('id', msg.developer_id).single();
              if (devUser?.email) {
                await resend.emails.send({
                  from: 'Helm Market Support <support@helmmarket.com>',
                  to: devUser.email,
                  subject: `Re: ${msg.subject}`,
                  html: `<p>${reply}</p>`
                });
              }
            }
            summaryActions.push(`Replied to ticket: ${message_id}`);
            result = { success: true };
            break;

          case 'flag_skill':
            const { skill_id: flagId, reason: flagReason } = input as any;
            await supabase
              .from('skills')
              .update({ quality_status: 'flagged', review_note: flagReason })
              .eq('id', flagId);
            
            summaryActions.push(`Flagged skill: ${flagId} - ${flagReason}`);
            result = { success: true };
            break;

          case 'send_summary_email':
            const { content } = input as any;
            await resend.emails.send({
              from: 'Helm Manager Agent <agent@helmmarket.com>',
              to: 'manuelschliepat@gmail.com',
              subject: `Daily Helm Market Summary - ${new Date().toLocaleDateString()}`,
              html: `<div style="font-family: sans-serif;">${content.replace(/
/g, '<br>')}</div>`
            });
            result = { success: true };
            break;

          default:
            result = { error: "Unknown tool" };
        }
      } catch (err: any) {
        result = { error: err.message };
      }

      return {
        type: 'tool_result' as const,
        tool_use_id: id,
        content: JSON.stringify(result),
      };
    }));

    messages.push({ role: 'user', content: toolOutputs });
  }

  return summaryActions;
}
