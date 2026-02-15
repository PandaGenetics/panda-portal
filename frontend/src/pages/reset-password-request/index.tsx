/**
 * Password Reset Request page
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

export default function ResetPasswordRequest() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResetLink('');

    try {
      const response = await api.post('/api/auth/password-reset-request', {
        email,
      });
      setMessage('✅ ' + response.data.message);
      if (response.data.demo_reset_link) {
        setResetLink(response.data.demo_reset_link);
      }
    } catch (err: any) {
      setMessage(err.response?.data?.detail || '❌ An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50 py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <span className="text-5xl">🔐</span>
                <h1 className="text-2xl font-bold mt-4">Reset Password</h1>
                <p className="text-gray-600 mt-2">
                  Enter your email to receive a password reset link
                </p>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded ${
                  message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                  
                  {resetLink && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm font-medium">Demo Reset Link:</p>
                      <a 
                        href={resetLink}
                        className="text-sm break-all underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resetLink}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-accent"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-panda-accent text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
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
