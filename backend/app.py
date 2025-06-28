from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper.scraper_engine import scrape_data
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Allow CORS for frontend requests

@app.route('/api/scrape', methods=['POST'])
def scrape():
    try:
        data = request.json
        logger.info(f"Received scraping request: {data}")

        # Extract parameters from request
        url = data.get('url')
        delay = int(data.get('delay', 1000))
        max_pages = int(data.get('maxPages', 1))
        selectors = data.get('selectors', {})
        output_format = data.get('output', 'json')

        # Validate required parameters
        if not url:
            return jsonify({'error': 'URL is required'}), 400

        # Extract individual selectors
        selector_list = [
            selectors.get('title', ''),
            selectors.get('price', ''),
            selectors.get('description', '')
        ]

        # Validate selectors
        if not any(selector_list):
            return jsonify({'error': 'At least one CSS selector is required'}), 400

        logger.info(f"Starting scraping for URL: {url}")
        result = scrape_data(url, selector_list, delay, max_pages)
        
        logger.info(f"Scraping completed. Found {len(result)} items")
        return jsonify(result)

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Scraping error: {str(e)}")
        return jsonify({'error': f'Scraping failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'WebScraper API is running'})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)