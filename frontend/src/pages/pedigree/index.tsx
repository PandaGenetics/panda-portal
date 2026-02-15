/**
 * 🎨 Professional Pedigree Search Page
 */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Pedigree() {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    setTimeout(() => {
      if (searchId.toLowerCase().includes('pan')) {
        setResult({
          individual_id: 'PAN-001',
          sire_id: 'PAN-000',
          dam_id: 'PAN-A01',
          birth_date: '2010-08-12',
          sex: 'Male',
          location: 'Chengdu Research Base'
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <Head>
        <title>Pedigree - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="text-6xl mb-4 block">🌳</span>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">Pedigree Database</h1>
              <p className="text-xl text-neutral-600">
                Search and explore panda family relationships
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex justify-center mb-8">
              <Link
                href="/pedigree/tree"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-800 shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>🌳</span>
                <span>View Family Tree</span>
              </Link>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <form onSubmit={handleSearch}>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter panda ID (e.g., PAN-001)"
                    className="flex-1 px-6 py-4 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg"
                  />
                  <button
                    type="submit"
                    disabled={loading || !searchId.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-800 shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : '🔍 Search'}
                  </button>
                </div>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-3xl">
                    ♂
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">{result.individual_id}</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {result.sex}
                    </span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    ['Birth Date', result.birth_date],
                    ['Location', result.location],
                    ['Father (Sire)', result.sire_id],
                    ['Mother (Dam)', result.dam_id],
                  ].map(([label, value]) => (
                    <div key={label} className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-neutral-500">{label}</p>
                      <p className="font-semibold text-neutral-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!result && searchId && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <span className="text-5xl mb-4 block">🔍</span>
                <p className="text-neutral-600">No records found for "{searchId}"</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
