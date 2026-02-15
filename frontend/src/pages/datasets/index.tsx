/**
 * 🎨 Professional Datasets Page
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { datasetsApi } from '@/lib/api';
import type { Dataset } from '@/types';

export default function Datasets() {
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ species: '', data_type: '' });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadDatasets();
  }, [filter, pagination.page]);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const response = await datasetsApi.list({
        skip: (pagination.page - 1) * pagination.pageSize,
        limit: pagination.pageSize,
        species: filter.species || undefined,
        data_type: filter.data_type || undefined,
      });
      // Backend returns { total, page, page_size, datasets } directly
      setDatasets(response.data.datasets || []);
      setPagination((prev) => ({ ...prev, total: response.data.total || 0 }));
    } catch (error) {
      console.error('Error loading datasets:', error);
    }
    setLoading(false);
  };

  const dataTypes = [
    { value: '', label: 'All Types' },
    { value: 'genome', label: '🧬 Genome' },
    { value: 'transcriptome', label: '📝 Transcriptome' },
    { value: 'variant', label: '🔢 Variants' },
    { value: 'alignment', label: '📏 Alignment' },
  ];

  const species = [
    { value: '', label: 'All Species' },
    { value: 'giant_panda', label: '🐼 Giant Panda' },
    { value: 'snow_leopard', label: '🐆 Snow Leopard' },
  ];

  const getAccessBadge = (level: string) => {
    const styles: Record<string, string> = {
      public: 'bg-green-100 text-green-700 border-green-200',
      registered: 'bg-blue-100 text-blue-700 border-blue-200',
      researcher: 'bg-purple-100 text-purple-700 border-purple-200',
      collaborator: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return styles[level] || 'bg-gray-100 text-gray-700 border-gray-200';
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

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <Head>
        <title>Datasets - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Dataset Library</h1>
                <p className="text-neutral-600 mt-1">
                  Browse and download genomic datasets for your research
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Link
                  href="/export"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <span>📤</span>
                  <span className="font-medium">Export</span>
                </Link>
                <Link
                  href="/datasets/upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>➕</span>
                  <span className="font-medium">Upload Dataset</span>
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Species
                  </label>
                  <select
                    value={filter.species}
                    onChange={(e) => {
                      setFilter({ ...filter, species: e.target.value });
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    {species.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Data Type
                  </label>
                  <select
                    value={filter.data_type}
                    onChange={(e) => {
                      setFilter({ ...filter, data_type: e.target.value });
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    {dataTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 flex items-end justify-end space-x-2">
                  <button
                    onClick={() => {
                      setFilter({ species: '', data_type: '' });
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="px-4 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-600">
                {pagination.total > 0 ? (
                  <>Showing {datasets.length} of {pagination.total} datasets</>
                ) : (
                  'No datasets found'
                )}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 skeleton rounded-xl" />
                      <div className="flex-1">
                        <div className="h-5 skeleton w-3/4 mb-2" />
                        <div className="h-4 skeleton w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 skeleton w-full" />
                      <div className="h-4 skeleton w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && datasets.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <span className="text-6xl mb-4 block">📭</span>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No datasets found
                </h3>
                <p className="text-neutral-600 mb-6">
                  Try adjusting your filters or upload new datasets
                </p>
                <Link
                  href="/datasets/upload"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-colors"
                >
                  Upload Dataset
                </Link>
              </div>
            )}

            {/* Dataset Grid */}
            {!loading && datasets.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    onClick={() => router.push(`/datasets/${dataset.id}`)}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-neutral-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-2xl">
                            {getTypeIcon(dataset.data_type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                              {dataset.name}
                            </h3>
                            <p className="text-sm text-neutral-500 capitalize">{dataset.data_type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getAccessBadge(dataset.access_level)}`}>
                          {dataset.access_level}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {dataset.description && (
                        <p className="text-neutral-600 text-sm line-clamp-2 mb-4">
                          {dataset.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-neutral-500">
                        {dataset.species && (
                          <span className="flex items-center">
                            🐼 {dataset.species.replace('_', ' ')}
                          </span>
                        )}
                        {dataset.file_size && (
                          <span className="flex items-center">
                            💾 {formatFileSize(dataset.file_size)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-neutral-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">
                          #{dataset.id}
                        </span>
                        <span className="inline-flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.total > pagination.pageSize && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
                </span>
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
