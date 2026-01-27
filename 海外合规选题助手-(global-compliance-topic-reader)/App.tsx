
import React, { useState, useCallback } from 'react';
import { 
  Search, 
  FileText, 
  Clock, 
  Settings, 
  RefreshCw, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  Globe
} from 'lucide-react';
import { fetchTopicEvaluations } from './services/geminiService';
import { LoadingStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [result, setResult] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);
  const [days, setDays] = useState<number>(14);
  const [count, setCount] = useState<number>(6);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setError(null);
      setStatus(LoadingStatus.SEARCHING);
      
      const { text, groundingMetadata } = await fetchTopicEvaluations(days, count);
      
      setResult(text);
      if (groundingMetadata?.groundingChunks) {
        setSources(groundingMetadata.groundingChunks);
      }
      setStatus(LoadingStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '获取数据时发生错误');
      setStatus(LoadingStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Globe size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">海外合规选题助手</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="hidden sm:inline">Excl. Mainland China Dynamic</span>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <button 
              onClick={() => window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank')}
              className="hover:text-white transition-colors text-xs"
            >
              Billing Docs
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Settings size={16} /> 检索配置
              </h2>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-slate-500 font-medium">追溯时间</label>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase">Global Only</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" min="3" max="30" value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-sm font-bold w-12 text-center text-slate-700">{days}天</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-500 font-medium">生成卡片数量</label>
                <select 
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {[3, 4, 5, 6, 8, 10].map(n => (
                    <option key={n} value={n}>{n} 张卡片</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={status === LoadingStatus.SEARCHING}
              className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                status === LoadingStatus.SEARCHING
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
              }`}
            >
              {status === LoadingStatus.SEARCHING ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Zap size={18} />
              )}
              {status === LoadingStatus.SEARCHING ? '正在扫描海外动态...' : '开始生成选题'}
            </button>
          </div>

          <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <ShieldCheck size={16} /> 定向检索范围
            </h3>
            <div className="text-xs text-indigo-800 space-y-2 leading-relaxed">
              <p>✓ 已排除：中国大陆境内动态</p>
              <p>✓ 聚焦：欧盟、北美、APAC、中东</p>
              <p>✓ 逻辑：仅检索对出海业务有决策影响力的动态</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {status === LoadingStatus.IDLE && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                <Search size={32} className="text-slate-300" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-bold text-slate-800">专注于海外合规</h3>
                <p className="text-slate-500 mt-1">系统将过滤掉中国境内资讯，仅为您提供全球其他法域的监管深度洞察。</p>
              </div>
            </div>
          )}

          {status === LoadingStatus.SEARCHING && (
            <div className="space-y-6 animate-pulse">
              <div className="bg-white rounded-2xl p-6 h-64 border border-slate-100 shadow-sm flex items-center justify-center flex-col gap-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-slate-900 font-medium">正在实时检索海外法域合规动态...</p>
                  <p className="text-xs text-slate-400 mt-1">正在过滤中国大陆资讯，聚焦全球监管机构及法院官网</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-800 font-bold">生成失败</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button 
                  onClick={handleGenerate}
                  className="mt-3 text-xs font-bold text-red-800 flex items-center gap-1 hover:underline"
                >
                  重试 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {status === LoadingStatus.COMPLETED && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Output Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText size={18} />
                    <span className="font-bold tracking-tight text-slate-900">出海合规深度选题库</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>生成于 {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="p-6 md:p-8 markdown-content whitespace-pre-wrap">
                  {result.split(/(?=###? \d\. )/).map((card, idx) => (
                    <div 
                      key={idx} 
                      className={`mb-12 last:mb-0 p-6 rounded-xl border border-slate-100 transition-all hover:border-indigo-200 hover:shadow-md ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                    >
                      <div dangerouslySetInnerHTML={{ 
                        __html: card
                          .replace(/^###? (.*$)/gm, '<h2 class="text-xl font-bold text-indigo-900 mb-4">$1</h2>')
                          .replace(/^\d\.\s(.*$)/gm, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-2">$1</h3>')
                          .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-700">$1</strong>')
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Grounding Sources */}
              {sources.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Search size={16} /> 海外参考资料原始链接 (Google Search Grounding)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sources.map((src, i) => (
                      src.web && (
                        <a 
                          key={i} 
                          href={src.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all text-xs group"
                        >
                          <span className="text-slate-700 font-medium truncate pr-4">{src.web.title || src.web.uri}</span>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} 海外合规选题助手 - 专为中国出海律师打造
          </p>
          <p className="text-slate-300 text-[10px] mt-1 uppercase tracking-widest">
            Focused on International Compliance (Excl. China Mainland)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
