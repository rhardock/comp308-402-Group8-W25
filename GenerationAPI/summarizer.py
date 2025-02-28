from transformers import pipeline
import re

class TextSummarizer:
    def __init__(self, model_name='facebook/bart-large-cnn', min_ratio=0.5, max_ratio=0.8, chunk_size=600):
        self.summarizer = pipeline("summarization", model=model_name, framework='pt')
        self.min_ratio = min_ratio
        self.max_ratio = max_ratio
        #number of tokens per chunk when text input exceeds model maximum and needs to be split -- default 800, model max 1024 tokens
        self.chunk_size = chunk_size   

    #split text into chunks to improve model accuracy and meet maximum input requirements
    #splitting by words instead of tokens to improve processing speed
    def __make_chunks(self, text):
        words = text.split()  
        num_words = len(words)
        chunks = []
        start = 0
        sentence_endings = re.compile(r'[\.\?\!]')

        while start < num_words:
            end = min(start + self.chunk_size, num_words)
            #prevent cutting sentences in half
            if end < num_words:
                for i in range(end, start, -1):
                    if sentence_endings.match(words[i][-1]):  
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

        print('\nsummarizing:\n', chunk)
        try:

            summary = self.summarizer(chunk,
                                    max_length=maximum, min_length=minimum,
                                    truncation=True)
            if not summary:
                print("Error: no summary returned from chunk.")
                return "Summary Unavailable."
            return summary[0]["summary_text"]
        except:
            return "Summary Error"  


    def summarize_text(self, text):
        #print("Input text: ", text)
        if len(text.split()) < self.chunk_size:
            return self.__summarize_chunk(text)
        print('\nsplitting text\n')
        chunks = self.__make_chunks(text)
        summaries = [self.__summarize_chunk(chunk) for chunk in chunks]
        return " ".join(summaries)