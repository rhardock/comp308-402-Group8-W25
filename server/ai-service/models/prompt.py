from pydantic import BaseModel, Field
from typing import List
from enum import Enum

USER_PROMPT_FORMAT = """
Professional Question-Answer Pair Generation Prompt

Objective:
Generate high-quality, semantically rich question-answer pairs from a given text input.

Input Requirements:
- **Text Source**: Provide the full text to be analyzed
- **Format**: Plain text, markdown, or any readable text format

AI Task Instructions:
1. Carefully analyze the entire text for key information
2. Generate questions that:
   - Capture the core concepts and main ideas
   - Demonstrate different levels of complexity
   - Cover various aspects of the text (factual, inferential, contextual)
3. Craft answers that are:
   - Concise and precise
   - Directly extracted from the source text
   - Grammatically complete
   - Easily understandable

Output Specifications:
- **Format**: Strict JSON array of objects
- **Structure**: 
  ```json
  [
    {
      "question": "Specific question text",
      "answer": "Concise answer text derived from source"
    },
    ...
  ]
  ```

Constraints:
- Generate between 5-10 question-answer pairs
- Ensure no verbatim copying of text
- Maintain semantic accuracy
- Prioritize clarity and relevance

DO's:
- Use varied question types (who, what, when, where, why, how)
- Reflect the text's original intent
- Maintain objectivity
- Cover different knowledge depths

DON'Ts:
- Do not fabricate information
- Avoid questions that cannot be directly answered from the text
- Do not use overly complex language
- Prevent introducing external context not present in the source text

Quality Metrics:
- Relevance Score: Each Q&A pair should have >80% relevance to source text
- Comprehension Coverage: Aim to represent >70% of key text concepts
- Answer Precision: Answers must be <50 words

Example Input Processing:
```
Input Text: "Java is a popular programming language developed by Sun Microsystems in 1995. It is object-oriented and can run on multiple platforms."

Expected Output:
[
  {
    "question": "Who developed Java?", 
    "answer": "Sun Microsystems developed Java in 1995."
  },
  {
    "question": "What are key characteristics of Java?", 
    "answer": "Java is object-oriented and platform-independent."
  }
]
```

Additional Guidance:
- When processing technical or specialized texts, maintain domain-specific terminology
- For academic or research texts, ensure technical accuracy
- For narrative texts, capture key plot points and character insights
"""

class Models(str, Enum):
    GEMINI_PRO = "google/gemini-1.5-pro"
    GEMINI_FLASH = "google/gemini-1.5-flash"
    GEMINI_ULTRA = "google/gemini-1.0-ultra"
    GEMINI = "google/gemini-1.0"


class Params(BaseModel):
    model: str = Models.GEMINI_FLASH
    temperature: float = Field(
        0.5,
        description="Controls the randomness of the generated text. Lower values is "
                    "more random, while higher values is more deterministic.",
        ge=0.0,
        le=1.0
    )
    max_tokens: int = Field(1000, gt=0)
    top_p: float = Field(1.0, ge=0.0, le=1.0)
    frequency_penalty: float = Field(0.0, ge=-2.0, le=2.0)
    presence_penalty: float = Field(0.0, ge=-2.0, le=2.0)
    stop: List[str] = Field(default_factory=list)
    n: int = Field(1, gt=0)
    stream: bool = False


class Prompt(BaseModel):
    params: Params
    user_prompt: str | None = USER_PROMPT_FORMAT
    system_prompt: str | None = None
