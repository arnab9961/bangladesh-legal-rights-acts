import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Ensure .env is always loaded from project root
env_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
if os.path.exists(env_file_path):
    load_dotenv(env_file_path, override=True)
else:
    load_dotenv(override=True)

def _get_cleaned_env(names: list[str]) -> str:
    for name in names:
        val = os.getenv(name)
        if val:
            val = val.strip().strip('"').strip("'")
            if val:
                return val
    return ""

class Settings(BaseSettings):
    groq_cloud_api: str = _get_cleaned_env(["groq_cloud_api", "GROQ_API_KEY", "GROQ_CLOUD_API"])
    openai_api_key: str = _get_cleaned_env(["openai_api_key", "OPENAI_API_KEY"])
    default_model: str = "openai/gpt-oss-120b"
    data_json_path: str = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed_law.json")
    meta_json_path: str = os.path.join(os.path.dirname(__file__), "..", "..", "data", "meta.json")

    class Config:
        extra = "ignore"

settings = Settings()
