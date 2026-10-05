import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.requests import Request as FastAPIRequest
import traceback

from app.services.route import router as api_router
from app.services.services import rag_engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("=== STARTING RETROCAST BANGLADESH LEGAL RAG SERVICE ===")
    rag_engine.initialize()
    yield
    print("=== SHUTTING DOWN RETROCAST SERVICE ===")

app = FastAPI(
    title="Retrocast Legal RAG - Bangladesh Laws & Rights",
    description="Vintage Broadcast Themed RAG Chatbot powered by Bangladesh Laws Database & Groq/OpenAI LLMs",
    version="1.0.0",
    lifespan=lifespan
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: FastAPIRequest, exc: Exception):
    traceback.print_exc()
    return JSONResponse(status_code=500, content={
        "detail": "Internal Server Error",
        "error": str(exc)
    })

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

# Mount Images Directory
images_dir = os.path.join(os.path.dirname(__file__), "images")
if os.path.exists(images_dir):
    app.mount("/images", StaticFiles(directory=images_dir), name="images")

# Mount Static Directory
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return HTMLResponse("<h2>Retrocast Legal RAG Service is running. Frontend static/index.html loading...</h2>")

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
