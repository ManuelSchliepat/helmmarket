import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { subject, message } = await req.json();
    if (!subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Check if user is a developer
    const { data: dev } = await supabase.from('developers').select('id').eq('id', userId).single();
    if (!dev) return NextResponse.json({ error: 'Not a developer' }, { status: 403 });

    const { error } = await supabase.from('developer_messages').insert({
      developer_id: userId,
      subject,
      message,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Support message error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
