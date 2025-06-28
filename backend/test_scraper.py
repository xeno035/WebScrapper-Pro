#!/usr/bin/env python3
"""
Test script to verify the scraper is working
"""
import requests
import json

def test_scraper():
    url = "http://localhost:5000/api/scrape"
    
    # Test data for webscraper.io test site
    test_data = {
        "url": "https://webscraper.io/test-sites/e-commerce/static",
        "delay": 1000,
        "maxPages": 1,
        "selectors": {
            "title": ".title",
            "price": ".price", 
            "description": ".description"
        },
        "output": "json"
    }
    
    try:
        print("🧪 Testing scraper endpoint...")
        print(f"📡 Sending request to: {url}")
        print(f"📦 Payload: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(url, json=test_data, timeout=30)
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data)} items")
            
            # Show first few items
            for i, item in enumerate(data[:3]):
                print(f"\n📄 Item {i+1}:")
                print(f"  Title: {item.get('product-title', 'N/A')}")
                print(f"  Price: {item.get('price', 'N/A')}")
                print(f"  Description: {item.get('description', 'N/A')[:100]}...")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the Flask server is running on port 5000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_scraper()