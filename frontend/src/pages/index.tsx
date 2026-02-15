/**
 * 🎨 Professional Home Page - Redesigned
 */
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const stats = [
    { value: '2', label: 'Reference Genomes', icon: '🧬' },
    { value: '21', label: 'Chromosomes', icon: '🔢' },
    { value: '416', label: 'Annotated Genes', icon: '📊' },
    { value: '3', label: 'Active Users', icon: '👥' },
  ];

  const features = [
    {
      icon: '🧬',
      title: 'Genome Browser',
      description: 'Explore panda genomes with JBrowse2 or IGV. Two powerful visualization tools with smooth navigation, zoom, and feature search.',
      href: '/genome-browser',
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/30',
    },
    {
      icon: '🔬',
      title: 'BLAST Search',
      description: 'Find similar sequences in our reference databases. Supports nucleotide and protein searches with customizable parameters.',
      href: '/tools/blast',
      color: 'from-green-500 to-green-700',
      shadow: 'shadow-green-500/30',
    },
    {
      icon: '📊',
      title: 'Dataset Library',
      description: 'Access curated genomic datasets including genomes, transcriptomes, and variant files. Upload and share your own research data.',
      href: '/datasets',
      color: 'from-purple-500 to-purple-700',
      shadow: 'shadow-purple-500/30',
    },
    {
      icon: '🌳',
      title: 'Pedigree Database',
      description: 'Explore family relationships and breeding history of pandas in our research program. Interactive tree visualizations available.',
      href: '/pedigree',
      color: 'from-orange-500 to-orange-700',
      shadow: 'shadow-orange-500/30',
    },
    {
      icon: '📈',
      title: 'Statistics',
      description: 'Comprehensive platform usage statistics, genome coverage, and research metrics.',
      href: '/stats',
      color: 'from-red-500 to-red-700',
      shadow: 'shadow-red-500/30',
    },
  ];

  const quickLinks = [
    { name: 'Browse Genomes', href: '/genome-browser', icon: '→' },
    { name: 'Search Datasets', href: '/datasets', icon: '→' },
    { name: 'Run BLAST', href: '/tools/blast', icon: '→' },
    { name: 'View Statistics', href: '/stats', icon: '→' },
    { name: 'API Documentation', href: '/api-docs', icon: '→' },
    { name: 'Get Help', href: '/help', icon: '→' },
  ];

  return (
    <>
      <Head>
        <title>Panda Portal - Genomic Research Center</title>
        <meta name="description" content="Advanced genomic data center for panda research and conservation" />
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white">Genomic Research Platform v1.0</span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                Panda Portal
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-10 leading-relaxed">
                Advanced genomic data center for panda research and conservation. 
                Explore, analyze, and share genomic data with powerful research tools.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Link
                  href="/genome-browser"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-amber-900 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-500/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="mr-2">🧬</span>
                  Explore Genomes
                </Link>
                <Link
                  href="/datasets"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-900 bg-white rounded-xl hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="mr-2">📊</span>
                  Browse Data
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path 
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
                fill="#f8fafc"
              />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Features</span>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">Powerful Research Tools</h2>
              <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to explore, analyze, and share panda genomic data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <Link
                  key={idx}
                  href={feature.href}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                >
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`} />
                  
                  <div className="p-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6 shadow-lg ${feature.shadow}`}>
                      {feature.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 group"
                  >
                    <span className="font-medium text-white">{link.name}</span>
                    <span className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
                      {link.icon}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">About</span>
                <h2 className="mt-2 text-4xl font-bold text-slate-900 mb-6">
                  Advancing Panda Research
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Panda Portal is a comprehensive genomic data center designed specifically 
                  for panda research and conservation efforts. Built with modern web technologies,
                  it provides powerful tools for genomic exploration, sequence analysis, and data sharing.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  Inspired by the CAENDR project, our platform combines the best practices 
                  in bioinformatics with a user-friendly interface, making genomic data 
                  accessible to researchers worldwide.
                </p>
                <Link
                  href="/help"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Learn more about our mission
                  <span className="ml-2">→</span>
                </Link>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-amber-100 rounded-3xl p-8">
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Panda Portal?</h3>
                    <ul className="space-y-4">
                      {[
                        'Advanced JBrowse2 genome visualization',
                        'BLAST sequence similarity search',
                        'Comprehensive dataset management',
                        'Interactive pedigree visualizations',
                        'RESTful API for programmatic access',
                        'Secure user authentication system',
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Explore the Panda Genome?
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Start your research journey today with our powerful genomic tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-amber-700 bg-white rounded-xl hover:bg-amber-50 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Create Free Account
              </Link>
              <Link
                href="/genome-browser"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Explore as Guest
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
