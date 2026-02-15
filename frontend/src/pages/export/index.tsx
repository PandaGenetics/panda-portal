/**
 * 🎨 Professional Data Export Page
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

export default function Export() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async (format: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/export');
      return;
    }

    setExporting(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:8000/api/datasets/export/${format}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Export failed');

      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `datasets.${format}`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      setMessage(`✅ Successfully exported as ${format.toUpperCase()}`);
    } catch (err: any) {
      setMessage(`❌ Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const exportOptions = [
    {
      id: 'csv',
      name: 'CSV',
      description: 'Comma-separated values, compatible with Excel and Google Sheets',
      icon: '📊',
      color: 'from-green-500 to-green-700',
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'JavaScript Object Notation, for developers and APIs',
      icon: '{ }',
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  return (
    <>
      <Head>
        <title>Export Data - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="text-6xl mb-4 block">📤</span>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">Export Data</h1>
              <p className="text-xl text-neutral-600">
                Download your accessible datasets in various formats
              </p>
            </div>

            {message && (
              <div className={`mb-8 p-4 rounded-xl border ${
                message.includes('✅') 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {/* Export Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {exportOptions.map((option) => (
                <div
                  key={option.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className={`h-2 bg-gradient-to-r ${option.color}`} />
                  <div className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">{option.name}</h3>
                        <p className="text-neutral-600 text-sm mb-6">{option.description}</p>
                        <button
                          onClick={() => handleExport(option.id)}
                          disabled={exporting}
                          className={`w-full py-3 bg-gradient-to-r ${option.color} text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50`}
                        >
                          {exporting ? 'Exporting...' : `Export as ${option.name}`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
              <h3 className="font-semibold text-neutral-900 mb-4">📋 Export Information</h3>
              <ul className="grid md:grid-cols-2 gap-4 text-sm text-neutral-600">
                {[
                  'Exports include all datasets accessible to your account',
                  'CSV exports are compatible with Microsoft Excel and Google Sheets',
                  'JSON exports include full metadata structure',
                  'Export file names include timestamp',
                  'Large exports may take a few moments to generate',
                  'Your access permissions are respected in exports',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
