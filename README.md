# PaddyCH96.github.io

## Personal Portfolio Website with AI Assistant

A modern, dark-themed portfolio website featuring an integrated AI-powered chat assistant.

### Features

- 🎨 **Modern Design**: Clean, dark-themed interface
- 🤖 **AI Assistant**: Interactive chat powered by FastAPI + LLM
- 📱 **Responsive**: Works on all devices
- ⚡ **Fast**: Static site with dynamic AI capabilities
- 🔒 **Secure**: Type-safe API with input validation

### Components

1. **Portfolio Website** (`index.html`, `style.css`, `script.js`)
   - About section
   - Projects showcase
   - AI Assistant chat interface
   - Contact information

2. **FastAPI Microservice** (`api/`)
   - OpenAI-compatible LLM endpoints
   - Ollama integration
   - Docker deployment ready
   - See `api/README.md` for details

### Quick Start

#### View the Website Locally

```bash
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

#### Enable AI Chat (Optional)

The chat works in demo mode by default. To enable full AI capabilities:

```bash
cd api
python main.py
# API runs on http://localhost:8000
```

See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.

### Deployment

- **Website**: Deploy to GitHub Pages or any static host
- **API**: Deploy to your edge server with Docker
- See `DEPLOYMENT_GUIDE.md` for detailed instructions

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design with CSS Grid/Flexbox
- Modern animations and transitions

**Backend:**
- FastAPI (Python)
- Ollama for LLM hosting
- OpenAI-compatible API format
- Docker & Docker Compose

### Structure

```
.
├── index.html              # Main website
├── style.css               # Styles including chat UI
├── script.js               # JavaScript including chat logic
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
├── api/                    # FastAPI microservice
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile         # Docker configuration
│   └── README.md          # API documentation
└── assets/                 # Images and media
```

### License

MIT License - Feel free to use this as a template for your own portfolio!