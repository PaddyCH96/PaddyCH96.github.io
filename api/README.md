# FastAPI LLM Integration Microservice

A production-ready FastAPI microservice for integrating Large Language Models (LLMs) with on-premises edge servers. This service provides OpenAI-compatible API endpoints for chat completions and text generation.

## Features

- 🚀 **OpenAI-Compatible API**: Drop-in replacement for OpenAI API endpoints
- 🔌 **Ollama Integration**: Native support for Ollama LLM backend
- 🌐 **CORS Enabled**: Ready for frontend integration
- 📊 **Automatic API Documentation**: Interactive Swagger UI and ReDoc
- 🔐 **Type-Safe**: Fully typed with Pydantic models
- 📝 **Comprehensive Logging**: Structured logging for monitoring and debugging
- 🏥 **Health Checks**: Built-in health check endpoints
- ⚡ **Async Support**: Fully asynchronous for high performance

## Quick Start

### Prerequisites

- Python 3.8+
- Ollama installed and running (default: http://localhost:11434)

### Installation

1. **Clone the repository**
```bash
cd api
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run the service**
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Health Check
```bash
GET /health
```

Returns service health status and configuration.

### Chat Completions
```bash
POST /v1/chat/completions
```

OpenAI-compatible chat completions endpoint.

**Example Request:**
```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "model": "llama2",
    "temperature": 0.7,
    "max_tokens": 2048
  }'
```

**Example Response:**
```json
{
  "id": "chatcmpl-abc123def456",
  "model": "llama2",
  "created": 1707489482,
  "message": {
    "role": "assistant",
    "content": "Hello! I'm doing well, thank you for asking..."
  },
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 128,
    "total_tokens": 143
  }
}
```

### Text Completions
```bash
POST /v1/completions
```

Simple text completion endpoint.

**Example Request:**
```bash
curl -X POST http://localhost:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Once upon a time",
    "model": "llama2",
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

### List Models
```bash
GET /v1/models
```

Returns list of available models from the LLM backend.

## Configuration

Configuration is done through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `LLM_API_ENDPOINT` | Ollama API endpoint URL | `http://localhost:11434` |
| `LLM_MODEL` | Default LLM model to use | `llama2` |
| `MAX_TOKENS` | Maximum tokens to generate | `2048` |
| `TEMPERATURE` | Default sampling temperature | `0.7` |
| `HOST` | Service host address | `0.0.0.0` |
| `PORT` | Service port | `8000` |

## Docker Deployment

### Using Docker

1. **Build the image**
```bash
docker build -t llm-microservice .
```

2. **Run the container**
```bash
docker run -d \
  -p 8000:8000 \
  -e LLM_API_ENDPOINT=http://host.docker.internal:11434 \
  -e LLM_MODEL=llama2 \
  --name llm-microservice \
  llm-microservice
```

### Using Docker Compose

```bash
docker-compose up -d
```

## Edge Server Deployment

### System Requirements

- Linux-based system (Ubuntu 20.04+ recommended)
- Python 3.8+
- 4GB+ RAM
- Ollama installed locally or on network

### Production Deployment

1. **Create a systemd service**

```bash
sudo nano /etc/systemd/system/llm-microservice.service
```

Add the following:
```ini
[Unit]
Description=LLM Integration Microservice
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/llm-microservice/api
Environment="PATH=/opt/llm-microservice/venv/bin"
Environment="LLM_API_ENDPOINT=http://localhost:11434"
Environment="LLM_MODEL=llama2"
ExecStart=/opt/llm-microservice/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

2. **Enable and start the service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable llm-microservice
sudo systemctl start llm-microservice
```

3. **Configure reverse proxy (nginx)**

```nginx
server {
    listen 80;
    server_name your-edge-server.local;

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 120s;
    }
}
```

## Development

### Project Structure

```
api/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example        # Example environment variables
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── README.md           # This file
```

### Running Tests

```bash
# Install test dependencies
pip install pytest httpx pytest-asyncio

# Run tests
pytest tests/
```

### Code Quality

```bash
# Format code
black main.py

# Lint code
pylint main.py

# Type checking
mypy main.py
```

## Integration Examples

### Python Client

```python
import httpx

async def chat_with_llm(message: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/v1/chat/completions",
            json={
                "messages": [{"role": "user", "content": message}],
                "model": "llama2"
            }
        )
        return response.json()
```

### JavaScript/Frontend

```javascript
async function chatWithLLM(message) {
    const response = await fetch('http://localhost:8000/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [
                { role: 'user', content: message }
            ],
            model: 'llama2'
        })
    });
    return await response.json();
}
```

## Troubleshooting

### Common Issues

1. **Connection refused to Ollama**
   - Ensure Ollama is running: `ollama serve`
   - Check the endpoint URL in your configuration

2. **CORS errors**
   - Update `allow_origins` in the CORS middleware configuration
   - For production, specify exact origins instead of `["*"]`

3. **Timeout errors**
   - Increase `httpx.AsyncClient(timeout=...)` value
   - Consider using smaller models or reducing max_tokens

## Security Considerations

- Configure CORS appropriately for production
- Use environment variables for sensitive configuration
- Consider adding authentication/authorization
- Run behind a reverse proxy with SSL/TLS
- Rate limit requests to prevent abuse
- Monitor resource usage on edge servers

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the API documentation at `/docs`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
