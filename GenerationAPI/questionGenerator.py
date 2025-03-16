from google import genai
import os
import json
class QuestionGenerator:
    def __init__(self):
        #get api from .env
        api_key = os.getenv("GEMINI_API_KEY")
        #raise error if no api key
        if not api_key:
            raise ValueError("GEMINI_API_KEY is missing. Set it in the .env file.")
        #initialize Gemini client
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        #specify which model to use
        self.model = "gemini-2.0-flash"
    
    
    def generate(self, text):
        #Raise error if input is empty
        if not text.strip():
            raise ValueError("Text can not be empty.")
        
        #Create prompt for Gemini model
        prompt = f"""
        Generate question-answer pairs from the following text:
        "{text}"
        Provide the output in the following format:
        [
            {{"question": "[insert question]", "answer": "[insert answer]}},
            {{"question" : "[insert another question]", "answer": "[insert another answer]"}}
        ]
        Make sure each question is clear and relevant to the provided text, and that each answer is concise
        and directly derived from the text. Return the output as JSON.
        """
        # Call Gemini API for questions and answers
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[prompt]
            )
            response_text = response.text.strip()
            if response_text.startswith("```json") and response_text.endswith("```"):
                response_text = response_text[7:-3].strip()

            questions_and_answers = json.loads(response_text)
            return questions_and_answers
        except Exception as e:
            raise RuntimeError(f"Failed to generate questions and answers: {str(e)}")