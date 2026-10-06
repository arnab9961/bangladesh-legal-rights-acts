import json
import os
import time
import re
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi
import requests
from huggingface_hub import InferenceClient

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
            act_no = str(act.get("act_no") or "").strip()
            if act_no.lower() in ["nan", "none", "null"]:
                act_no = ""
            act_year = str(act.get("act_year") or "").strip()
            if act_year.lower() in ["nan", "none", "null"]:
                act_year = ""
            footnotes = [fn.get("footnote_text", "") for fn in act.get("footnotes", []) if fn.get("footnote_text")]
            
            sections = act.get("sections", [])
            sec_count = len(sections)
            
            acts_summary.append(ActItem(
                act_title=act_title,
                act_no=act_no if act_no else None,
                act_year=act_year if act_year else None,
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
            ModelInfo(
                id="arnab9961/bangladesh-law-smollm2",
                name="Bangladesh Law SmolLM2 (Fine-Tuned)",
                provider="Hugging Face",
                is_default=True
            ),
        ]

    def generate_answer(self, req: ChatRequest) -> ChatResponse:
        start_time = time.time()
        
        try:
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
                "You are Bangladesh Legal AI, an elite legal assistant specialized in Bangladesh Laws, Acts, and Constitutional Rights. "
                "Use the provided Bangladesh Legal Statutory Sources below to answer the user's inquiry accurately, professionally, and clearly. "
                "Rules:\n"
                "1. Base your legal reasoning primarily on the retrieved Statutory Sources provided in the context.\n"
                "2. Cite the exact Act Name, Act Year, and Section/Footnote whenever referencing law.\n"
                "3. If the user asks in Bengali, respond in clear professional Bengali; if in English, respond in English.\n"
                "4. Provide practical guidance or next steps where applicable, and include a concise standard legal disclaimer at the end."
            )

            user_prompt = f"RETRIEVED STATUTORY SOURCES:\n{context_str}\n\nUSER QUESTION: {req.message}"

            # Determine Hugging Face Token (hf_token)
            raw_key = req.api_key or settings.hf_token or ""
            hf_token = raw_key.strip().strip('"').strip("'")
            model_name = (req.model_name or settings.default_model).strip()
            if not model_name:
                model_name = "arnab9961/bangladesh-law-smollm2"

            if not hf_token:
                return ChatResponse(
                    answer=(
                        "⚠️ **HUGGING FACE ACCESS TOKEN (hf_token) MISSING**:\n\n"
                        "Please provide your Hugging Face Access Token in the Settings panel (⚙️ icon at the top right) or add it to your `.env` file as:\n\n"
                        "```env\nhf_token=hf_your_token_here\n```\n\n"
                        "ℹ️ *You can get a free Access Token from your Hugging Face account at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).*\n\n"
                        "---\n\n"
                        "⚠️ **হাগিং ফেস এক্সেস টোকেন (hf_token) অনুপস্থিত**:\n\n"
                        "অনুগ্রহ করে উপরের ডানদিকের সেটিংস (⚙️) আইকনে ক্লিক করে আপনার Hugging Face এক্সেস টোকেন প্রবেশ করান অথবা প্রজেক্টের `.env` ফাইলে `hf_token=hf_...` হিসেবে যুক্ত করুন।"
                    ),
                    citations=citations,
                    latency_ms=round((time.time() - start_time) * 1000, 2),
                    model_used=model_name,
                    total_sources=len(citations)
                )

            # Generate response via Hugging Face model
            answer = ""
            try:
                # Primary method: Hugging Face InferenceClient chat_completion
                try:
                    client = InferenceClient(api_key=hf_token)
                    hf_response = client.chat_completion(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        model=model_name,
                        max_tokens=1500,
                        temperature=req.temperature
                    )
                    if hf_response.choices and len(hf_response.choices) > 0:
                        answer = hf_response.choices[0].message.content or ""
                except Exception as client_err:
                    client_err_str = str(client_err)
                    if "401" in client_err_str or "unauthorized" in client_err_str.lower() or "invalid username or password" in client_err_str.lower():
                        raise ValueError("Invalid Hugging Face access token (401 Unauthorized). Please verify your hf_token permissions.")

                    # Fallback 1: Direct HTTP POST to Hugging Face router chat completions
                    headers = {
                        "Authorization": f"Bearer {hf_token}",
                        "Content-Type": "application/json"
                    }
                    chat_payload = {
                        "model": model_name,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "max_tokens": 1500,
                        "temperature": req.temperature
                    }
                    resp = requests.post(
                        "https://router.huggingface.co/hf-inference/v1/chat/completions",
                        headers=headers,
                        json=chat_payload,
                        timeout=60
                    )
                    if resp.status_code == 200:
                        res_json = resp.json()
                        choices = res_json.get("choices", [])
                        if choices and "message" in choices[0]:
                            answer = choices[0]["message"].get("content", "")
                    elif resp.status_code == 401:
                        raise ValueError("Invalid Hugging Face access token (401 Unauthorized). Please verify your hf_token.")
                    else:
                        # Fallback 2: Direct model endpoint with ChatML template
                        formatted_prompt = (
                            f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
                            f"<|im_start|>user\n{user_prompt}<|im_end|>\n"
                            f"<|im_start|>assistant\n"
                        )
                        model_url = f"https://router.huggingface.co/hf-inference/models/{model_name}"
                        gen_payload = {
                            "inputs": formatted_prompt,
                            "parameters": {
                                "max_new_tokens": 1500,
                                "temperature": req.temperature,
                                "return_full_text": False
                            }
                        }
                        resp_gen = requests.post(model_url, headers=headers, json=gen_payload, timeout=90)
                        if resp_gen.status_code == 200:
                            gen_json = resp_gen.json()
                            if isinstance(gen_json, list) and len(gen_json) > 0 and "generated_text" in gen_json[0]:
                                answer = gen_json[0]["generated_text"]
                            elif isinstance(gen_json, dict) and "generated_text" in gen_json:
                                answer = gen_json["generated_text"]
                            else:
                                answer = str(gen_json)
                        elif resp_gen.status_code == 503:
                            loading_info = resp_gen.json() if resp_gen.headers.get("content-type") == "application/json" else {}
                            est_time = loading_info.get("estimated_time", 20.0)
                            raise RuntimeError(f"Hugging Face model '{model_name}' is currently initializing (estimated wait: {int(est_time)}s). Please try again in a moment.")
                        else:
                            raise RuntimeError(f"Hugging Face API returned error ({resp_gen.status_code}): {resp_gen.text}")

                # Clean any ChatML / tokenizer artifacts if present
                if answer:
                    answer = answer.replace("<|im_end|>", "").replace("<|endoftext|>", "").strip()

            except Exception as e:
                answer = (
                    f"⚠️ **Hugging Face Model Error**: {str(e)}\n\n"
                    "অনুগ্রহ করে সেটিংস প্যানেলে (⚙️) বা `.env` ফাইলে আপনার Hugging Face টোকেন (`hf_token`) পরীক্ষা করুন।"
                )

            if not answer:
                answer = "কোনো প্রতিক্রিয়া পাওয়া যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"

            latency = round((time.time() - start_time) * 1000, 2)
            return ChatResponse(
                answer=answer,
                citations=citations,
                latency_ms=latency,
                model_used=model_name,
                total_sources=len(citations)
            )

        except Exception as top_err:
            latency = round((time.time() - start_time) * 1000, 2)
            return ChatResponse(
                answer=f"⚠️ **অভ্যন্তরীণ ত্রুটি**: {str(top_err)}",
                citations=[],
                latency_ms=latency,
                model_used="error",
                total_sources=0
            )

# Global Singleton Instance
rag_engine = RAGEngine()
