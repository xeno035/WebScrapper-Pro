# WebScraper Pro - Full Stack Application


WebScraper Pro is a comprehensive solution for web data extraction that transforms the tedious process of manually collecting information from websites into a streamlined, automated experience. Whether you're gathering product information from e-commerce sites, collecting news articles, or extracting job listings, this application provides the tools you need to efficiently harvest web data.

### Key Capabilities:
- **Intelligent Data Extraction**: Automatically identifies and extracts structured data using CSS selectors
- **Multi-Page Scraping**: Handles pagination to scrape multiple pages automatically
- **Flexible Configuration**: Customize scraping parameters, delays, and selectors for different websites
- **Data Export**: Download results in JSON or CSV formats for further analysis
- **Real-time Monitoring**: Track scraping progress and view comprehensive statistics
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

### Use Cases:
- **E-commerce Research**: Extract product prices, descriptions, and reviews
- **Content Aggregation**: Collect articles, blog posts, and news content
- **Market Analysis**: Gather competitor information and pricing data
- **Job Market Research**: Extract job listings and company information
- **Academic Research**: Collect data for research projects and analysis
- **Lead Generation**: Extract contact information and business details

## 🚀 Features

### Frontend (React)
- **Modern UI**: Beautiful gradient backgrounds and glass-morphism design
- **Configuration Panel**: Set target websites, scraping parameters, and CSS selectors
- **Results Dashboard**: View scraped data with statistics and export options
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Validation**: Form validation with error handling
- **Export Options**: Download data in JSON or CSV format

### Backend (Flask)
- **Smart Data Extraction**: Uses BeautifulSoup for HTML parsing with intelligent element matching
- **Multiple CSS Selectors**: Supports comma-separated selectors for better data coverage
- **Pagination Support**: Automatically handles common pagination patterns
- **Rate Limiting**: Configurable delays between requests to avoid being blocked
- **Error Handling**: Robust exception handling with detailed logging
- **CORS Support**: Configured for frontend integration
- **Health Check**: Built-in health monitoring endpoint

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 7.0.0** - Fast build tool and development server
- **React Router DOM 6.26.1** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Beautiful, customizable icons

### Backend
- **Python 3.8+** - Core programming language
- **Flask 2.3.3** - Lightweight web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **BeautifulSoup4 4.12.2** - HTML parsing and data extraction
- **Requests 2.31.0** - HTTP library for making requests
- **LXML 4.9.3** - Fast XML/HTML parser

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (version 16 or higher)
- **Python 3.8+**
- **npm** or **yarn** package manager
- **pip** (Python package installer)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webscrapper
   ```

2. **Setup Frontend**
   ```bash
   # Install frontend dependencies
   npm install
   ```

3. **Setup Backend**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install backend dependencies
   pip install -r requirements.txt
   
   # Return to root directory
   cd ..
   ```

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already activated)
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Mac/Linux

# Start the backend server
python run_server.py
```

The backend will be available at `http://localhost:5000`

### Start Frontend Development Server
```bash
# In a new terminal, from the root directory
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Alternative Backend Commands
```bash
# Method 2: Direct Flask execution
python app.py

# Method 3: Using Flask CLI
export FLASK_APP=app.py
flask run --host=0.0.0.0 --port=5000

# Method 4: Using Python module execution
python -m flask run --host=0.0.0.0 --port=5000
```

## 🏗️ Project Structure

```
webscrapper/
├── README.md              # This file
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── src/                   # Frontend source code
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   ├── index.css         # Global styles
│   └── pages/
│       ├── Config.tsx    # Configuration panel
│       └── Results.tsx   # Results dashboard
└── backend/              # Backend source code
    ├── app.py            # Main Flask application
    ├── run_server.py     # Server startup script
    ├── requirements.txt  # Python dependencies
    ├── test_scraper.py   # Unit tests
    └── scraper/
        ├── __init__.py   # Package initialization
        └── scraper_engine.py # Core scraping logic
```

## 🎯 Usage Guide

### 1. Configuration Setup
1. Open your browser and navigate to `http://localhost:5173`
2. You'll be redirected to the configuration page (`/config`)
3. Enter the target website URL
4. Set scraping parameters:
   - **Delay**: Time between requests (recommended: 1000-2000ms)
   - **Max Pages**: Number of pages to scrape
5. Configure CSS selectors:
   - **Title Selector**: For product names, article titles, etc.
   - **Price/Date Selector**: For prices, dates, or other metadata
   - **Description Selector**: For product descriptions, content summaries
6. Choose output format (JSON or CSV)
7. Click "Start Scraping" to begin the process

### 2. Viewing Results
1. After scraping completes, you'll be redirected to the results page
2. Review the statistics dashboard for scraping metrics:
   - Total items scraped
   - Data completeness percentage
   - Success rate metrics
   - Source website information
3. Browse the scraped data in the organized table
4. Export data using the download buttons:
   - **JSON Export**: Structured data format
   - **CSV Export**: Spreadsheet-compatible format

### 3. CSS Selector Tips
- Use multiple selectors separated by commas for better coverage
- Common patterns:
  - `.product-title, .product-name, h1, h2`
  - `.price, .cost, .amount, [class*="price"]`
  - `.description, .product-desc, .summary`
- Inspect the target website's HTML to find the right selectors

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

## 🔧 Development

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint for code quality
```

### Backend Development
```bash
# Development mode with auto-reload
export FLASK_ENV=development
export FLASK_DEBUG=1
python run_server.py

# Run tests
python test_scraper.py
```

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

## 🚀 Production Deployment

### Frontend Deployment
```bash
# Build the frontend
npm run build

# The build output will be in the `dist/` directory
# Deploy to any static hosting service:
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3
```

### Backend Deployment

#### Using Gunicorn (Recommended)
```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Using Waitress (Windows)
```bash
# Install Waitress
pip install waitress

# Run with Waitress
waitress-serve --host=0.0.0.0 --port=5000 app:app
```

#### Docker Deployment
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

1. **Backend not starting**
   ```bash
   # Check if virtual environment is activated
   which python  # Should show venv path
   
   # Check if dependencies are installed
   pip list
   
   # Check if port 5000 is available
   lsof -i :5000
   ```

2. **Frontend not connecting to backend**
   - Ensure backend is running on `http://localhost:5000`
   - Check CORS configuration in backend
   - Verify API endpoint in frontend code

3. **Scraping not working**
   - Check target website accessibility
   - Verify CSS selectors are correct
   - Review browser console for errors
   - Check backend logs for detailed error messages

### Debug Commands

```bash
# Test backend health
curl -X GET http://localhost:5000/api/health

# Test scraping endpoint
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","selectors":{"title":"h1","price":"","description":""}}'

# Check Python version
python --version

# Check Node.js version
node --version
```

## 🔒 Security Features

- **Frontend**: Input validation, URL sanitization, error handling
- **Backend**: User-Agent rotation, request headers spoofing, rate limiting, timeout protection
- **API**: CORS configuration, input validation, comprehensive error handling

## 📊 Logging & Monitoring

- **Backend**: Comprehensive logging with INFO, WARNING, and ERROR levels
- **Frontend**: Console logging for debugging and error tracking
- **Health Check**: Built-in endpoint for monitoring backend status



**Note**: This is a full-stack application requiring both frontend and backend services to be running for full functionality. Make sure both services are properly configured and running.