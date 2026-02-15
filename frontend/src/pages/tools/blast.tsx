/**
 * 🎨 Professional BLAST Page
 */
import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toolsApi } from '@/lib/api';

interface BlastResult {
  id: number;
  query: string;
  database: string;
  program: string;
  status: string;
  created_at: string;
  results?: any[];
}

export default function Blast() {
  const [sequence, setSequence] = useState('');
  const [database, setDatabase] = useState('giant_panda');
  const [program, setProgram] = useState('blastn');
  const [expect, setExpect] = useState('0.001');
  const [numResults, setNumResults] = useState('10');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [history, setHistory] = useState<BlastResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const response = await toolsApi.blast({
        sequence,
        database,
        program,
        expect: parseFloat(expect),
        num_results: parseInt(numResults),
      });
      setResults(response.data.data);
      
      // Add to history
      const newJob: BlastResult = {
        id: response.data.data.job_id || Date.now(),
        query: sequence.substring(0, 30) + '...',
        database,
        program,
        status: 'completed',
        created_at: new Date().toISOString(),
        results: response.data.data.results,
      };
      setHistory([newJob, ...history.slice(0, 9)]);
    } catch (err: any) {
      console.error('BLAST error:', err);
      setResults({ error: err.response?.data?.detail || 'BLAST search failed' });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSequence('');
    setResults(null);
  };

  const sampleSequences = [
    'ATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGC',
    'GATTACAATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCAT',
    'TACGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGA',
  ];

  return (
    <>
      <Head>
        <title>BLAST - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🧬
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900">BLAST Search</h1>
                  <p className="text-neutral-600">Find similar sequences in our reference databases</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* BLAST Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <form onSubmit={handleSubmit}>
                    {/* Parameters */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Database
                        </label>
                        <select
                          value={database}
                          onChange={(e) => setDatabase(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        >
                          <option value="giant_panda">🐼 Giant Panda</option>
                          <option value="snow_leopard">🐆 Snow Leopard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Program
                        </label>
                        <select
                          value={program}
                          onChange={(e) => setProgram(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        >
                          <option value="blastn">BLASTN (Nucleotide)</option>
                          <option value="blastp">BLASTP (Protein)</option>
                          <option value="blastx">BLASTX (Translated)</option>
                          <option value="tblastn">TBLASTN</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          E-Value
                        </label>
                        <input
                          type="text"
                          value={expect}
                          onChange={(e) => setExpect(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Sequence Input */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-neutral-700">
                          Query Sequence
                        </label>
                        <span className="text-xs text-neutral-500">
                          {sequence.length} characters
                        </span>
                      </div>
                      <textarea
                        value={sequence}
                        onChange={(e) => setSequence(e.target.value.toUpperCase())}
                        placeholder="Enter your DNA or protein sequence here..."
                        className="w-full h-48 px-4 py-3 font-mono text-sm bg-slate-900 text-green-400 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                        required
                      />
                    </div>

                    {/* Sample Sequences */}
                    <div className="mb-6">
                      <p className="text-sm text-neutral-500 mb-2">Or try a sample sequence:</p>
                      <div className="flex flex-wrap gap-2">
                        {sampleSequences.map((seq, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSequence(seq)}
                            className="px-3 py-1 text-xs bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                          >
                            Sample {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                      <button
                        type="submit"
                        disabled={loading || !sequence}
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-800 shadow-lg shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Running BLAST...
                          </span>
                        ) : (
                          '🔍 Run BLAST'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-6 py-4 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>

                {/* Results */}
                {results && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 animate-fade-in">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                      {results.error ? 'Error' : 'BLAST Results'}
                    </h2>

                    {results.error ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {results.error}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {results.results?.map((hit: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 border border-neutral-200 rounded-xl hover:border-green-300 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-green-700">{hit.title || `Hit ${idx + 1}`}</h3>
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                Score: {hit.score || 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">
                              {hit.description || 'No description available'}
                            </p>
                          </div>
                        ))}
                        {(!results.results || results.results.length === 0) && (
                          <p className="text-neutral-500">No matches found for your query.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Jobs */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-neutral-900 mb-4">Recent Jobs</h3>
                  {history.length > 0 ? (
                    <div className="space-y-3">
                      {history.map((job, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {job.query}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-neutral-500">
                              {new Date(job.created_at).toLocaleTimeString()}
                            </span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              {job.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500">No recent BLAST jobs</p>
                  )}
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-4">💡 Tips</h3>
                  <ul className="space-y-2 text-sm text-green-100">
                    <li>• Use longer sequences for better results</li>
                    <li>• Lower E-value = more stringent</li>
                    <li>• BLASTN for DNA vs DNA comparisons</li>
                    <li>• BLASTP for protein searches</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
