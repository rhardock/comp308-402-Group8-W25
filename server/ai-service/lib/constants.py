import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# Environment Variables (.env - API Keys)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
