
import re

class TextSummarizer:
    def __init__(self, model_name='facebook/bart-large-cnn', min_ratio=0.5, max_ratio=0.8, chunk_size=600):
        self.summarizer = pipeline("summarization", model=model_name, framework='pt')
        #ratios are used to decide the min and max length of the response i.e. 0.8 will set max_length to 80% of input
        self.min_ratio = min_ratio
        self.max_ratio = max_ratio
        #number of tokens per chunk when text input exceeds model maximum and needs to be split -- default 600, model max 1024 tokens
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
                        end = i +from transformers import pipeline 1
                        break

            chunk = " ".join(words[start:end]) 
            chunks.append(chunk)
            start = end
        return chunks  


    def __summarize_chunk(self, chunk):
        num_words = len(chunk.split())
        #if the ratio applied to input is less that 20 words, set it to 20
        minimum = max(20, int(self.min_ratio * num_words))
        #if the ratio applied to input is more than 800 words, set to 800
        maximum = min(800, int(self.max_ratio * num_words))

        print('\nsummarizing:\n', chunk)
        try:
            summary = self.summarizer(
                chunk,
                max_length=maximum, min_length=minimum,
                truncation=True)
            
            if not summary:
                print("Error: no summary returned from chunk.")
                return "Summary Unavailable."
            return summary[0]["summary_text"]
        except:
            return "Summary Error"  


    def summarize_text(self, text):
        # if the text is shorter than the chunk size, summarize it without splitting into chunks
        if len(text.split()) < self.chunk_size:
            return self.__summarize_chunk(text)
        print('\nsplitting text\n')
        #else split the text into smaller chunks to not exceed max input or overwhelm the model
        chunks = self.__make_chunks(text)
        #summarize each chunk in the chunks list
        summaries = [self.__summarize_chunk(chunk) for chunk in chunks]
        #join and return the summaries
        return " ".join(summaries)