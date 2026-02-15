/**
 * Reset Password page (with token)
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    if (token) {
      setValidToken(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage('❌ Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/auth/password-reset/confirm', {
        token,
        new_password: password,
      });
      setMessage('✅ Password reset successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || '❌ Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <>
        <Head>
          <title>Invalid Token - Panda Portal</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <span className="text-5xl">😕</span>
            <h1 className="text-2xl font-bold mt-4">Invalid Reset Link</h1>
            <p className="text-gray-600 mt-2">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/reset-password-request" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              Request a new reset link
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Set New Password - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50 py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <span className="text-5xl">🔑</span>
                <h1 className="text-2xl font-bold mt-4">Set New Password</h1>
                <p className="text-gray-600 mt-2">
                  Enter your new password below
                </p>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded ${
                  message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-accent"
                    placeholder="••••••••"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-accent"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-panda-accent text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-blue-600 hover:text-blue-800">
                  ← Back to Login
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
