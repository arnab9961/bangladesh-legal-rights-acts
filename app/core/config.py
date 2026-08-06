import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    groq_cloud_api: str = os.getenv("groq_cloud_api", os.getenv("GROQ_API_KEY", ""))
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    default_model: str = "llama-3.3-70b-versatile"
    data_json_path: str = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed_law.json")
    meta_json_path: str = os.path.join(os.path.dirname(__file__), "..", "..", "data", "meta.json")

    class Config:
        extra = "ignore"

settings = Settings()
