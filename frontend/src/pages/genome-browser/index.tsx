"""
Genome browser page with IGV.js
"""
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Dynamic import for IGV.js (client-side only)
const LinearGenomeView = dynamic(
  () => import('@jbrowse/react-linear-genome-view').then((mod) => mod.LinearGenomeView),
  { ssr: false }
);

export default function GenomeBrowser() {
  const [species, setSpecies] = useState('giant_panda');
  const [refGenome, setRefGenome] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jbrowseConfig, setJbrowseConfig] = useState<any>(null);

  const speciesList = [
    { id: 'giant_panda', name: 'Giant Panda (Ailuropoda melanoleuca)' },
    { id: 'snow_leopard', name: 'Snow Leopard (Panthera uncia)' },
  ];

  useEffect(() => {
    loadGenomeConfig();
  }, [species]);

  const loadGenomeConfig = async () => {
    setLoading(true);
    try {
      // Load reference genome
      const refResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/genome/${species}/refs`
      );
      const refs = await refResponse.json();
      
      if (refs.data && refs.data.length > 0) {
        const defaultRef = refs.data[0];
        setRefGenome(defaultRef);
        
        // Set up JBrowse2 config
        setJbrowseConfig({
          assembly: {
            name: defaultRef.name,
            sequence: {
              trackId: 'reference',
              ...defaultRef,
            },
          },
          tracks: [
            {
              trackId: 'reference',
              name: 'Reference Sequence',
              type: 'ReferenceSequenceTrack',
              adapter: {
                type: 'TwoBitUriAdapter',
                twoBitUri: defaultRef.fasta_url,
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error loading genome config:', error);
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
              <div className="flex items-center space-x-4 mb-4">
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-accent"></div>
                </div>
              ) : jbrowseConfig ? (
                <div className="border rounded-lg overflow-hidden">
                  <LinearGenomeView
                    configuration={jbrowseConfig}
                    tracks={jbrowseConfig.tracks}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  No genome data available for this species
                </div>
              )}
            </div>

            {/* Help text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-2">
                📖 Using the Genome Browser
              </h3>
              <ul className="text-blue-700 space-y-2">
                <li>• Select a species from the dropdown above</li>
                <li>• Zoom in/out using the mouse wheel or controls</li>
                <li>• Click on features to see details</li>
                <li>• Drag to pan across the genome</li>
                <li>• Use the track selector to add/remove tracks</li>
              </ul>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
