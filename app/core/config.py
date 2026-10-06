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
    hf_token: str = _get_cleaned_env([
        "hf_token",
        "HF_TOKEN",
        "HUGGINGFACE_TOKEN",
        "HUGGING_FACE_HUB_TOKEN",
        "HUGGINGFACEHUB_API_TOKEN",
        "HUGGINGFACE_API_KEY",
    ])
    default_model: str = "arnab9961/bangladesh-law-smollm2"
    data_json_path: str = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed_law.json")
    meta_json_path: str = os.path.join(os.path.dirname(__file__), "..", "..", "data", "meta.json")

    class Config:
        extra = "ignore"

settings = Settings()
