/**
 * 🎨 Professional API Documentation Page
 */
import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ApiDocs() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['authentication']);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const apiEndpoints = [
    {
      category: 'Authentication',
      color: 'from-blue-500 to-blue-700',
      endpoints: [
        { method: 'POST', path: '/api/auth/register', desc: 'Register a new user account', auth: false },
        { method: 'POST', path: '/api/auth/login', desc: 'Login and get access token', auth: false },
        { method: 'POST', path: '/api/auth/logout', desc: 'Logout and revoke token', auth: true },
        { method: 'GET', path: '/api/auth/me', desc: 'Get current user info', auth: true },
        { method: 'POST', path: '/api/auth/password-reset-request', desc: 'Request password reset', auth: false },
        { method: 'POST', path: '/api/auth/password-reset/confirm', desc: 'Reset password', auth: false },
      ],
    },
    {
      category: 'Users',
      color: 'from-green-500 to-green-700',
      endpoints: [
        { method: 'GET', path: '/api/users', desc: 'List all users (admin)', auth: true },
        { method: 'GET', path: '/api/users/{id}', desc: 'Get user by ID', auth: true },
        { method: 'PUT', path: '/api/users/me', desc: 'Update profile', auth: true },
      ],
    },
    {
      category: 'Genome',
      color: 'from-purple-500 to-purple-700',
      endpoints: [
        { method: 'GET', path: '/api/genome/species', desc: 'List species', auth: false },
        { method: 'GET', path: '/api/genome/{species}/refs', desc: 'List references', auth: false },
        { method: 'GET', path: '/api/genome/{species}/tracks', desc: 'List tracks', auth: false },
      ],
    },
    {
      category: 'Datasets',
      color: 'from-orange-500 to-orange-700',
      endpoints: [
        { method: 'GET', path: '/api/datasets', desc: 'List datasets', auth: true },
        { method: 'GET', path: '/api/datasets/{id}', desc: 'Get dataset details', auth: true },
        { method: 'GET', path: '/api/datasets/export/csv', desc: 'Export as CSV', auth: true },
        { method: 'GET', path: '/api/datasets/export/json', desc: 'Export as JSON', auth: true },
      ],
    },
    {
      category: 'Tools',
      color: 'from-red-500 to-red-700',
      endpoints: [
        { method: 'POST', path: '/api/tools/blast', desc: 'Submit BLAST job', auth: false },
        { method: 'GET', path: '/api/tools/blast/{id}', desc: 'Get BLAST results', auth: false },
      ],
    },
  ];

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-green-100 text-green-700 border-green-200',
      POST: 'bg-blue-100 text-blue-700 border-blue-200',
      PUT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      DELETE: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[method] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <Head>
        <title>API Documentation - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-5xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="text-6xl mb-4 block">📚</span>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">API Documentation</h1>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Complete reference for the Panda Portal REST API
              </p>
            </div>

            {/* Base URL */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 mb-8 text-white">
              <p className="text-sm text-neutral-400 mb-2">Base URL</p>
              <code className="text-xl font-mono">http://localhost:8000</code>
            </div>

            {/* Authentication Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-neutral-900 mb-3">🔐 Authentication</h3>
              <p className="text-neutral-600 mb-3">
                Most endpoints require JWT Bearer token authentication.
              </p>
              <code className="block bg-white px-4 py-2 rounded-xl text-sm font-mono">
                Authorization: Bearer {"<token>"}
              </code>
            </div>

            {/* Endpoints */}
            <div className="space-y-4">
              {apiEndpoints.map((cat, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(cat.category.toLowerCase())}
                    className="w-full flex items-center justify-between p-6 bg-gradient-to-r text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white font-bold`}>
                        {cat.category[0]}
                      </div>
                      <h2 className="text-xl font-semibold text-neutral-900">{cat.category}</h2>
                    </div>
                    <svg
                      className={`w-6 h-6 text-neutral-400 transition-transform duration-300 ${
                        expandedCategories.includes(cat.category.toLowerCase()) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedCategories.includes(cat.category.toLowerCase()) && (
                    <div className="border-t border-neutral-100">
                      {cat.endpoints.map((ep, epIdx) => (
                        <div
                          key={epIdx}
                          className="p-4 border-b border-neutral-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${getMethodColor(ep.method)}`}>
                                {ep.method}
                              </span>
                              <code className="text-sm font-mono text-neutral-700">{ep.path}</code>
                            </div>
                            {ep.auth && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                                Auth required
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-neutral-600 ml-20">{ep.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Response Format */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
              <h3 className="font-semibold text-neutral-900 mb-4">📦 Response Format</h3>
              <p className="text-neutral-600 mb-4">All responses use JSON format:</p>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
{`{
  "data": { ... },
  "message": "Optional status message"
}`}
              </pre>
            </div>

            {/* Error Codes */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
              <h3 className="font-semibold text-neutral-900 mb-4">⚠️ Error Codes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { code: '400', desc: 'Bad Request', color: 'bg-red-100 text-red-700' },
                  { code: '401', desc: 'Unauthorized', color: 'bg-orange-100 text-orange-700' },
                  { code: '403', desc: 'Forbidden', color: 'bg-yellow-100 text-yellow-700' },
                  { code: '404', desc: 'Not Found', color: 'bg-blue-100 text-blue-700' },
                ].map((err) => (
                  <div key={err.code} className={`p-4 rounded-xl ${err.color}`}>
                    <p className="text-2xl font-bold">{err.code}</p>
                    <p className="text-sm">{err.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
