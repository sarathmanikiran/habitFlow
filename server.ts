import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import compression from 'compression';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { BLOG_POSTS } from './src/data/blogData';

// Ensure we lookup the absolute path for .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Compress all responses (HTML, CSS, JS, JSON) to ensure sub-1 second loading speed
  app.use(compression({
    level: 6, // optimal balance between compression ratio and CPU load
    threshold: 1024, // only compress files bigger than 1KB
  }));

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Google GenAI & OpenRouter Chat Router
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, systemInstruction } = req.body;

      // 1. Check & Prefer standard GEMINI_API_KEY with the official @google/genai SDK
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (geminiApiKey) {
        console.log('Utilizing Gemini API with the @google/genai SDK');
        const ai = new GoogleGenAI({
          apiKey: geminiApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        // Convert messages to Gemini's expected Content format
        const contents = messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config: {
            systemInstruction: systemInstruction || undefined,
          }
        });

        res.json({ text: response.text });
        return;
      }

      // 2. Fall back to OpenRouter if GEMINI_API_KEY is not defined
      console.log('Gemini API Key missing, falling back to OpenRouter');
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error('Both GEMINI_API_KEY and OPENROUTER_API_KEY environment variables are missing.');
      }

      const openRouterMessages = [];
      if (systemInstruction) {
        openRouterMessages.push({ role: 'system', content: systemInstruction });
      }
      openRouterMessages.push(...messages.map((m: any) => ({
        role: m.role,
        content: m.content
      })));

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
    // Serve static files in production with optimized caching headers
    const distPath = path.join(process.cwd(), 'dist');
    
    // Cache compiled assets and bundles (e.g., JS/CSS) for 1 year with immutability for sub-1s loading speed
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
      fallthrough: false
    }));

    // Serve other generic public static files (images, icons, robots, sitemaps etc)
    app.use(express.static(distPath, {
      maxAge: '1d', // cache public static assets for a safe 1 day
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          // Prevent browser caching on HTML files so updates are immediately visible to clients
          res.setHeader('Cache-Control', 'public, no-cache, no-store, must-revalidate');
        }
      }
    }));

    // SPA catch-all serves index.html (with server-side dynamic Open Graph updates for social bots & crawlers)
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const urlPath = req.path;
      const slug = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
      const post = BLOG_POSTS.find(p => p.slug === slug);
      
      const indexPath = path.join(distPath, 'index.html');
      
      if (post) {
        try {
          if (fs.existsSync(indexPath)) {
            let html = fs.readFileSync(indexPath, 'utf8');
            const safeTitle = `${post.title} | HabitFlow`;
            const safeDesc = post.excerpt.replace(/"/g, '&quot;');
            const safeUrl = `https://habitflow.app/${post.slug}`;
            
            // Dynamic replace tags to support indexing & crawlers perfectly
            html = html
              .replace(/<title>[^<]+<\/title>/g, `<title>${safeTitle}</title>`)
              .replace(/<meta name="description" content="[^"]+" \/>/g, `<meta name="description" content="${safeDesc}" />`)
              .replace(/<meta property="og:title" content="[^"]+" \/>/g, `<meta property="og:title" content="${safeTitle}" />`)
              .replace(/<meta property="og:description" content="[^"]+" \/>/g, `<meta property="og:description" content="${safeDesc}" />`)
              .replace(/<meta property="og:image" content="[^"]+" \/>/g, `<meta property="og:image" content="${post.image}" />`)
              .replace(/<meta property="og:url" content="[^"]+" \/>/g, `<meta property="og:url" content="${safeUrl}" />`)
              .replace(/<meta property="og:type" content="[^"]+" \/>/g, `<meta property="og:type" content="article" />`)
              .replace(/<meta name="twitter:title" content="[^"]+" \/>/g, `<meta name="twitter:title" content="${safeTitle}" />`)
              .replace(/<meta name="twitter:description" content="[^"]+" \/>/g, `<meta name="twitter:description" content="${safeDesc}" />`)
              .replace(/<meta name="twitter:image" content="[^"]+" \/>/g, `<meta name="twitter:image" content="${post.image}" />`)
              .replace(/<link rel="canonical" href="[^"]+" \/>/g, `<link rel="canonical" href="${safeUrl}" />`);
            
            return res.send(html);
          }
        } catch (err) {
          console.error('Error serving server-side meta tags:', err);
        }
      }
      
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
