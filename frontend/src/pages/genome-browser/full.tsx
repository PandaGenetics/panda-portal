/**
 * Genome browser page with JBrowse2 - Full Integration
 */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Dynamic import for JBrowse2 (client-side only)
const LinearGenomeView = dynamic(
  () => import('@jbrowse/react-linear-genome-view').then((mod) => mod.LinearGenomeView),
  { ssr: false }
);

interface GenomeRef {
  id: string;
  name: string;
  description: string;
  fasta_url: string;
  fai_url?: string;
  gff_url?: string;
}

export default function GenomeBrowser() {
  const [species, setSpecies] = useState('giant_panda');
  const [refGenome, setRefGenome] = useState<GenomeRef | null>(null);
  const [loading, setLoading] = useState(true);
  const [jbrowseConfig, setJbrowseConfig] = useState<any>(null);
  const [viewError, setViewError] = useState<string | null>(null);

  const speciesList = [
    { id: 'giant_panda', name: 'Giant Panda (Ailuropoda melanoleuca)' },
    { id: 'snow_leopard', name: 'Snow Leopard (Panthera uncia)' },
  ];

  useEffect(() => {
    loadGenomeConfig();
  }, [species]);

  const loadGenomeConfig = async () => {
    setLoading(true);
    setViewError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Load reference genome
      const refResponse = await fetch(`${apiUrl}/api/genome/${species}/refs`);
      const data = await refResponse.json();
      
      if (data && data.length > 0) {
        const ref = data[0] as GenomeRef;
        setRefGenome(ref);
        
        // Build absolute URLs
        const fastaUrl = `${apiUrl}${ref.fasta_url}`;
        const faiUrl = ref.fai_url ? `${apiUrl}${ref.fai_url}` : `${fastaUrl}.fai`;
        
        // Set up JBrowse2 config
        setJbrowseConfig({
          assembly: {
            name: ref.name,
            sequence: {
              trackId: 'reference',
              type: 'ReferenceSequenceTrack',
              adapter: {
                type: 'IndexedFastaAdapter',
                fasta: { url: fastaUrl },
                fai: { url: faiUrl },
              },
            },
          },
          tracks: [
            {
              trackId: 'reference-track',
              name: 'Reference Sequence',
              type: 'ReferenceSequenceTrack',
              adapter: {
                type: 'IndexedFastaAdapter',
                fasta: { url: fastaUrl },
                fai: { url: faiUrl },
              },
            },
          ],
          defaultSession: {
            name: `${ref.name} Overview`,
            view: {
              type: 'LinearGenomeView',
              tracks: ['reference-track'],
            },
          },
        });
      }
    } catch (error) {
      console.error('Error loading genome config:', error);
      setViewError('Failed to load genome configuration');
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Genome Browser - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">🧬 Genome Browser</h1>

            {/* Species selector */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <label className="font-medium text-gray-700">Species:</label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-panda-accent"
                >
                  {speciesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-accent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading genome data...</p>
                  </div>
                </div>
              ) : viewError ? (
                <div className="flex items-center justify-center h-96 text-red-500">
                  <div className="text-center">
                    <p className="text-xl mb-2">⚠️</p>
                    <p>{viewError}</p>
                  </div>
                </div>
              ) : jbrowseConfig ? (
                <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <LinearGenomeView
                    configuration={jbrowseConfig}
                    tracks={jbrowseConfig.tracks}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <p className="text-xl mb-2">🐼</p>
                    <p>No genome data available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Genome Info */}
            {refGenome && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">📋 Genome Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Reference Name</p>
                    <p className="font-medium">{refGenome.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Description</p>
                    <p className="font-medium">{refGenome.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">FASTA URL</p>
                    <p className="font-mono text-xs break-all">{refGenome.fasta_url}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Help text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-2">📖 Using JBrowse2</h3>
              <ul className="text-blue-700 space-y-2">
                <li>• Select a species from the dropdown above</li>
                <li>• Click and drag to pan across the genome</li>
                <li>• Use scroll wheel or + / - buttons to zoom</li>
                <li>• Right-click on tracks to add/remove</li>
                <li>• Click on features to see details in the popup</li>
              </ul>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
