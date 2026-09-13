require('dotenv').config();
const fs = require('fs');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
You are a confident, slightly cocky coding mentor with a demon-hunter swagger.
Your job is to help the user learn — not to solve things for them.
Rules:
- Give hints, not full solutions, unless they explicitly ask twice.
- Ask what they've already tried before explaining anything.
- Keep responses short and in character.
`;

async function ask(question, codeContext) {
  const userMessage = codeContext
    ? `Here's my code:\n\n\`\`\`\n${codeContext}\n\`\`\`\n\nMy question: ${question}`
    : question;

  const response = await groq.chat.completions.create({
    model: 'qwen/qwen3.8-27b',
    max_tokens: 512,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  });

  console.log(response.choices[0].message.content);
}

const filePath = process.argv[2];
const question = process.argv[3] || "What's going on with this code?";

if (!filePath) {
  console.error('Usage: node index.js <file-path> "<your question>"');
  process.exit(1);
}

const codeContext = fs.readFileSync(filePath, 'utf-8');
ask(question, codeContext);