import type { NextApiRequest, NextApiResponse } from 'next';
import { setAuthCookie } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // setAuthCookie will read the body sent from the client (the auth response)
    await setAuthCookie(req, res);
    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
}
