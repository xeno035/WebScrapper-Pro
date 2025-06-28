import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Settings, 
  Play, 
  Clock, 
  Code, 
  Download,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FormData {
  url: string;
  delay: number;
  maxPages: number;
  selectors: {
    title: string;
    price: string;
    description: string;
  };
  output: string;
}

const Config = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    url: '',
    delay: 1000,
    maxPages: 10,
    selectors: {
      title: '.product-title',
      price: '.price',
      description: '.description'
    },
    output: 'json'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in formData.selectors) {
      setFormData({
        ...formData,
        selectors: { ...formData.selectors, [name]: value }
      });
    } else {
      setFormData({ 
        ...formData, 
        [name]: name === 'delay' || name === 'maxPages' ? parseInt(value) || 0 : value 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('scrapedData', JSON.stringify(data));
      localStorage.setItem('scrapingConfig', JSON.stringify(formData));
      navigate('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during scraping');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">WebScraper Pro</h1>
              <p className="text-sm text-slate-600">Configuration Panel</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Why copy and paste
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              When you can automate and extract
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Set up your target website, CSS selectors, and extraction preferences to begin automated data collection.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Scraping Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Main Configuration Form */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Scraping Configuration</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Target URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target URL *
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com/products"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Scraping Parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Delay (ms)
                  </label>
                  <input
                    type="number"
                    name="delay"
                    value={formData.delay}
                    onChange={handleChange}
                    min="100"
                    max="10000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Pages
                  </label>
                  <input
                    type="number"
                    name="maxPages"
                    value={formData.maxPages}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* CSS Selectors */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  CSS Selectors
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title Selector
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.selectors.title}
                    onChange={handleChange}
                    placeholder=".product-title, h1, .headline"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price/Date Selector
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.selectors.price}
                    onChange={handleChange}
                    placeholder=".price, .cost, .date"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description Selector
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.selectors.description}
                    onChange={handleChange}
                    placeholder=".description, .summary, .content"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Download className="h-4 w-4 inline mr-1" />
                  Output Format
                </label>
                <select
                  name="output"
                  value={formData.output}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.url}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Scraping in Progress...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Start Scraping</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Config;