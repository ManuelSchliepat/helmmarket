import { NextResponse } from 'next/server';
import { runHelmManagerAgent } from '@/agents/helm-manager';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Optional: Add a simple secret check for manual triggers or Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await runHelmManagerAgent();
    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    console.error('Agent execution error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
