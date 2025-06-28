import requests
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import logging
import re

logger = logging.getLogger(__name__)

def scrape_data(base_url, selectors, delay=1000, max_pages=1):
    """
    Scrape data from a website using provided CSS selectors
    
    Args:
        base_url (str): The target URL to scrape
        selectors (list): List of CSS selectors [title, price, description]
        delay (int): Delay between requests in milliseconds
        max_pages (int): Maximum number of pages to scrape
    
    Returns:
        list: List of dictionaries containing scraped data
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }

    results = []
    session = requests.Session()
    session.headers.update(headers)

    for page in range(1, max_pages + 1):
        # Handle different pagination patterns
        url = generate_page_url(base_url, page)
        logger.info(f"Scraping page {page}: {url}")

        try:
            response = session.get(url, timeout=30)
            response.raise_for_status()
            
            # Check if we got a valid response
            if response.status_code != 200:
                logger.warning(f"Received status code {response.status_code} for {url}")
                continue

        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed for {url}: {str(e)}")
            continue

        # Parse the HTML content
        try:
            soup = BeautifulSoup(response.text, 'html.parser')
            page_results = extract_data_from_page(soup, selectors)
            
            if not page_results:
                logger.warning(f"No data found on page {page}. Stopping pagination.")
                break
                
            results.extend(page_results)
            logger.info(f"Found {len(page_results)} items on page {page}")

        except Exception as e:
            logger.error(f"Failed to parse page {page}: {str(e)}")
            continue

        # Respect delay between requests
        if page < max_pages:
            time.sleep(delay / 1000.0)

    logger.info(f"Scraping completed. Total items found: {len(results)}")
    return results

def generate_page_url(base_url, page_num):
    """
    Generate URL for different page numbers based on common pagination patterns
    """
    if page_num == 1:
        return base_url
    
    # Common pagination patterns
    patterns = [
        f"{base_url}?page={page_num}",
        f"{base_url}&page={page_num}",
        f"{base_url}/page/{page_num}",
        f"{base_url}?p={page_num}",
        f"{base_url}&p={page_num}",
    ]
    
    # If URL already has query parameters, use & instead of ?
    if '?' in base_url:
        return f"{base_url}&page={page_num}"
    else:
        return f"{base_url}?page={page_num}"

def extract_data_from_page(soup, selectors):
    """
    Extract data from a single page using CSS selectors
    """
    title_selector, price_selector, description_selector = selectors
    results = []

    # Find all elements matching the title selector (primary selector)
    title_elements = []
    if title_selector:
        for selector in title_selector.split(','):
            title_elements.extend(soup.select(selector.strip()))

    if not title_elements:
        logger.warning("No title elements found with provided selector")
        return results

    # For each title element, try to find corresponding price and description
    for i, title_elem in enumerate(title_elements):
        item_data = {
            'product-title': clean_text(title_elem.get_text()) if title_elem else '',
            'price': '',
            'description': ''
        }

        # Try to find price element
        if price_selector:
            price_elem = find_related_element(soup, title_elem, price_selector, i)
            if price_elem:
                item_data['price'] = clean_text(price_elem.get_text())

        # Try to find description element
        if description_selector:
            desc_elem = find_related_element(soup, title_elem, description_selector, i)
            if desc_elem:
                item_data['description'] = clean_text(desc_elem.get_text())

        # Only add item if it has at least a title
        if item_data['product-title']:
            results.append(item_data)

    return results

def find_related_element(soup, reference_elem, selector, index):
    """
    Find an element related to the reference element using various strategies
    """
    if not selector:
        return None

    # Strategy 1: Find by index (same position in the list)
    try:
        for sel in selector.split(','):
            elements = soup.select(sel.strip())
            if index < len(elements):
                return elements[index]
    except:
        pass

    # Strategy 2: Find within the same parent container
    try:
        parent = reference_elem.find_parent()
        if parent:
            for sel in selector.split(','):
                elem = parent.select_one(sel.strip())
                if elem:
                    return elem
    except:
        pass

    # Strategy 3: Find the next sibling matching the selector
    try:
        for sibling in reference_elem.find_next_siblings():
            for sel in selector.split(','):
                if sibling.select(sel.strip()):
                    return sibling.select_one(sel.strip())
    except:
        pass

    return None

def clean_text(text):
    """
    Clean and normalize extracted text
    """
    if not text:
        return ''
    
    # Remove extra whitespace and newlines
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove common unwanted characters
    text = text.replace('\n', ' ').replace('\t', ' ').replace('\r', ' ')
    
    # Limit length to prevent extremely long descriptions
    if len(text) > 500:
        text = text[:500] + '...'
    
    return text