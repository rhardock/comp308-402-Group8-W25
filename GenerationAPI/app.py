from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import TextSummarizer
import fitz
import io
from pdfProcessing import extract_text_from_pdf, parse_page_range

app = Flask(__name__)
#Temporarily enable CORS for all routes
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

summarizer = TextSummarizer()

@app.route("/status", methods=["GET"])
def status():
    return jsonify({"status": "Server is running."})


@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        pages = request.form.get("pages", "1-5")  
        page_numbers = parse_page_range(pages)
        pdf_doc = fitz.open(stream=io.BytesIO(file.read()), filetype="pdf")
        print(len(pdf_doc))
        extracted_text = extract_text_from_pdf(pdf_doc, page_numbers)

        summary = summarizer.summarize_text(extracted_text)
        
        return jsonify({"summary": summary}), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

     
@app.route("/summarizeraw", methods=["POST"])
def summarize_raw():
    try:
        data = request.json
        if not data or "text" not in data:
            return jsonify({"error": "Missing text field in request"}), 400
        
        text = data.get("text", "").strip()
        if not text:
            return jsonify({"error": "Text can not be empty."}), 400
        
        summary = summarizer.summarize_text(text)
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3003, debug=True)
