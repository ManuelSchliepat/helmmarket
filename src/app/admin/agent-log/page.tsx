import { createClient } from '@/utils/supabase/server';
import { Card } from '@/components/ui/card';
import { Check, X, Bot, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AgentLogPage() {
  const supabase = await createClient(true);

  const { data: logs } = await supabase
    .from('skill_events')
    .select('*, skills(name)')
    .eq('triggered_by', 'helm-manager-agent')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Bot className="w-8 h-8 text-indigo-500" />
          Agent Audit Log
        </h1>
        <p className="text-zinc-400 mt-2">Review and verify actions taken by the Helm Manager Agent.</p>
      </div>

      <div className="space-y-4">
        {logs?.map((log) => (
          <Card key={log.id} className="p-6 bg-zinc-900 border-zinc-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className={`mt-1 p-2 rounded-full ${log.metadata?.action === 'approve' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {log.metadata?.action === 'approve' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="font-bold text-white uppercase text-xs tracking-widest">
                  {log.metadata?.action || 'Action'} — {log.skills?.name}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {log.metadata?.reason || 'No specific reason provided.'}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-medium text-zinc-600 uppercase">
                  <Clock className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50">
                Confirm
              </Button>
              <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/50">
                Undo
              </Button>
            </div>
          </Card>
        ))}

        {(!logs || logs.length === 0) && (
          <div className="py-24 text-center bg-zinc-900/30 border border-zinc-800 border-dashed rounded-[3rem]">
            <Bot className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-500">No agent actions logged today.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
