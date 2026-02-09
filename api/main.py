"""
FastAPI microservice for LLM integration
Designed for deployment on on-premises edge servers
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import httpx
import os
import logging
from datetime import datetime, timezone

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="LLM Integration Microservice",
    description="FastAPI microservice for LLM integration on edge servers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend integration
# SECURITY WARNING: For production, replace allow_origins=["*"] with specific origins
# Example: allow_origins=["https://your-frontend-domain.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
LLM_API_ENDPOINT = os.getenv("LLM_API_ENDPOINT", "http://localhost:11434")  # Default to Ollama
LLM_MODEL = os.getenv("LLM_MODEL", "llama2")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2048"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))


# Request/Response Models
class Message(BaseModel):
    """Chat message model"""
    role: str = Field(..., description="Role of the message sender (user/assistant/system)")
    content: str = Field(..., description="Content of the message")


class ChatRequest(BaseModel):
    """Chat completion request model"""
    messages: List[Message] = Field(..., description="List of chat messages")
    model: Optional[str] = Field(None, description="LLM model to use")
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0, description="Sampling temperature")
    max_tokens: Optional[int] = Field(None, gt=0, description="Maximum tokens to generate")
    stream: Optional[bool] = Field(False, description="Stream the response")


class ChatResponse(BaseModel):
    """Chat completion response model"""
    id: str = Field(..., description="Unique response ID")
    model: str = Field(..., description="Model used for generation")
    created: int = Field(..., description="Unix timestamp")
    message: Message = Field(..., description="Generated message")
    usage: Optional[Dict[str, int]] = Field(None, description="Token usage statistics")


class CompletionRequest(BaseModel):
    """Text completion request model"""
    prompt: str = Field(..., description="Input prompt for completion")
    model: Optional[str] = Field(None, description="LLM model to use")
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0, description="Sampling temperature")
    max_tokens: Optional[int] = Field(None, gt=0, description="Maximum tokens to generate")


class CompletionResponse(BaseModel):
    """Text completion response model"""
    id: str = Field(..., description="Unique response ID")
    model: str = Field(..., description="Model used for generation")
    created: int = Field(..., description="Unix timestamp")
    text: str = Field(..., description="Generated text")
    usage: Optional[Dict[str, int]] = Field(None, description="Token usage statistics")


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Current timestamp")
    llm_endpoint: str = Field(..., description="LLM API endpoint")
    model: str = Field(..., description="Default LLM model")


# Helper Functions
def generate_id() -> str:
    """Generate a unique ID for responses"""
    from uuid import uuid4
    return f"chatcmpl-{uuid4().hex[:12]}"


async def call_ollama_chat(messages: List[Dict[str, str]], model: str, 
                           temperature: float, max_tokens: int) -> Dict[str, Any]:
    """Call Ollama chat API"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            payload = {
                "model": model,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens
                }
            }
            
            response = await client.post(
                f"{LLM_API_ENDPOINT}/api/chat",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error calling Ollama API: {e}")
            raise HTTPException(status_code=503, detail=f"LLM service unavailable: {str(e)}")


async def call_ollama_generate(prompt: str, model: str, 
                               temperature: float, max_tokens: int) -> Dict[str, Any]:
    """Call Ollama generate API"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens
                }
            }
            
            response = await client.post(
                f"{LLM_API_ENDPOINT}/api/generate",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Error calling Ollama API: {e}")
            raise HTTPException(status_code=503, detail=f"LLM service unavailable: {str(e)}")


# API Endpoints
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint - returns API information"""
    return {
        "service": "LLM Integration Microservice",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(datetime.UTC if hasattr(datetime, 'UTC') else timezone.utc).isoformat(),
        llm_endpoint=LLM_API_ENDPOINT,
        model=LLM_MODEL
    )


@app.post("/v1/chat/completions", response_model=ChatResponse)
async def chat_completions(request: ChatRequest):
    """
    Chat completions endpoint - compatible with OpenAI API format
    
    This endpoint accepts a list of messages and returns an AI-generated response.
    Supports conversation context through message history.
    """
    try:
        model = request.model or LLM_MODEL
        temperature = request.temperature if request.temperature is not None else TEMPERATURE
        max_tokens = request.max_tokens or MAX_TOKENS
        
        # Convert Pydantic models to dicts for API call
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        logger.info(f"Chat request received - model: {model}, messages: {len(messages)}")
        
        # Call LLM backend
        result = await call_ollama_chat(messages, model, temperature, max_tokens)
        
        # Format response
        response = ChatResponse(
            id=generate_id(),
            model=model,
            created=int(datetime.now(datetime.UTC if hasattr(datetime, 'UTC') else timezone.utc).timestamp()),
            message=Message(
                role="assistant",
                content=result.get("message", {}).get("content", "")
            ),
            usage={
                "prompt_tokens": result.get("prompt_eval_count", 0),
                "completion_tokens": result.get("eval_count", 0),
                "total_tokens": result.get("prompt_eval_count", 0) + result.get("eval_count", 0)
            }
        )
        
        logger.info(f"Chat response generated - tokens: {response.usage['total_tokens']}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat completions: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/v1/completions", response_model=CompletionResponse)
async def completions(request: CompletionRequest):
    """
    Text completions endpoint
    
    This endpoint accepts a text prompt and returns an AI-generated completion.
    """
    try:
        model = request.model or LLM_MODEL
        temperature = request.temperature if request.temperature is not None else TEMPERATURE
        max_tokens = request.max_tokens or MAX_TOKENS
        
        logger.info(f"Completion request received - model: {model}, prompt length: {len(request.prompt)}")
        
        # Call LLM backend
        result = await call_ollama_generate(request.prompt, model, temperature, max_tokens)
        
        # Format response
        response = CompletionResponse(
            id=generate_id(),
            model=model,
            created=int(datetime.now(datetime.UTC if hasattr(datetime, 'UTC') else timezone.utc).timestamp()),
            text=result.get("response", ""),
            usage={
                "prompt_tokens": result.get("prompt_eval_count", 0),
                "completion_tokens": result.get("eval_count", 0),
                "total_tokens": result.get("prompt_eval_count", 0) + result.get("eval_count", 0)
            }
        )
        
        logger.info(f"Completion response generated - tokens: {response.usage['total_tokens']}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in completions: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/v1/models")
async def list_models():
    """
    List available models from the LLM backend
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{LLM_API_ENDPOINT}/api/tags")
            response.raise_for_status()
            ollama_models = response.json()
            
            # Format to OpenAI-like response
            models = [
                {
                    "id": model.get("name"),
                    "object": "model",
                    "created": int(datetime.now(datetime.UTC if hasattr(datetime, 'UTC') else timezone.utc).timestamp()),
                    "owned_by": "local"
                }
                for model in ollama_models.get("models", [])
            ]
            
            return {"object": "list", "data": models}
            
    except Exception as e:
        logger.error(f"Error listing models: {e}")
        raise HTTPException(status_code=503, detail=f"Unable to fetch models: {str(e)}")


# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
