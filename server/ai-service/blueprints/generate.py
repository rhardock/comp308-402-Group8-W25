# External (Imports)
from flask import jsonify, Response, request
from flask_smorest import Blueprint
from werkzeug.utils import secure_filename
import fitz
import io

# Internal (Imports)
import os
import sys
import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.rich_logging import logger as log
from models.generator import QuestionGenerator
from lib.sanitizer import sanitize_text

generate_bp = Blueprint("generate", __name__, url_prefix="/api/v1", description="API endpoints for generating questions and answers from text or PDF.")

# Helper functions
def parse_page_range(page_range):
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
    text = ""
    for page_num in page_numbers:
        if 0 <= page_num - 1 < len(pdf_doc):  # NOTE: PDF pages are 0-indexed
            page = pdf_doc[page_num - 1]
            text += page.get_text()
    return text

@generate_bp.route("/qa-raw", methods=["POST"])
def generate_qa_raw() -> tuple[Response, int]:
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
        
        # Sanitize input text
        sanitized_text = sanitize_text(text)
        
        # Generate questions
        question_generator = QuestionGenerator()
        questions = question_generator.generate(sanitized_text)
        
        if not questions:
            return jsonify({
                "error": "Failed to generate questions",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 500
        
        return jsonify({
            "response": questions,
            "model": question_generator.params.model,
            "temperature": question_generator.params.temperature,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    
    except Exception as e:
        log.error(f"Error processing request: {str(e)}")
        return jsonify({
            "error": f"An unexpected error occurred: {str(e)}",
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 500

@generate_bp.route("/qa-pdf", methods=["POST"])
def generate_qa_pdf() -> tuple[Response, int]:
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
        
        # Sanitize extracted text
        sanitized_text = sanitize_text(extracted_text)
        
        # Generate questions
        question_generator = QuestionGenerator()
        questions = question_generator.generate(sanitized_text)
        
        if not questions:
            return jsonify({
                "error": "Failed to generate questions",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }), 500
        
        return jsonify({
            "response": questions,
            "pages_processed": page_numbers,
            "model": question_generator.params.model,
            "temperature": question_generator.params.temperature,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    
    except Exception as e:
        log.error(f"Error processing request: {str(e)}")
        return jsonify({
            "error": f"An unexpected error occurred: {str(e)}",
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }), 500