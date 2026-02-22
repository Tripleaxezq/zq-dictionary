import React, { useState } from 'react';
import { Search, BookOpen, Loader2, Volume2, Sparkles } from 'lucide-react';
import { fetchWordData, DictionaryResponse } from './services/gemini';

const LEVELS = ['CET-4', 'CET-6', 'TOEFL', 'IELTS', 'GRE'];

export default function App() {
  const [word, setWord] = useState('');
  const [level, setLevel] = useState('TOEFL');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictionaryResponse | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const result = await fetchWordData(word.trim(), level);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch word data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen relative text-stone-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://picsum.photos/seed/swiss-alps-snow/1920/1080?blur=1"
          alt="Swiss Snow Mountains"
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-stone-50/30 to-white/80" />
      </div>

      <header className="relative z-10 bg-white/70 backdrop-blur-md border-b border-stone-200 sticky top-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-semibold tracking-tight">zq dictionary</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-5xl font-extrabold tracking-tight text-stone-900 mb-6 drop-shadow-sm">
            Master Vocabulary in Context
          </h2>
          <p className="text-xl text-stone-700 font-medium">
            Get precise definitions, synonyms, and realistic dialogues tailored to your target proficiency level.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-stone-400" />
              </div>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Enter a word (e.g., ubiquitous)"
                className="block w-full pl-11 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl text-lg shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="block w-32 pl-4 pr-8 py-4 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl text-base shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
              >
                {LEVELS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading || !word.trim()}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-2xl text-red-700 text-center shadow-md">
            {error}
          </div>
        )}

        {data && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden">
              {/* Header */}
              <div className="p-8 sm:p-12 border-b border-stone-100 bg-white/40">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm">
                        {data.target_level}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <h2 className="text-6xl font-black tracking-tighter text-stone-900 font-serif">
                        {data.word}
                      </h2>
                      <button 
                        onClick={() => playAudio(data.word)}
                        className="p-3 text-indigo-600 hover:bg-indigo-100 rounded-full transition-all shadow-sm active:scale-90"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Definitions */}
              <div className="divide-y divide-stone-100/50">
                {data.definitions_group.map((def, idx) => (
                  <div key={def.sense_id || idx} className="p-8 sm:p-12 hover:bg-white/20 transition-colors">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md mt-1">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-bold text-indigo-500 italic bg-indigo-50 px-2 py-0.5 rounded-md">
                            {def.part_of_speech}
                          </span>
                        </div>
                        <p className="text-2xl text-stone-900 font-bold mb-2 leading-tight">
                          {def.definition_en}
                        </p>
                        <p className="text-lg text-stone-600 font-medium">
                          {def.definition_cn}
                        </p>
                        
                        {(def.synonyms?.length > 0 || def.antonyms?.length > 0) && (
                          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm mt-6">
                            {def.synonyms?.length > 0 && (
                              <div className="flex items-baseline gap-2">
                                <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Synonyms</span>
                                <span className="text-stone-800 font-medium">{def.synonyms.join(', ')}</span>
                              </div>
                            )}
                            {def.antonyms?.length > 0 && (
                              <div className="flex items-baseline gap-2">
                                <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Antonyms</span>
                                <span className="text-stone-800 font-medium">{def.antonyms.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scenario */}
                    {def.scenario && (
                      <div className="ml-16 mt-8 bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-inner">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-6 uppercase tracking-[0.2em]">
                          <Sparkles className="w-4 h-4" />
                          Context: {def.scenario.context}
                        </div>
                        
                        <div className="space-y-6 mb-8">
                          {def.scenario.dialogue.map((turn, i) => (
                            <div key={i} className="flex gap-4">
                              <span className="font-bold text-stone-900 text-sm mt-0.5 min-w-[5rem] text-right opacity-60">
                                {turn.speaker}
                              </span>
                              <p className="text-stone-800 leading-relaxed text-lg font-medium">
                                {turn.content}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-6 border-t border-stone-200/50">
                          <p className="text-base text-stone-500 italic">
                            {def.scenario.translation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
