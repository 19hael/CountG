import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  try {
    const { event, session, access_token, refresh_token } = req.body;

    if (event === 'SIGNED_OUT') {
      await supabase.auth.signOut();
      return res.status(200).json({ message: 'Signed out' });
    }

    if (access_token && refresh_token) {
      await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      return res.status(200).json({ message: 'Session updated' });
    }

    // Fallback if just checking or other events
    return res.status(200).json({ message: 'Nothing to do' });
  } catch (error: any) {
    console.error('Error setting auth cookie:', error);
    return res.status(500).json({ error: error.message });
  }
}
