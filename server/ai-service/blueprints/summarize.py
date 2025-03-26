# Internal Dependencies (Imports)
import os
import sys
import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.rich_logging import logger as log
from models.summarizer import TextSummarizer
from lib.sanitizer import sanitize_text

# External Dependencies (Imports)
from flask import request, jsonify, Response
from flask_smorest import Blueprint
import fitz
import io

summarize_bp = Blueprint("summarize", __name__, url_prefix="/api/v1", description="API endpoints for text summarization.")

def parse_page_range(page_range):
    """Parse page range string (e.g., '1-5,7,9-11') into a list of page numbers."""
    page_numbers = []
    parts = page_range.split(',')
    
    for part in parts:
        if '-' in part:
            start, end = map(int, part.split('-'))
            page_numbers.extend(range(start, end + 1))
        else:
            page_numbers.append(int(part))
    
    return page_numbers


def extract_text_from_pdf(pdf_doc, page_numbers):
    """Extract text from specific pages of a PDF document."""
    text = ""
    for page_num in page_numbers:
        if 0 <= page_num - 1 < len(pdf_doc):  # PDF pages are 0-indexed
            page = pdf_doc[page_num - 1]
            text += page.get_text()
    return text


@summarize_bp.route("/summarize-raw", methods=["POST"])
def summarize_raw() -> tuple[Response, int]:
    try:
        data = request.json
        
        if not data or "text" not in data:
            log.error("No text was provided in the request body.")
            return jsonify({
                "error": "Missing text field in request",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 400
        
        text = data.get("text", "").strip()
        if not text:
            log.error("Empty text was provided.")
            return jsonify({
                "error": "Text cannot be empty",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 400
        sanitized_text = sanitize_text(text)
        text_summarizer = TextSummarizer()
        summary = text_summarizer.summarize(sanitized_text)
        
        if not summary:
            return jsonify({
                "error": "Failed to generate summary",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 500
        
        return jsonify({
            "summary": summary,
            "model": text_summarizer.params.model,
            "temperature": text_summarizer.params.temperature,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    
    except Exception as e:
        log.error(f"Error processing request: {str(e)}")
        return jsonify({
            "error": f"An unexpected error occurred: {str(e)}",
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 500


@summarize_bp.route("/summarize-pdf", methods=["POST"])
def summarize_pdf() -> tuple[Response, int]:
    try:
        if "file" not in request.files:
            log.error("No file was uploaded.")
            return jsonify({
                "error": "No file uploaded",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 400
        
        file = request.files["file"]
        if file.filename == "":
            log.error("Empty filename was provided.")
            return jsonify({
                "error": "No file selected",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 400

        if not file.filename.lower().endswith('.pdf'):
            log.error("Invalid file format. Only PDF files are supported.")
            return jsonify({
                "error": "Only PDF files are supported",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 400

        pages = request.form.get("pages", "1-5")
        page_numbers = parse_page_range(pages)

        try:
            pdf_doc = fitz.open(stream=io.BytesIO(file.read()), filetype="pdf")
            log.info(f"PDF opened successfully. Total pages: {len(pdf_doc)}")
        except Exception as e:
            log.error(f"Failed to open PDF: {str(e)}")
            return jsonify({
                "error": f"Failed to open PDF: {str(e)}",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 500

        extracted_text = extract_text_from_pdf(pdf_doc, page_numbers)
        
        if not extracted_text.strip():
            log.error(f"No text extracted from pages {pages}.")
            return jsonify({
                "error": f"No text could be extracted from the specified pages ({pages})",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 400

        sanitized_text = sanitize_text(extracted_text)
        text_summarizer = TextSummarizer()
        summary = text_summarizer.summarize(sanitized_text)
        
        if not summary:
            return jsonify({
                "error": "Failed to generate summary",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 500
        
        return jsonify({
            "summary": summary,
            "pages_processed": page_numbers,
            "model": text_summarizer.params.model,
            "temperature": text_summarizer.params.temperature,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    
    except Exception as e:
        log.error(f"Error processing request: {str(e)}")
        return jsonify({
            "error": f"An unexpected error occurred: {str(e)}",
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 500

@summarize_bp.route("/supported-types", methods=["GET"])
def supported_types() -> tuple[Response, int]:
    log.info("SERVE: /api/v1/summarize/supported-types GET (supported types route)")
    return jsonify({
        "supported_types": {
            "files": ["pdf"],
            "data": ["text", "json"]
        },
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }), 200
