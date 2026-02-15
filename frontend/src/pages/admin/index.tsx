/**
 * Admin Dashboard page
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { authApi, usersApi, datasetsApi } from '@/lib/api';
import type { User } from '@/types';

export default function Admin() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    users: 0,
    datasets: 0,
    jobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/admin');
      return;
    }

    authApi.me().then(res => {
      setUser(res.data.data);
      if (res.data.data.role_name !== 'admin') {
        router.push('/dashboard');
      }
      setLoading(false);
    }).catch(() => {
      localStorage.removeItem('token');
      router.push('/login?redirect=/admin');
    });
  }, [router]);

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
        <title>Admin Dashboard - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">⚙️ Admin Dashboard</h1>
              <p className="text-gray-600">
                Welcome, {user?.first_name || user?.username}! Manage your portal here.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-2xl font-bold">{stats.users}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-2xl font-bold">{stats.datasets}</p>
                <p className="text-gray-600">Datasets</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl mb-2">🔬</div>
                <p className="text-2xl font-bold">{stats.jobs}</p>
                <p className="text-gray-600">Analysis Jobs</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">User Management</h2>
                <p className="text-gray-600 mb-4">View and manage registered users, assign roles, and monitor activity.</p>
                <button className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90">
                  Manage Users
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Dataset Management</h2>
                <p className="text-gray-600 mb-4">Upload, update, and organize genomic datasets.</p>
                <button className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90">
                  Manage Datasets
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
