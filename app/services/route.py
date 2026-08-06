from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from app.services.schema import (
    ChatRequest, ChatResponse, SearchResponse, Citation,
    ActItem, ModelInfo, SystemStats
)
from app.services.services import rag_engine

router = APIRouter(prefix="/api", tags=["Retrocast Legal RAG"])

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Chat message cannot be empty")
    return rag_engine.generate_answer(req)

@router.get("/search", response_model=SearchResponse)
async def search_endpoint(query: str = Query(..., min_length=2), top_k: int = Query(10, ge=1, le=50)):
    citations = rag_engine.retrieve(query, top_k=top_k)
    return SearchResponse(
        query=query,
        total_results=len(citations),
        results=citations
    )

@router.get("/acts", response_model=List[ActItem])
async def list_acts_endpoint(limit: int = Query(100, ge=1, le=2000), search: Optional[str] = None):
    if not rag_engine.is_initialized:
        rag_engine.initialize()
    
    acts = rag_engine.acts_summary
    if search and search.strip():
        q = search.lower()
        acts = [a for a in acts if q in a.act_title.lower() or (a.act_year and q in a.act_year)]
        
    return acts[:limit]

@router.get("/models", response_model=List[ModelInfo])
async def list_models_endpoint():
    return rag_engine.get_supported_models()

@router.get("/health", response_model=SystemStats)
async def health_endpoint():
    if not rag_engine.is_initialized:
        rag_engine.initialize()
    return SystemStats(
        total_acts=rag_engine.total_acts,
        total_sections=rag_engine.total_sections,
        total_footnotes=rag_engine.total_footnotes,
        status="OPERATIONAL" if rag_engine.is_initialized else "INITIALIZING"
    )
