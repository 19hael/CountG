const OpenAI = require('openai');

try {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
  console.log("Success");
} catch (e) {
  console.error("Error:", e.message);
}
