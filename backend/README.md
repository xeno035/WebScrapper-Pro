# WebScraper Pro - Backend

A Flask-based backend API for the WebScraper Pro application that provides intelligent web scraping capabilities. Built with Python, Flask, and BeautifulSoup, this backend handles the actual web scraping operations and serves data to the React frontend.

## 🚀 Features

- **Smart Data Extraction**: Uses BeautifulSoup for HTML parsing with intelligent element matching
- **Multiple CSS Selectors**: Supports comma-separated selectors for better data coverage
- **Pagination Support**: Automatically handles common pagination patterns
- **Rate Limiting**: Configurable delays between requests to avoid being blocked
- **Error Handling**: Robust exception handling with detailed logging
- **CORS Support**: Configured for frontend integration
- **Health Check**: Built-in health monitoring endpoint

## 🛠️ Tech Stack

- **Python 3.8+** - Core programming language
- **Flask 2.3.3** - Lightweight web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **BeautifulSoup4 4.12.2** - HTML parsing and data extraction
- **Requests 2.31.0** - HTTP library for making requests
- **LXML 4.9.3** - Fast XML/HTML parser

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Setup Instructions

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## 🏃‍♂️ Running the Backend

### Method 1: Using the run_server.py script (Recommended)
```bash
# Make sure your virtual environment is activated
python run_server.py
```

### Method 2: Direct Flask execution
```bash
# Make sure your virtual environment is activated
python app.py
```

### Method 3: Using Flask CLI
```bash
# Make sure your virtual environment is activated
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5000
```

### Method 4: Using Python module execution
```bash
# Make sure your virtual environment is activated
python -m flask run --host=0.0.0.0 --port=5000
```

## 🌐 Server Information

Once running, the backend will be available at:
- **Server URL**: `http://localhost:5000`
- **API Endpoint**: `http://localhost:5000/api/scrape`
- **Health Check**: `http://localhost:5000/api/health`

## 📡 API Endpoints

### POST /api/scrape
Scrape data from a target website.

**Request Body:**
```json
{
  "url": "https://example.com/products",
  "delay": 1000,
  "maxPages": 2,
  "selectors": {
    "title": ".product-title, h1, .headline",
    "price": ".price, .cost, .amount",
    "description": ".description, .summary, .content"
  },
  "output": "json"
}
```

**Response:**
```json
[
  {
    "product-title": "Sample Product",
    "price": "$29.99",
    "description": "Product description here..."
  }
]
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "WebScraper API is running"
}
```

## 🏗️ Project Structure

```
backend/
├── app.py                 # Main Flask application
├── run_server.py          # Server startup script
├── requirements.txt       # Python dependencies
├── test_scraper.py        # Unit tests
└── scraper/
    ├── __init__.py        # Package initialization
    └── scraper_engine.py  # Core scraping logic
```

## ⚙️ Configuration

### Environment Variables
- `FLASK_ENV`: Set to `development` for debug mode
- `FLASK_PORT`: Port number (default: 5000)

### Scraping Parameters
- **delay**: Delay between requests in milliseconds (default: 1000)
- **maxPages**: Maximum number of pages to scrape (default: 1)
- **selectors**: CSS selectors for data extraction

## 🔄 Pagination Support

The scraper automatically tries common pagination patterns:
- `?page=N`
- `&page=N`
- `/page/N`
- `?p=N`
- `&p=N`

## 🛡️ Error Handling

The API includes comprehensive error handling for:
- Invalid URLs
- Network timeouts
- Parsing errors
- Missing selectors
- Rate limiting

## 📊 Logging

All scraping activities are logged with different levels:
- **INFO**: General operation status
- **WARNING**: Non-critical issues
- **ERROR**: Failed operations

## 🔒 Security Features

- User-Agent rotation
- Request headers spoofing
- Rate limiting
- Timeout protection
- Input validation

## 🧪 Testing

Run the test suite:
```bash
# Make sure your virtual environment is activated
python test_scraper.py
```

## 🔧 Development

### Development Mode
```bash
# Set environment variables
export FLASK_ENV=development
export FLASK_DEBUG=1

# Run with auto-reload
python run_server.py
```

### Debug Mode
```bash
# Run with detailed logging
python -c "
import logging
logging.basicConfig(level=logging.DEBUG)
from app import app
app.run(debug=True, host='0.0.0.0', port=5000)
"
```

## 🚀 Production Deployment

### Using Gunicorn (Recommended)
```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Waitress (Windows)
```bash
# Install Waitress
pip install waitress

# Run with Waitress
waitress-serve --host=0.0.0.0 --port=5000 app:app
```

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   # Kill the process
   kill -9 <PID>
   ```

2. **Virtual environment not activated**
   ```bash
   # Check if venv is active (should show venv path)
   which python
   # Activate if needed
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Dependencies not installed**
   ```bash
   pip install -r requirements.txt
   ```

4. **CORS issues with frontend**
   - Ensure Flask-CORS is properly configured
   - Check that frontend is making requests to correct URL

### Debug Commands

```bash
# Check Python version
python --version

# Check installed packages
pip list

# Test API endpoint
curl -X GET http://localhost:5000/api/health

# Test scraping endpoint
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","selectors":{"title":"h1","price":"","description":""}}'
```

## 📈 Performance Optimization

- Use connection pooling for multiple requests
- Implement caching for repeated requests
- Consider using async/await for better concurrency
- Monitor memory usage during large scraping operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the logs for error messages
- Verify the target website is accessible
- Test with simple selectors first
- Ensure the frontend is properly configured

---

**Note**: This backend is designed to work with the React frontend. Make sure both services are running for full functionality. 