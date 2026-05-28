import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Ensure we lookup the absolute path for .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // OpenRouter Chat Proxy
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, systemInstruction } = req.body;
      
      const openRouterMessages = [];
      if (systemInstruction) {
        openRouterMessages.push({ role: 'system', content: systemInstruction });
      }
      openRouterMessages.push(...messages.map((m: any) => ({
        role: m.role,
        content: m.content
      })));

      // We use the provided key or look it up in the env for security
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY environment variable is missing.');
      }

      console.log('API Key Status: loaded (starts with:', apiKey.substring(0, 10) + '...)');

      const candidateModels = [
        'google/gemini-2.5-flash',
        'google/gemini-2.0-flash-001',
        'google/gemini-2.0-flash',
        'google/gemini-1.5-flash',
        'meta-llama/llama-3-8b-instruct:free'
      ];

      let lastError: any = null;
      let responseData: any = null;

      for (const model of candidateModels) {
        try {
          console.log(`Attempting completion with model: ${model}`);
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://habitflow.app',
              'X-Title': 'HabitFlow',
            },
            body: JSON.stringify({
              model,
              messages: openRouterMessages,
              max_tokens: 1000,
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Model ${model} failed with status ${response.status}:`, errorText);
            lastError = new Error(`Model ${model} failed - ${response.status}: ${errorText}`);
            continue;
          }

          responseData = await response.json();
          if (responseData && responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
            console.log(`Successfully got response using model: ${model}`);
            break; // successfully received a response!
          } else {
            console.warn(`Empty or unexpected format from model ${model}:`, responseData);
            lastError = new Error(`Unexpected structure from model ${model}`);
          }
        } catch (err: any) {
          console.warn(`Error trying model ${model}:`, err);
          lastError = err;
        }
      }

      if (!responseData) {
        throw lastError || new Error('All models failed to deliver a response.');
      }

      res.json({ text: responseData.choices[0].message.content });
    } catch (error: any) {
      console.error('Chat API Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
