#!/usr/bin/env python3
"""
Simple script to run the Flask development server
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

if __name__ == '__main__':
    print("🚀 Starting WebScraper Pro Backend...")
    print("📍 Server will be available at: http://localhost:5000")
    print("🔗 API endpoint: http://localhost:5000/api/scrape")
    print("💡 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        use_reloader=True
    )