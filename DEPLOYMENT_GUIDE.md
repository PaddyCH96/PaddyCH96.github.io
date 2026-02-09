# AI Chat Integration - Deployment Guide

This guide explains how to deploy and configure the AI Chat Assistant on your website.

## Overview

The AI Chat Assistant is integrated into your portfolio website and connects to the FastAPI microservice running on your edge server. The chat interface works in two modes:

1. **Demo Mode**: When the API is offline, pre-configured responses are shown
2. **Live Mode**: When connected to the FastAPI service, full LLM capabilities are available

## Quick Start

### For Development (Local Testing)

1. **Start the FastAPI service:**
   ```bash
   cd api
   python main.py
   ```
   The API will run on `http://localhost:8000`

2. **Start a local web server:**
   ```bash
   python3 -m http.server 8080
   ```
   Or use any web server like `live-server`, `http-server`, etc.

3. **Open your browser:**
   Navigate to `http://localhost:8080`

4. **Test the chat:**
   Click on "AI Assistant" in the navigation menu and start chatting!

### For Production Deployment

#### Option 1: GitHub Pages + Edge Server API

1. **Deploy your website to GitHub Pages:**
   - The website files (HTML, CSS, JS) are already set up for GitHub Pages
   - Push to your repository and enable GitHub Pages in settings

2. **Configure your edge server:**
   ```bash
   # On your edge server
   cd api
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start the service with Docker
   docker-compose up -d
   
   # Or use systemd (see api/README.md for details)
   ```

3. **Update the API endpoint in script.js:**
   Open `script.js` and update the production API URL:
   ```javascript
   const API_CONFIG = {
       baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
           ? 'http://localhost:8000'
           : 'https://your-edge-server.com/api', // Update this!
       // ...
   };
   ```

4. **Enable CORS on your API:**
   In `api/main.py`, update the CORS settings:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourusername.github.io"],  # Your GitHub Pages URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

#### Option 2: Self-Hosted Website + API

If you're hosting the entire website on your own server:

1. **Configure the API URL:**
   In `script.js`, set:
   ```javascript
   const API_CONFIG = {
       baseURL: 'http://localhost:8000', // Or your server's API URL
       // ...
   };
   ```

2. **Deploy both together:**
   - Use nginx to serve both the website and proxy API requests
   - Example nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Serve website
       location / {
           root /path/to/website;
           index index.html;
       }
       
       # Proxy API requests
       location /api/ {
           proxy_pass http://localhost:8000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Configuration Options

### Chat Behavior

You can customize the chat behavior in `script.js`:

```javascript
// Demo responses for when API is offline
const demoResponses = {
    'skills': "Your custom response...",
    'projects': "Your custom response...",
    'ai': "Your custom response...",
    'default': "Your custom response..."
};
```

### API Parameters

Adjust the LLM parameters in the `getAIResponse` function:

```javascript
body: JSON.stringify({
    messages: chatState.messages,
    temperature: 0.7,      // Creativity (0.0 - 2.0)
    max_tokens: 500        // Response length
})
```

### Suggested Prompts

Update the suggested prompts in `index.html`:

```html
<button class="prompt-btn" data-prompt="Your custom prompt">Button text</button>
```

## Features

### ✅ What's Included

- **Interactive Chat Interface**: Modern, responsive chat UI
- **Demo Mode**: Works without API connection
- **Status Indicator**: Shows API connection status
- **Typing Indicator**: Shows when AI is responding
- **Message History**: Maintains conversation context
- **Clear Chat**: Reset conversation anytime
- **Suggested Prompts**: Quick-start conversation topics
- **Mobile Responsive**: Works on all devices
- **Dark Theme**: Matches portfolio design

### 🎨 Customization

All styles are in `style.css` under the "AI Chat Assistant Styles" section. You can customize:
- Colors and gradients
- Message bubble styles
- Animation speeds
- Chat height and width
- Button styles

## Troubleshooting

### Chat shows "API Offline"

1. Check if the FastAPI service is running:
   ```bash
   curl http://localhost:8000/health
   ```

2. Check browser console for errors (F12)

3. Verify CORS settings in `api/main.py`

4. Check network tab to see if requests are being sent

### Messages not sending

1. Check if the send button is disabled
2. Ensure there's text in the input field
3. Check browser console for JavaScript errors

### Slow responses

1. Increase the timeout in `script.js`:
   ```javascript
   const response = await fetch(..., {
       // Add timeout handling
   });
   ```

2. Check your LLM model - smaller models respond faster

3. Ensure your edge server has adequate resources

### CORS errors

Update `api/main.py` CORS configuration:
```python
allow_origins=["https://your-actual-domain.com"]
```

## Security Considerations

1. **CORS Configuration**: Never use `allow_origins=["*"]` in production
2. **Rate Limiting**: Consider adding rate limiting to the API
3. **API Authentication**: Add authentication if needed
4. **HTTPS**: Use HTTPS for both website and API
5. **Input Validation**: Already implemented in API

## Monitoring

### Health Check

The chat automatically checks API health on load. You can also manually check:

```bash
curl http://localhost:8000/health
```

### Logs

- **Browser**: Check browser console (F12)
- **API**: Check FastAPI logs for incoming requests

## Next Steps

1. **Deploy the API** to your edge server
2. **Update the API URL** in script.js
3. **Configure CORS** properly
4. **Test the integration** thoroughly
5. **Monitor performance** and adjust as needed

## Support

For issues with:
- **API/Backend**: See `api/README.md`
- **Website/Frontend**: Check browser console
- **Deployment**: Review this guide

## Architecture Diagram

```
┌─────────────────────┐
│   Website (GitHub   │
│   Pages / Server)   │
│                     │
│  ┌──────────────┐   │
│  │ AI Assistant │   │
│  │   (JS/HTML)  │   │
│  └──────┬───────┘   │
└─────────┼───────────┘
          │ HTTP Requests
          │
┌─────────▼───────────┐
│   Edge Server       │
│                     │
│  ┌──────────────┐   │
│  │   FastAPI    │   │
│  │ Microservice │   │
│  └──────┬───────┘   │
│         │           │
│  ┌──────▼───────┐   │
│  │   Ollama/    │   │
│  │   LLM Model  │   │
│  └──────────────┘   │
└─────────────────────┘
```

## Example Usage

Once deployed, users can:
1. Click "AI Assistant" in the navigation
2. Click suggested prompts or type their own questions
3. Get AI-powered responses about your skills, projects, and more
4. Have natural conversations with conversation context

The assistant can answer questions about:
- Your technical skills and experience
- Projects you've worked on
- How the AI system works
- General programming/tech questions (when connected to LLM)

Enjoy your AI-powered portfolio! 🚀
