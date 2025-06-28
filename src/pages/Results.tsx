import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Globe, 
  Database, 
  FileText,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface ScrapedItem {
  'product-title': string;
  price: string;
  description: string;
}

interface ScrapingConfig {
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

const Results = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ScrapedItem[]>([]);
  const [config, setConfig] = useState<ScrapingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const scraped = localStorage.getItem('scrapedData');
    const scrapingConfig = localStorage.getItem('scrapingConfig');
    
    if (scraped) {
      setData(JSON.parse(scraped));
    }
    
    if (scrapingConfig) {
      setConfig(JSON.parse(scrapingConfig));
    }
    
    setIsLoading(false);
  }, []);

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scraped_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (data.length === 0) return;
    
    const headers = ['Title', 'Price/Date', 'Description'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${(item['product-title'] || '').replace(/"/g, '""')}"`,
        `"${(item.price || '').replace(/"/g, '""')}"`,
        `"${(item.description || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scraped_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const totalItems = data.length;
    const itemsWithTitle = data.filter(item => item['product-title']?.trim()).length;
    const itemsWithPrice = data.filter(item => item.price?.trim()).length;
    const itemsWithDescription = data.filter(item => item.description?.trim()).length;
    
    return {
      total: totalItems,
      completeness: totalItems > 0 ? Math.round(((itemsWithTitle + itemsWithPrice + itemsWithDescription) / (totalItems * 3)) * 100) : 0,
      withTitle: itemsWithTitle,
      withPrice: itemsWithPrice,
      withDescription: itemsWithDescription
    };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Scraping Results</h1>
                <p className="text-sm text-slate-600">
                  {config ? `From ${new URL(config.url).hostname}` : 'Extracted Data'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/config')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Config</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Items</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Data Completeness</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.completeness}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-emerald-500" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.total > 0 ? Math.round((stats.withTitle / stats.total) * 100) : 0}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Source</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {config ? new URL(config.url).hostname.replace('www.', '') : 'Unknown'}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Configuration Summary */}
          {config && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Scraping Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Target URL</p>
                  <p className="font-medium text-slate-900 truncate">{config.url}</p>
                </div>
                <div>
                  <p className="text-slate-600">Pages Scraped</p>
                  <p className="font-medium text-slate-900">{config.maxPages}</p>
                </div>
                <div>
                  <p className="text-slate-600">Delay</p>
                  <p className="font-medium text-slate-900">{config.delay}ms</p>
                </div>
                <div>
                  <p className="text-slate-600">Output Format</p>
                  <p className="font-medium text-slate-900">{config.output.toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownloadJSON}
              disabled={data.length === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={data.length === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-5 w-5" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh Data</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
            <div className="p-6 border-b border-slate-200/60">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Extracted Data</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>{data.length} items found</span>
                </div>
              </div>
            </div>

            {data.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium">No data found</p>
                <p className="text-slate-500">The scraping operation didn't return any results. Try adjusting your CSS selectors or target URL.</p>
                <button
                  onClick={() => navigate('/config')}
                  className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200"
                >
                  Adjust Configuration
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">#</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Price/Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="font-medium text-slate-900 truncate">
                              {item['product-title'] || item.title || '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-slate-900 truncate">
                              {item.price || '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <p className="text-slate-600 text-sm line-clamp-2">
                              {item.description || '-'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;