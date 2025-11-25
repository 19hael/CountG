import OpenAI from 'openai';

// Initialize OpenAI client
// Note: In a production environment, this key should be in .env.local
// For this task, we are using the key provided by the user directly as requested.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo/client-side if needed, but we will use server-side route
});

export default openai;
