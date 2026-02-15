/**
 * 🎨 Professional Login Page
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      const redirect = router.query.redirect as string || '/';
      router.push(redirect);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mb-12">
              <span className="text-5xl">🐼</span>
              <div>
                <span className="font-bold text-2xl text-neutral-900">Panda Portal</span>
                <p className="text-sm text-neutral-500">Genomic Research Center</p>
              </div>
            </Link>

            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back</h1>
              <p className="text-neutral-600 mb-8">
                Sign in to access your account and research tools
              </p>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                      Password
                    </label>
                    <Link
                      href="/reset-password-request"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-neutral-600">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-50 text-neutral-500">or continue with</span>
                </div>
              </div>

              {/* Register Link */}
              <p className="text-center text-neutral-600">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="text-primary-600 font-semibold hover:text-primary-700"
                >
                  Create account
                </Link>
              </p>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
                <p className="text-sm font-medium text-primary-800 mb-2">Demo Credentials</p>
                <p className="text-sm text-primary-600">
                  Email: test2@example.com<br />
                  Password: testpass123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Image/Pattern */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <div className="text-center">
              <span className="text-8xl mb-8 block animate-bounce">🐼</span>
              <h2 className="text-4xl font-bold mb-4">Genomic Research</h2>
              <p className="text-xl text-primary-200 max-w-md mx-auto leading-relaxed">
                Explore the fascinating world of panda genomics with our advanced research platform
              </p>
              
              {/* Features List */}
              <div className="mt-12 grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {[
                  '🧬 Genome Browser',
                  '🔬 BLAST Search',
                  '📊 Dataset Library',
                  '🌳 Pedigree Trees',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-primary-100">
                    <span className="w-2 h-2 bg-accent-400 rounded-full" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
