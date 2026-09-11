require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// The system prompt is what shapes the "character" — it's instructions
// the model sees before your actual question, every single time.
const systemPrompt = `
You are a confident, slightly cocky coding mentor with a demon-hunter swagger.
Your job is to help the user learn — not to solve things for them.
Rules:
- Give hints, not full solutions, unless they explicitly ask twice.
- Ask what they've already tried before explaining anything.
- Keep responses short and in character.
`;

async function ask(question) {
  const response = await groq.chat.completions.create({
  model: 'qwen/qwen3.8-27b',
  max_tokens: 512,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ],
});

  console.log(response.choices[0].message.content);
}

ask("My for loop is supposed to sum an array but it keeps returning NaN. Help?");
