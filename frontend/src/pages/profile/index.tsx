/**
 * 🎨 Professional Profile Page
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { authApi, usersApi } from '@/lib/api';

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  role_name: string | null;
  is_active: boolean;
  created_at: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    email: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/profile');
      return;
    }
    loadUser();
  }, [router]);

  const loadUser = async () => {
    try {
      const response = await authApi.me();
      const userData = response.data?.data || response.data;
      setUser(userData);
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        organization: userData.organization || '',
        email: userData.email,
      });
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/login?redirect=/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await usersApi.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization: formData.organization,
      });
      setMessage('✅ Profile updated successfully!');
      loadUser();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || '❌ Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'activity', label: 'Activity', icon: '📊' },
  ];

  return (
    <>
      <Head>
        <title>Profile - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900">Account Settings</h1>
              <p className="text-neutral-600 mt-1">Manage your profile and preferences</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  {/* User Info */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h3 className="font-semibold text-lg text-neutral-900">{user?.username}</h3>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full capitalize">
                      {user?.role_name || 'User'}
                    </span>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 mt-6 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {activeTab === 'profile' && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                      Profile Information
                    </h2>

                    {message && (
                      <div className={`mb-6 p-4 rounded-xl ${
                        message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {message}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div className="mb-8">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Organization
                        </label>
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({...formData, organization: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({
                            firstName: user?.first_name || '',
                            lastName: user?.last_name || '',
                            organization: user?.organization || '',
                            email: user?.email || '',
                          })}
                          className="px-6 py-3 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>

                    {/* Account Info */}
                    <div className="mt-8 pt-8 border-t border-neutral-100">
                      <h3 className="font-semibold text-neutral-900 mb-4">Account Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <p className="text-sm text-neutral-500">Member since</p>
                          <p className="font-medium text-neutral-900">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'N/A'}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <p className="text-sm text-neutral-500">Account status</p>
                          <p className="font-medium text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            Active
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                      Security Settings
                    </h2>

                    <div className="space-y-6">
                      {/* Password */}
                      <div className="p-6 border border-neutral-200 rounded-xl hover:border-primary-200 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                              🔑
                            </div>
                            <div>
                              <h4 className="font-medium text-neutral-900">Password</h4>
                              <p className="text-sm text-neutral-500">Last changed never</p>
                            </div>
                          </div>
                          <Link
                            href="/reset-password-request"
                            className="px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors"
                          >
                            Change
                          </Link>
                        </div>
                      </div>

                      {/* Sessions */}
                      <div className="p-6 border border-neutral-200 rounded-xl hover:border-primary-200 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                              💻
                            </div>
                            <div>
                              <h4 className="font-medium text-neutral-900">Active Sessions</h4>
                              <p className="text-sm text-neutral-500">1 active session</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Current
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                      Recent Activity
                    </h2>

                    <div className="space-y-4">
                      {[
                        { action: 'Logged in', time: 'Just now', icon: '🔓' },
                        { action: 'Viewed genome browser', time: '2 hours ago', icon: '🧬' },
                        { action: 'Searched datasets', time: 'Yesterday', icon: '🔍' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900">{item.action}</p>
                            <p className="text-sm text-neutral-500">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
