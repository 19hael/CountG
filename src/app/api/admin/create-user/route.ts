import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const adminSecret = process.env.ADMIN_API_KEY;
    const provided = req.headers.get('x-admin-secret');

    if (!adminSecret) {
      return new NextResponse(JSON.stringify({ error: 'Server misconfiguration: ADMIN_API_KEY not set' }), { status: 500 });
    }

    if (!provided || provided !== adminSecret) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const { email, password, user_metadata } = body;

    if (!email || !password) {
      return new NextResponse(JSON.stringify({ error: 'email and password are required' }), { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRole) {
      return new NextResponse(JSON.stringify({ error: 'Server misconfiguration: Supabase env missing' }), { status: 500 });
    }

    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceRole}`,
      },
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: user_metadata || {} }),
    });

    const data = await createRes.json();

    if (!createRes.ok) {
      return new NextResponse(JSON.stringify({ error: 'Supabase error', details: data }), { status: createRes.status });
    }

    return NextResponse.json({ ok: true, user: data });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
