import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Filter 
} from 'lucide-react';
import { 
  getSearchAnalytics, 
  clearSearchAnalytics, 
  SearchAnalyticsRecord 
} from '../../services/searchConfig';

export const AdminSearchAnalyticsTab: React.FC = () => {
  const [records, setRecords] = useState<SearchAnalyticsRecord[]>([]);

  const loadData = async () => {
    setRecords(await getSearchAnalytics());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear search query logs?')) {
      await clearSearchAnalytics();
      setRecords([]);
    }
  };

  // Group top queries
  const topQueries = React.useMemo(() => {
    const counts: Record<string, { count: number; lastResultCount: number }> = {};
    for (const r of records) {
      const q = r.query.toLowerCase();
      if (!counts[q]) {
        counts[q] = { count: 0, lastResultCount: r.resultCount };
      }
      counts[q].count += 1;
    }
    return Object.entries(counts)
      .map(([query, data]) => ({ query, count: data.count, results: data.lastResultCount }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [records]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="font-extrabold text-sm text-[#561269] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#FF6B00]" />
            <span>Search Intelligence & Demand Analytics</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real customer search queries, autocomplete engagement, and component discovery trends
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Search Logs</span>
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-500 text-xs">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700">No search activity recorded yet</p>
          <p className="text-[11px] text-slate-400 mt-1">
            As customers search for electronic components in the search bar, terms will populate here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Queries Row */}
          {topQueries.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Trending & Frequent Search Terms</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {topQueries.map((t) => (
                  <div
                    key={t.query}
                    className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs"
                  >
                    <span className="font-bold text-slate-900">{t.query}</span>
                    <span className="bg-[#561269]/10 text-[#561269] px-1.5 py-0.2 rounded-xs text-[10px] font-bold">
                      {t.count} searches
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      ({t.results} items)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Queries Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Recent Search Logs ({records.length})</span>
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Time</th>
                    <th className="p-2.5">Customer Query</th>
                    <th className="p-2.5">Normalized</th>
                    <th className="p-2.5 text-center">Results Found</th>
                    <th className="p-2.5">Clicked Product</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.slice(0, 15).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-2.5 font-bold text-slate-900">{r.query}</td>
                      <td className="p-2.5 font-mono text-[11px] text-slate-500">{r.normalizedQuery}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            r.resultCount > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.resultCount} items
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-700">
                        {r.clickedProductName ? (
                          <span className="text-[#561269] font-medium truncate block max-w-xs">
                            {r.clickedProductName}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Catalog Search</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
