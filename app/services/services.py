import json
import os
import time
import re
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi
import groq
import openai

from app.core.config import settings
from app.services.schema import Citation, ChatRequest, ChatResponse, SearchResponse, ActItem, ModelInfo

class RAGEngine:
    def __init__(self):
        self.sections_db: List[Dict[str, Any]] = []
        self.acts_summary: List[ActItem] = []
        self.bm25: Optional[BM25Okapi] = None
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None
        self.corpus_tokens: List[List[str]] = []
        self.total_acts = 0
        self.total_sections = 0
        self.total_footnotes = 0
        self.is_initialized = False

    def initialize(self):
        if self.is_initialized:
            return

        print("Initializing Bangladesh Legal RAG Engine...")
        start_time = time.time()
        
        json_path = settings.data_json_path
        if not os.path.exists(json_path):
            print(f"Warning: Data file not found at {json_path}")
            return

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        meta = data.get("metadata", {})
        self.total_acts = meta.get("total_acts", 0)
        self.total_footnotes = meta.get("total_footnotes", 0)

        acts = data.get("acts", [])
        sections_db = []
        acts_summary = []
        corpus_texts = []
        corpus_tokens = []

        for act in acts:
            act_title = act.get("act_title", "Unknown Act")
            act_no = act.get("act_no", "")
            act_year = act.get("act_year", "")
            footnotes = [fn.get("footnote_text", "") for fn in act.get("footnotes", []) if fn.get("footnote_text")]
            
            sections = act.get("sections", [])
            sec_count = len(sections)
            
            acts_summary.append(ActItem(
                act_title=act_title,
                act_no=str(act_no) if act_no else None,
                act_year=str(act_year) if act_year else None,
                section_count=sec_count
            ))

            for idx, sec in enumerate(sections):
                content = sec.get("section_content", "").strip()
                if not content:
                    continue

                # Combine Act title and content for rich search indexing
                searchable_text = f"{act_title} (Year: {act_year}, Act No: {act_no}). {content}"
                
                doc_obj = {
                    "act_title": act_title,
                    "act_no": str(act_no) if act_no else "",
                    "act_year": str(act_year) if act_year else "",
                    "section_index": idx + 1,
                    "section_content": content,
                    "footnotes": footnotes,
                    "searchable_text": searchable_text
                }
                sections_db.append(doc_obj)
                
                # Tokenize for BM25
                tokens = self._tokenize(searchable_text)
                corpus_tokens.append(tokens)
                corpus_texts.append(searchable_text)

        self.sections_db = sections_db
        self.acts_summary = acts_summary
        self.total_sections = len(sections_db)
        self.corpus_tokens = corpus_tokens

        # Build BM25 Index
        print("Building BM25 Index...")
        self.bm25 = BM25Okapi(corpus_tokens)

        # Build TF-IDF Index for dense lexical cosine similarity
        print("Building TF-IDF Vector Space Matrix...")
        self.vectorizer = TfidfVectorizer(max_features=25000, stop_words='english', ngram_range=(1, 2))
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus_texts)

        self.is_initialized = True
        elapsed = time.time() - start_time
        print(f"RAG Engine loaded {self.total_sections} sections across {len(acts_summary)} acts in {elapsed:.2f} seconds.")

    def _tokenize(self, text: str) -> List[str]:
        text = text.lower()
        return re.findall(r'\b\w+\b', text)

    def retrieve(self, query: str, top_k: int = 5) -> List[Citation]:
        if not self.is_initialized:
            self.initialize()

        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        # 1. BM25 Scores
        bm25_scores = self.bm25.get_scores(query_tokens)
        bm25_max = np.max(bm25_scores) if np.max(bm25_scores) > 0 else 1.0
        norm_bm25 = bm25_scores / bm25_max

        # 2. TF-IDF Cosine Similarity
        query_vec = self.vectorizer.transform([query])
        tfidf_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        tfidf_max = np.max(tfidf_scores) if np.max(tfidf_scores) > 0 else 1.0
        norm_tfidf = tfidf_scores / tfidf_max

        # Hybrid Score = 0.6 * BM25 + 0.4 * TF-IDF
        hybrid_scores = (0.6 * norm_bm25) + (0.4 * norm_tfidf)

        # Keyword boost for explicit year or act mentions
        query_lower = query.lower()
        for i, doc in enumerate(self.sections_db):
            if doc["act_title"].lower() in query_lower:
                hybrid_scores[i] += 0.3
            if doc["act_year"] and doc["act_year"] in query_lower:
                hybrid_scores[i] += 0.15

        top_indices = np.argsort(hybrid_scores)[::-1][:top_k]

        citations = []
        for idx in top_indices:
            score = float(hybrid_scores[idx])
            if score <= 0.001:
                continue
            doc = self.sections_db[idx]
            citations.append(Citation(
                act_title=doc["act_title"],
                act_no=doc["act_no"],
                act_year=doc["act_year"],
                section_content=doc["section_content"],
                footnotes=doc["footnotes"][:3], # Top 3 footnotes for brevity
                score=round(score, 4)
            ))
        return citations

    def get_supported_models(self) -> List[ModelInfo]:
        return [
            ModelInfo(id="llama-3.3-70b-versatile", name="Llama 3.3 70B (Groq)", provider="Groq Cloud", is_default=True),
            ModelInfo(id="llama3-70b-8192", name="Llama 3 70B (Groq)", provider="Groq Cloud"),
            ModelInfo(id="mixtral-80b-32768", name="Mixtral 8x7B (Groq)", provider="Groq Cloud"),
            ModelInfo(id="gemma2-9b-it", name="Gemma 2 9B (Groq)", provider="Groq Cloud"),
            ModelInfo(id="deepseek-r1-distill-llama-70b", name="DeepSeek R1 Distill 70B (Groq)", provider="Groq Cloud"),
            ModelInfo(id="gpt-4o", name="GPT-4o (OpenAI)", provider="OpenAI"),
            ModelInfo(id="gpt-4o-mini", name="GPT-4o Mini (OpenAI)", provider="OpenAI"),
        ]

    def generate_answer(self, req: ChatRequest) -> ChatResponse:
        start_time = time.time()
        
        # 1. Retrieve relevant legal sections
        citations = self.retrieve(req.message, top_k=req.top_k)

        # Prepare context text
        context_blocks = []
        for idx, cit in enumerate(citations, 1):
            act_info = f"Act: {cit.act_title}"
            if cit.act_no:
                act_info += f" (Act No. {cit.act_no})"
            if cit.act_year:
                act_info += f" of {cit.act_year}"
            
            block = f"[Source {idx}] {act_info}\nContent: {cit.section_content}"
            if cit.footnotes:
                block += "\nFootnotes: " + "; ".join(cit.footnotes)
            context_blocks.append(block)

        context_str = "\n\n".join(context_blocks) if context_blocks else "No direct matching statutory sections found in database."

        system_prompt = (
            "You are Retrocast Legal AI, an elite legal assistant specialized in Bangladesh Laws, Acts, and Constitutional Rights. "
            "Your theme is vintage broadcast intelligence -- precise, structured, authoritative, and helpful.\n\n"
            "Use the provided Bangladesh Legal Statutory Sources below to answer the user's inquiry accurately. "
            "Rules:\n"
            "1. Base your legal reasoning primarily on the retrieved Statutory Sources provided in the context.\n"
            "2. Cite the exact Act Name, Act Year, and Section/Footnote whenever referencing law.\n"
            "3. If the retrieved context contains relevant laws, explain their application clearly.\n"
            "4. Provide practical guidance or next steps where applicable, while adding a standard legal disclaimer at the end.\n"
            "5. Maintain a clean retro-broadcast legal tone."
        )

        user_prompt = f"RETRIEVED STATUTORY SOURCES:\n{context_str}\n\nUSER QUESTION: {req.message}"

        # Determine API Key & Provider
        api_key = req.api_key or settings.groq_cloud_api or settings.openai_api_key
        model_name = req.model_name or settings.default_model

        if not api_key:
            return ChatResponse(
                answer="⚠️ **GROQ CLOUD API KEY MISSING**: Please enter your Groq Cloud API key in the Retrocast Settings panel (top right gear icon) to query the LLM model.",
                citations=citations,
                latency_ms=round((time.time() - start_time) * 1000, 2),
                model_used="none",
                total_sources=len(citations)
            )

        # Call LLM via Groq or OpenAI client
        answer = ""
        try:
            if "gpt-4" in model_name.lower() or model_name.startswith("gpt-"):
                # OpenAI Client
                client = openai.OpenAI(api_key=api_key)
                response = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=req.temperature,
                    max_tokens=1500
                )
                answer = response.choices[0].message.content
            else:
                # Groq Client (using official groq SDK or OpenAI compatible endpoint)
                try:
                    client = groq.Groq(api_key=api_key)
                    response = client.chat.completions.create(
                        model=model_name,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        temperature=req.temperature,
                        max_tokens=1500
                    )
                    answer = response.choices[0].message.content
                except Exception:
                    # Fallback to OpenAI SDK pointed to Groq base_url
                    client = openai.OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
                    response = client.chat.completions.create(
                        model=model_name,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        temperature=req.temperature,
                        max_tokens=1500
                    )
                    answer = response.choices[0].message.content

        except Exception as e:
            answer = (
                f"🚨 **BROADCAST ERROR / API CALL FAILED**: {str(e)}\n\n"
                "Please verify your API key in the Retrocast Control Settings or select another model."
            )

        latency = round((time.time() - start_time) * 1000, 2)
        return ChatResponse(
            answer=answer,
            citations=citations,
            latency_ms=latency,
            model_used=model_name,
            total_sources=len(citations)
        )

# Global Singleton Instance
rag_engine = RAGEngine()
