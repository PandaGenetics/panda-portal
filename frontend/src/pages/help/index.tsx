/**
 * 🎨 Professional Help Page
 */
import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface HelpSection {
  title: string;
  icon: string;
  color: string;
  items: { q: string; a: string }[];
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const helpSections: HelpSection[] = [
    {
      title: 'Getting Started',
      icon: '🚀',
      color: 'from-blue-500 to-blue-700',
      items: [
        { q: 'How do I create an account?', a: 'Click "Register" in the top right corner. Fill in your email, username, and password. You can optionally provide your name and organization.' },
        { q: 'How do I login?', a: 'Click "Login" and enter your email and password. Your session will be remembered for 24 hours.' },
        { q: 'What can I do as a guest?', a: 'Guests can browse species information, view public datasets, and use the genome browser with limited features.' },
      ],
    },
    {
      title: 'Genome Browser',
      icon: '🔬',
      color: 'from-green-500 to-green-700',
      items: [
        { q: 'What is the genome browser?', a: 'The genome browser visualizes the panda reference genome (ASM200744v3). You can navigate through chromosomes, zoom in/out, and view gene annotations.' },
        { q: 'How do I switch between genomes?', a: 'Use the dropdown menu in the genome browser to select "Complete" (21 chromosomes) or "Test" (8 chromosomes) data.' },
        { q: 'Can I view gene details?', a: 'Yes! Click on any gene annotation in the browser to see detailed information including gene name, description, and position.' },
      ],
    },
    {
      title: 'BLAST Tool',
      icon: '🧬',
      color: 'from-purple-500 to-purple-700',
      items: [
        { q: 'What is BLAST?', a: 'BLAST (Basic Local Alignment Search Tool) allows you to search for similar sequences in the reference genome.' },
        { q: 'How do I run a BLAST search?', a: 'Go to the BLAST page, enter your DNA sequence, select parameters, and click "Run BLAST". Results will appear below.' },
        { q: 'What formats are supported?', a: 'Input sequences should be in FASTA format or plain DNA sequences (A, T, G, C).' },
      ],
    },
    {
      title: 'Datasets',
      icon: '📊',
      color: 'from-orange-500 to-orange-700',
      items: [
        { q: 'How do I upload a dataset?', a: 'Go to "Upload Dataset" from the Datasets menu. You need researcher权限 or higher. Supported formats: FASTA, BAM, VCF, GFF.' },
        { q: 'Who can see my uploaded data?', a: 'You can set access levels: Public (everyone), Registered (logged-in users), Researcher (researchers only), or Collaborator (team members).' },
        { q: 'How do I download datasets?', a: 'Browse the Datasets page and click on any dataset to view details. Use the download button to save files.' },
      ],
    },
    {
      title: 'Pedigree',
      icon: '🌳',
      color: 'from-teal-500 to-teal-700',
      items: [
        { q: 'What is the pedigree database?', a: 'The pedigree database contains family relationships of pandas in our research program, spanning multiple generations.' },
        { q: 'How do I search for a panda?', a: 'Enter the panda ID (e.g., PAN-001) in the search box. Results show parents, birth date, and location.' },
        { q: 'Can I view family trees?', a: 'Yes! Click "View Tree" to see interactive pedigree charts with filtering by generation or sex.' },
      ],
    },
    {
      title: 'Account & Profile',
      icon: '👤',
      color: 'from-pink-500 to-pink-700',
      items: [
        { q: 'How do I update my profile?', a: 'Click on your username in the top right and select "Profile". You can edit your name and organization.' },
        { q: 'Can I change my password?', a: 'Yes! Go to your Profile, click on "Security", and select "Change Password".' },
        { q: 'How do I reset my password?', a: 'On the login page, click "Forgot password" and enter your email. You will receive a reset link.' },
      ],
    },
  ];

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const filteredSections = helpSections.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      <Head>
        <title>Help Center - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="text-center mb-12">
              <span className="text-6xl mb-4 block">❓</span>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                How can we help you?
              </h1>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Search our knowledge base or browse categories below
              </p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-lg"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: '📚', label: 'API Docs', href: '/api-docs' },
                { icon: '📊', label: 'Statistics', href: '/stats' },
                { icon: '📤', label: 'Export Data', href: '/export' },
                { icon: '🐛', label: 'Report Bug', href: '#' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="text-3xl mb-3">{link.icon}</span>
                  <span className="font-medium text-neutral-700">{link.label}</span>
                </a>
              ))}
            </div>

            {/* Help Sections */}
            <div className="space-y-4">
              {filteredSections.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between p-6 bg-gradient-to-r text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-2xl`}>
                        {section.icon}
                      </div>
                      <h2 className="text-xl font-semibold text-neutral-900">
                        {section.title}
                      </h2>
                    </div>
                    <svg
                      className={`w-6 h-6 text-neutral-400 transition-transform duration-300 ${
                        expandedSections.includes(section.title) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Section Content */}
                  {expandedSections.includes(section.title) && (
                    <div className="border-t border-neutral-100">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-6 border-b border-neutral-100 last:border-b-0"
                        >
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer">
                              <h3 className="font-medium text-neutral-900">
                                {item.q}
                              </h3>
                              <svg
                                className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <p className="mt-4 text-neutral-600 leading-relaxed">
                              {item.a}
                            </p>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredSections.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No results found
                </h3>
                <p className="text-neutral-600 mb-6">
                  Try different keywords or browse the categories above
                </p>
              </div>
            )}

            {/* Contact Support */}
            <div className="mt-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 text-white">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Still need help?
                </h2>
                <p className="text-primary-100 mb-8 max-w-lg mx-auto">
                  Our support team is here to assist you with any questions or issues
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="mailto:support@pandaportal.example"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
                  >
                    <span className="mr-2">📧</span>
                    Email Support
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <span className="mr-2">💬</span>
                    Live Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
