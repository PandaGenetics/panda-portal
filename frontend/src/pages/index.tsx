"""
Home page
"""
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const features = [
    {
      icon: '🧬',
      title: 'Genome Browser',
      description: 'Explore giant panda and snow leopard genomes with IGV.js and JBrowse2',
      href: '/genome-browser',
    },
    {
      icon: '📊',
      title: 'Dataset Browser',
      description: 'Search and download genomic datasets for your research',
      href: '/datasets',
    },
    {
      icon: '🔬',
      title: 'BLAST',
      description: 'Align and compare sequences against our genomic databases',
      href: '/tools/blast',
    },
    {
      icon: '🐼',
      title: 'Pedigree',
      description: 'View and analyze panda family trees and lineage information',
      href: '/pedigree',
    },
  ];

  return (
    <>
      <Head>
        <title>Panda Portal - Genomic Data Center</title>
        <meta name="description" content="Giant panda genomic data center" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        {/* Hero section */}
        <section className="bg-gradient-to-br from-panda-black to-gray-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🐼 Panda Portal
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              A comprehensive genomic data center for giant panda research.
              Explore genomes, analyze data, and advance conservation science.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/genome-browser"
                className="px-8 py-3 bg-panda-accent text-white rounded-lg hover:bg-opacity-90 transition-colors text-lg font-medium"
              >
                Explore Genomes
              </Link>
              <Link
                href="/datasets"
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-panda-black transition-colors text-lg font-medium"
              >
                Browse Data
              </Link>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Features & Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-panda-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">About Panda Portal</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Panda Portal is a genomic data center designed to support
                research on giant pandas and related species. Built with
                modern web technologies, it provides powerful tools for
                genomic exploration, sequence analysis, and data sharing.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mt-4">
                This portal is developed as a next-generation platform,
                inspired by the CAENDR project and customized for the unique
                needs of panda research.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
