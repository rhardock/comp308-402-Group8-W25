import os
import sys
import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.rich_logging import logger as log

from flask import jsonify, Response
from flask_smorest import Blueprint

"""
File: general.py
Description:
    - This file contains general API endpoints for the backend application.
    
License: MIT License
Copyright (c) 2024 Turing Sandbox
"""

general_bp = Blueprint("general", __name__, url_prefix="/api/v1", description="General API endpoints for backend.")

@general_bp.route("/root", methods=["GET"])
def root() -> tuple[Response, int]:
    log.info("SERVE: /api/v1/info GET (info route)")
    return jsonify({
        "status": 200,
        "message": "API is working and ready to serve.",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }), 200

@general_bp.route("/health", methods=["GET"])
def info() -> tuple[Response, int]:
    log.info("SERVE: /api/v1/health GET (health route)")
    return jsonify({
        "status": 200,
        "message": "API is healthy and working as expected.",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }), 200