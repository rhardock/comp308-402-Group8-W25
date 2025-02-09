from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
#Temporarily enable CORS for all routes
CORS(app)

@app.route("/status", methods=["GET"])
def status():
    return jsonify({"status": "Server is running."})

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    text = data.get("text")

    if not text: 
        return jsonify({"error": "No text provided"}), 400
    #mock summary, returns half the text provided
    summary = text[0:(len(text) // 2)]
    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3003)
