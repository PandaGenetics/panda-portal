/**
 * Dataset Detail page
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

interface Dataset {
  id: number;
  name: string;
  description: string;
  species: string;
  data_type: string;
  file_path: string;
  file_size: number;
  access_level: string;
  uploaded_by: number;
  created_at: string;
}

export default function DatasetDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    loadDataset();
  }, [id]);

  const loadDataset = async () => {
    try {
      const response = await api.get<any>(`/api/datasets/${id}`);
      setDataset(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load dataset');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAccessBadge = (level: string) => {
    const colors: Record<string, string> = {
      public: 'bg-green-100 text-green-800',
      registered: 'bg-blue-100 text-blue-800',
      researcher: 'bg-purple-100 text-purple-800',
      collaborator: 'bg-orange-100 text-orange-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      genome: '🧬',
      transcriptome: '📝',
      variant: '🔢',
      alignment: '📏',
      other: '📁',
    };
    return icons[type] || '📁';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🐼</div>
          <p className="text-gray-600">Loading dataset...</p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-red-600">{error || 'Dataset not found'}</p>
          <button
            onClick={() => router.push('/datasets')}
            className="mt-4 px-4 py-2 bg-panda-accent text-white rounded-lg"
          >
            Back to Datasets
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{dataset.name} - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/datasets')}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                ← Back to Datasets
              </button>
            </div>

            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{getTypeIcon(dataset.data_type)}</span>
                  <div>
                    <h1 className="text-2xl font-bold">{dataset.name}</h1>
                    <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${getAccessBadge(dataset.access_level)}`}>
                      {dataset.access_level}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90">
                  ⬇️ Download
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">📋 Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Dataset ID</p>
                  <p className="font-medium">#{dataset.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data Type</p>
                  <p className="font-medium capitalize">{dataset.data_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Species</p>
                  <p className="font-medium capitalize">{dataset.species?.replace('_', ' ') || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">File Size</p>
                  <p className="font-medium">{formatFileSize(dataset.file_size)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Uploaded</p>
                  <p className="font-medium">{new Date(dataset.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">File Type</p>
                  <p className="font-medium">{dataset.file_path?.split('.').pop()?.toUpperCase() || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {dataset.description && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">📝 Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{dataset.description}</p>
              </div>
            )}

            {/* File Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">📄 File Preview</h2>
              <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-64">
                <pre className="text-xs text-gray-600">
                  File: {dataset.file_path}
                </pre>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
