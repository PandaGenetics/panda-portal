/**
 * 🎨 Professional Dataset Upload Page
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

export default function UploadDataset() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    species: '',
    data_type: 'other',
    access_level: 'registered',
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.file) {
      setMessage('❌ Please select a file');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login?redirect=/datasets/upload');
        return;
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('species', formData.species);
      data.append('data_type', formData.data_type);
      data.append('access_level', formData.access_level);
      data.append('file', formData.file);

      const response = await api.post('/api/files/datasets', data, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setMessage(`✅ Dataset uploaded successfully! ID: ${response.data.id}`);
      setFormData({ name: '', description: '', species: '', data_type: 'other', access_level: 'registered', file: null });
    } catch (err: any) {
      setMessage(err.response?.data?.detail || '❌ Failed to upload dataset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upload Dataset - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-3xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="text-6xl mb-4 block">📤</span>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">Upload Dataset</h1>
              <p className="text-xl text-neutral-600">
                Share your genomic data with the research community
              </p>
            </div>

            {/* Upload Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {message && (
                <div className={`mb-6 p-4 rounded-xl border ${
                  message.includes('✅') 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dataset Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Dataset Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="e.g., Panda Genome v2.0"
                    className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    placeholder="Describe your dataset..."
                    className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                  />
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Species
                    </label>
                    <select
                      value={formData.species}
                      onChange={(e) => setFormData({...formData, species: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Select species...</option>
                      <option value="giant_panda">🐼 Giant Panda</option>
                      <option value="snow_leopard">🐆 Snow Leopard</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Data Type
                    </label>
                    <select
                      value={formData.data_type}
                      onChange={(e) => setFormData({...formData, data_type: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="genome">🧬 Genome</option>
                      <option value="transcriptome">📝 Transcriptome</option>
                      <option value="variant">🔢 Variants</option>
                      <option value="alignment">📏 Alignment</option>
                      <option value="other">📁 Other</option>
                    </select>
                  </div>
                </div>

                {/* Access Level */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Access Level
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'public', label: 'Public', desc: 'Everyone' },
                      { value: 'registered', label: 'Registered', desc: 'Logged in users' },
                      { value: 'researcher', label: 'Researcher', desc: 'Researchers only' },
                      { value: 'collaborator', label: 'Collaborator', desc: 'Team members' },
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({...formData, access_level: level.value})}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.access_level === level.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <p className="font-medium text-neutral-900">{level.label}</p>
                        <p className="text-xs text-neutral-500">{level.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    File *
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".fa,.fasta,.fna,.bam,.vcf,.gff,.gff3,.txt,.csv,.json"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-4xl block mb-4">📄</span>
                      <p className="text-neutral-700 font-medium">
                        {formData.file ? formData.file.name : 'Click to select a file'}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        Accepted: FASTA, BAM, VCF, GFF, TXT, CSV, JSON
                      </p>
                      {formData.file && (
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          {(formData.file.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.file}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    '📤 Upload Dataset'
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
