# External (Imports)
from transformers import pipeline

# Internal (Imports)
import os
import sys
import re

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.rich_logging import logger as log
from models.prompt import Params, Models

class TextSummarizer:
    def __init__(self, model_name='facebook/bart-large-cnn', min_ratio=0.5, max_ratio=0.8, chunk_size=600):
        self.summarizer = pipeline("summarization", model=model_name, framework='pt')
        self.min_ratio = min_ratio
        self.max_ratio = max_ratio
        self.chunk_size = chunk_size
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

    def __make_chunks(self, text):
        words = text.split()  
        num_words = len(words)
        chunks = []
        start = 0
        sentence_endings = re.compile(r'[\.\?\!]')

        while start < num_words:
            end = min(start + self.chunk_size, num_words)
            if end < num_words:
                for i in range(end, start, -1):
                    if i < len(words) and sentence_endings.search(words[i][-1:]):  
                        end = i + 1
                        break

            chunk = " ".join(words[start:end]) 
            chunks.append(chunk)
            start = end
        return chunks  

    def __summarize_chunk(self, chunk):
        num_words = len(chunk.split())
        minimum = max(20, int(self.min_ratio * num_words))
        maximum = min(800, int(self.max_ratio * num_words))

        log.info(f"Summarizing chunk of {num_words} words")
        try:
            summary = self.summarizer(
                chunk,
                max_length=maximum, min_length=minimum,
                truncation=True)
            
            if not summary:
                log.error("Error: no summary returned from chunk.")
                return "Summary Unavailable."
            return summary[0]["summary_text"]

        except Exception as e:
            log.error(f"Error summarizing chunk: {e}")
            return "Something went wrong, got Summary error: " + str(e)

    def summarize(self, text: str) -> str | None:
        if not text.strip():
            log.error("Input text provided was empty, please try again.")
            return None
            
        try:
            if len(text.split()) < self.chunk_size:
                return self.__summarize_chunk(text)
                
            log.info("Splitting text into chunks for summarization, please wait...")
            chunks = self.__make_chunks(text)
            summaries = [self.__summarize_chunk(chunk) for chunk in chunks]

            return " ".join(summaries)
            
        except Exception as e:
            log.error(f"Error processing request: {e}")
            return None