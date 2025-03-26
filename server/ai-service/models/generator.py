# External (Imports)
from google import genai

# Internal (Imports)
import os
import sys
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.rich_logging import logger as log
from models.prompt import Prompt, Params, Models, USER_PROMPT_FORMAT
from lib.constants import GEMINI_API_KEY

class QuestionGenerator:
    def __init__(self):
        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )
        self.params = Params(
            model=Models.GEMINI_FLASH,
            temperature=0.5,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=[],
            n=1,
            stream=False
        )
        self.prompt = Prompt(
            params=self.params
        )

    def generate(self, text: str) -> str | None:
        if not text.strip():
            log.error("Input text provided was empty, please try again.")
            return None

        try:
            prompt_content = f"{USER_PROMPT_FORMAT}\n\nInput Text: \"{text}\""
            
            response = self.client.models.generate_content(
                model=self.params.model,
                contents=[
                    prompt_content
                ]
            )
            log.info(f"API Response: {response}")

            response = response.text.strip()
            if response.startswith("```json") and response.endswith("```"):
                response = response[7:-3].strip()
            return json.loads(response)

        except Exception as e:
            log.error(f"Error processing request: {e}")
            return None