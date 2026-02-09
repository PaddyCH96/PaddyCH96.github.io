"""
Example client for testing the LLM Integration Microservice
"""
import asyncio
import httpx
import json


async def test_health():
    """Test health check endpoint"""
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/health")
        print("Health Check:")
        print(json.dumps(response.json(), indent=2))
        print()


async def test_chat():
    """Test chat completions endpoint"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "http://localhost:8000/v1/chat/completions",
            json={
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "What is FastAPI?"}
                ],
                "model": "llama2",
                "temperature": 0.7,
                "max_tokens": 150
            }
        )
        print("Chat Completion:")
        print(json.dumps(response.json(), indent=2))
        print()


async def test_completion():
    """Test text completions endpoint"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "http://localhost:8000/v1/completions",
            json={
                "prompt": "FastAPI is a modern web framework for",
                "model": "llama2",
                "temperature": 0.7,
                "max_tokens": 100
            }
        )
        print("Text Completion:")
        print(json.dumps(response.json(), indent=2))
        print()


async def test_models():
    """Test list models endpoint"""
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/v1/models")
        print("Available Models:")
        print(json.dumps(response.json(), indent=2))
        print()


async def main():
    """Run all tests"""
    print("=" * 60)
    print("LLM Integration Microservice - Client Test")
    print("=" * 60)
    print()
    
    try:
        await test_health()
    except Exception as e:
        print(f"Health check failed: {e}")
        print("Make sure the service is running at http://localhost:8000")
        return
    
    try:
        await test_models()
    except Exception as e:
        print(f"List models failed: {e}")
        print()
    
    # Uncomment these if you have Ollama running with models
    # try:
    #     await test_chat()
    # except Exception as e:
    #     print(f"Chat completion failed: {e}")
    #     print()
    
    # try:
    #     await test_completion()
    # except Exception as e:
    #     print(f"Text completion failed: {e}")
    #     print()


if __name__ == "__main__":
    asyncio.run(main())
