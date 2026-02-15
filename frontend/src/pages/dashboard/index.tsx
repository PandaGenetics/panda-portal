/**
 * User Dashboard page
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { authApi, datasetsApi } from '@/lib/api';
import type { User, Dataset } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    // Fetch user data and datasets
    Promise.all([
      authApi.me().then(res => res.data.data),
      datasetsApi.list({ skip: 0, limit: 5 }).then(res => res.data.data.datasets)
    ]).then(([userData, datasetsData]) => {
      setUser(userData);
      setDatasets(datasetsData);
      setLoading(false);
    }).catch(() => {
      localStorage.removeItem('token');
      router.push('/login?redirect=/dashboard');
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🐼</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {user?.first_name || user?.username}! 👋
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Role: <span className="font-medium text-panda-accent">{user?.role_name}</span>
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/datasets" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Browse Datasets</h3>
                <p className="text-gray-600">Explore genomic datasets available to your account</p>
              </Link>
              
              <Link href="/genome-browser" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🧬</div>
                <h3 className="text-lg font-semibold mb-2">Genome Browser</h3>
                <p className="text-gray-600">Explore panda and snow leopard genomes</p>
              </Link>
              
              <Link href="/tools/blast" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-lg font-semibold mb-2">BLAST Search</h3>
                <p className="text-gray-600">Align and compare sequences</p>
              </Link>
            </div>

            {/* Recent Datasets */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Datasets</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {datasets.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No datasets available yet.</p>
                    <p className="text-sm mt-2">Datasets will appear here once they are added.</p>
                  </div>
                ) : (
                  datasets.map((dataset) => (
                    <div key={dataset.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {dataset.species} • {dataset.data_type}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          dataset.access_level === 'public' ? 'bg-green-100 text-green-800' :
                          dataset.access_level === 'registered' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {dataset.access_level}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Link href="/datasets" className="text-panda-accent hover:text-panda-accent/80 font-medium">
                  View all datasets →
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
