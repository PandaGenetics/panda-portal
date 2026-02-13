"""
Datasets browser page
"""
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { datasetsApi } from '@/lib/api';
import type { Dataset } from '@/types';

export default function Datasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ species: '', data_type: '' });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

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
      setDatasets(response.data.data);
      setPagination((prev) => ({ ...prev, total: response.data.total }));
    } catch (error) {
      console.error('Error loading datasets:', error);
    }
    setLoading(false);
  };

  const dataTypes = ['genome', 'transcriptome', 'variant', 'alignment'];
  const species = ['giant_panda', 'snow_leopard'];

  return (
    <>
      <Head>
        <title>Datasets - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">📊 Dataset Browser</h1>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Species
                  </label>
                  <select
                    value={filter.species}
                    onChange={(e) => setFilter({ ...filter, species: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="">All Species</option>
                    {species.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Type
                  </label>
                  <select
                    value={filter.data_type}
                    onChange={(e) => setFilter({ ...filter, data_type: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="">All Types</option>
                    {dataTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilter({ species: '', data_type: '' });
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Dataset list */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-accent"></div>
              </div>
            ) : datasets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No datasets found matching your criteria
              </div>
            ) : (
              <div className="space-y-4">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {dataset.name}
                        </h3>
                        {dataset.description && (
                          <p className="text-gray-600 mt-1">{dataset.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          {dataset.species && (
                            <span>🐼 {dataset.species.replace('_', ' ')}</span>
                          )}
                          {dataset.data_type && (
                            <span>📁 {dataset.data_type}</span>
                          )}
                          {dataset.file_size && (
                            <span>
                              💾 {(dataset.file_size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            dataset.access_level === 'public'
                              ? 'bg-green-100 text-green-800'
                              : dataset.access_level === 'registered'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {dataset.access_level}
                        </span>
                        <button className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.total > pagination.pageSize && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of{' '}
                  {Math.ceil(pagination.total / pagination.pageSize)}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={
                    pagination.page >=
                    Math.ceil(pagination.total / pagination.pageSize)
                  }
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
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
