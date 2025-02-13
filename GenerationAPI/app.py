from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import TextSummarizer

app = Flask(__name__)
#Temporarily enable CORS for all routes
CORS(app)

summarizer = TextSummarizer()

@app.route("/status", methods=["GET"])
def status():
    return jsonify({"status": "Server is running."})


@app.route("/summarize", methods=["POST"])
def summarize():
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
    app.run(host="0.0.0.0", port=3003)
