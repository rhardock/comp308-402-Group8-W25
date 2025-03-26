import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# .env Constants
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
