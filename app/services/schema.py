from typing import List, Optional, Any
from pydantic import BaseModel, Field

class Citation(BaseModel):
    act_title: str
    act_no: Optional[str] = None
    act_year: Optional[str] = None
    section_content: str
    footnotes: List[str] = []
    score: float

class ChatRequest(BaseModel):
    message: str = Field(..., description="User prompt or legal query")
    api_key: Optional[str] = Field(None, description="Optional Hugging Face access token (hf_token) override")
    model_name: Optional[str] = Field(None, description="Target Hugging Face model")
    top_k: int = Field(5, ge=1, le=20, description="Number of legal section citations to retrieve")
    temperature: float = Field(0.2, ge=0.0, le=1.0)

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    latency_ms: float
    model_used: str
    total_sources: int

class SearchQuery(BaseModel):
    query: str
    top_k: int = 10
    act_filter: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[Citation]

class ActItem(BaseModel):
    act_title: str
    act_no: Optional[str] = None
    act_year: Optional[str] = None
    section_count: int

class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    is_default: bool = False

class SystemStats(BaseModel):
    total_acts: int
    total_sections: int
    total_footnotes: int
    status: str
