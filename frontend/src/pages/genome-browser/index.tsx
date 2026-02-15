/**
 * 🧬 Unified Genome Browser - IGV + JBrowse2 Switcher
 * 用户可以在两个浏览器之间切换选择
 */
import { useState, useEffect, useRef } from 'react';
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
  chromosomes: number;
  total_length: string;
}

type BrowserType = 'jbrowse' | 'igv';

export default function GenomeBrowser() {
  const [browserType, setBrowserType] = useState<BrowserType>('jbrowse');
  const [species, setSpecies] = useState('giant_panda');
  const [refGenome, setRefGenome] = useState<GenomeRef | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jbrowseConfig, setJbrowseConfig] = useState<any>(null);
  const [igvBrowser, setIgvBrowser] = useState<any>(null);
  const igvContainerRef = useRef<HTMLDivElement>(null);
  const [IGVComponent, setIGVComponent] = useState<any>(null);

  const speciesList = [
    { id: 'giant_panda', name: '🐼 Giant Panda (Ailuropoda melanoleuca) ASM200744v3' },
    { id: 'snow_leopard', name: '❄️ Snow Leopard (Panthera uncia) - Coming Soon' },
  ];

  // Load genome configuration
  useEffect(() => {
    loadGenomeConfig();
    loadIGV();
  }, [species]);

  // Initialize JBrowse2 when config is ready
  useEffect(() => {
    if (refGenome && browserType === 'jbrowse' && !jbrowseConfig) {
      setupJBrowse();
    }
  }, [refGenome, browserType]);

  // Initialize IGV when switching to it
  useEffect(() => {
    if (browserType === 'igv' && refGenome && !igvBrowser && IGVComponent) {
      setupIGV();
    }
  }, [browserType, refGenome, IGVComponent]);

  // Cleanup on browser switch
  useEffect(() => {
    return () => {
      if (igvBrowser) {
        igvBrowser.destroy();
      }
    };
  }, [browserType]);

  const loadIGV = async () => {
    if (typeof window !== 'undefined') {
      try {
        const igvModule = await import('igv');
        setIGVComponent(() => igvModule.default || igvModule);
      } catch (err) {
        console.error('Failed to load IGV:', err);
      }
    }
  };

  const loadGenomeConfig = async () => {
    setLoading(true);
    setError(null);
    setJbrowseConfig(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const refResponse = await fetch(`${apiUrl}/api/genome/${species}/refs`);
      const data = await refResponse.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        const ref = data[0] as GenomeRef;
        setRefGenome(ref);
      }
    } catch (err) {
      console.error('Error loading genome:', err);
      setError(`Failed to load genome data: ${err}`);
    }
    setLoading(false);
  };

  const setupJBrowse = () => {
    if (!refGenome) return;
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const fastaUrl = `${apiUrl}${refGenome.fasta_url}`;
    const faiUrl = refGenome.fai_url ? `${apiUrl}${refGenome.fai_url}` : `${fastaUrl}.fai`;
    
    const config = {
      assembly: {
        name: refGenome.name,
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
        name: `${refGenome.name} Overview`,
        view: {
          type: 'LinearGenomeView',
          tracks: ['reference-track'],
        },
      },
    };
    
    setJbrowseConfig(config);
  };

  const setupIGV = async () => {
    if (!refGenome || !igvContainerRef.current || !IGVComponent) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const tracks = [
        {
          name: 'Reference Sequence',
          type: 'sequence',
          order: 100,
        },
      ];
      
      if (refGenome.fasta_url) {
        tracks.push({
          name: 'Reference Genome',
          type: 'alignment',
          format: 'fasta',
          url: `${apiUrl}${refGenome.fasta_url}`,
          indexURL: refGenome.fai_url ? `${apiUrl}${refGenome.fai_url}` : undefined,
          order: 200,
        });
      }
      
      if (refGenome.gff_url) {
        tracks.push({
          name: 'Gene Annotations',
          type: 'annotation',
          format: 'gff3',
          url: `${apiUrl}${refGenome.gff_url}`,
          order: 300,
          color: '#0066CC',
        });
      }
      
      const browser = await IGVComponent.createBrowser(igvContainerRef.current, {
        genome: 'Custom Genome',
        locus: 'chr1:1-1000000',
        tracks: tracks,
      });
      
      setIgvBrowser(browser);
    } catch (err) {
      console.error('Error initializing IGV:', err);
      setError(`Failed to initialize IGV: ${err}`);
    }
  };

  return (
    <>
      <Head>
        <title>Genome Browser - Panda Portal</title>
        <meta name="description" content="Explore panda genomes with IGV or JBrowse2" />
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                🧬 Genome Browser
              </h1>
              <p className="text-slate-600 text-lg">
                Explore panda genomic data with powerful visualization tools
              </p>
            </div>

            {/* Species Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-slate-700 font-medium">Species:</span>
                  <select
                    value={species}
                    onChange={(e) => {
                      setSpecies(e.target.value);
                      setJbrowseConfig(null);
                      setIgvBrowser(null);
                    }}
                    className="border-2 border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    {speciesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {refGenome && (
                  <div className="text-sm text-slate-500">
                    📊 {refGenome.chromosomes} chromosomes • {refGenome.total_length}
                  </div>
                )}
              </div>
            </div>

            {/* Browser Selector Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium mr-2">Choose Browser:</span>
                
                <button
                  onClick={() => setBrowserType('jbrowse')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    browserType === 'jbrowse'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-xl">🧬</span>
                  <span className="font-semibold">JBrowse2</span>
                </button>
                
                <button
                  onClick={() => setBrowserType('igv')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    browserType === 'igv'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-xl">🔬</span>
                  <span className="font-semibold">IGV</span>
                </button>
              </div>
              
              {/* Browser Info */}
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {browserType === 'jbrowse' ? (
                    <>
                      <span className="text-4xl">🧬</span>
                      <div>
                        <h3 className="font-semibold text-amber-800">JBrowse2</h3>
                        <p className="text-sm text-amber-700">
                          Modern genome browser with smooth navigation, zoom, and feature search. 
                          Great for exploring chromosome structure and genomic features.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl">🔬</span>
                      <div>
                        <h3 className="font-semibold text-indigo-800">IGV (Integrative Genomics Viewer)</h3>
                        <p className="text-sm text-indigo-700">
                          Professional genome visualization with multi-track support, variant display, 
                          and advanced analysis tools. Industry standard for genomics research.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 mb-8">
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-amber-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 rounded-full animate-spin border-t-transparent"></div>
                  </div>
                  <p className="mt-6 text-slate-600 text-lg">Loading genome data...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-red-800">Error Loading Genome</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                </div>
                <button 
                  onClick={loadGenomeConfig}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* JBrowse2 Browser */}
            {!loading && !error && browserType === 'jbrowse' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    🧬 {refGenome?.name || 'JBrowse2'}
                  </h2>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">
                    JBrowse2
                  </span>
                </div>
                
                <div style={{ height: '600px' }}>
                  {jbrowseConfig ? (
                    <LinearGenomeView
                      configuration={jbrowseConfig}
                      tracks={jbrowseConfig.tracks}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-slate-100">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                        <p className="text-slate-600">Initializing JBrowse2...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IGV Browser */}
            {!loading && !error && browserType === 'igv' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    🔬 {refGenome?.name || 'IGV'}
                  </h2>
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    IGV v3.7.3
                  </span>
                </div>
                
                <div 
                  ref={igvContainerRef}
                  id="igv-browser"
                  style={{ height: '600px', width: '100%' }}
                >
                  {!igvBrowser && (
                    <div className="flex items-center justify-center h-full bg-slate-100">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                        <p className="text-slate-600">Initializing IGV...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Browser Comparison */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                🔍 Browser Comparison
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Feature</th>
                      <th className="text-center py-3 px-4 font-semibold text-amber-600">JBrowse2</th>
                      <th className="text-center py-3 px-4 font-semibold text-indigo-600">IGV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Multi-track support', jbrowse: '✓', igv: '✓✓' },
                      { feature: 'Zoom & Pan', jbrowse: '✓✓', igv: '✓✓' },
                      { feature: 'Variant visualization', jbrowse: '✓', igv: '✓✓' },
                      { feature: 'Gene annotation', jbrowse: '✓✓', igv: '✓✓' },
                      { feature: 'Sequence display', jbrowse: '✓✓', igv: '✓✓' },
                      { feature: 'Export capabilities', jbrowse: '✓', igv: '✓✓' },
                      { feature: 'BAM/CRAM support', jbrowse: '✓', igv: '✓✓' },
                      { feature: 'VCF display', jbrowse: '✓', igv: '✓✓' },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-700">{row.feature}</td>
                        <td className="py-3 px-4 text-center text-amber-600 font-medium">{row.jbrowse}</td>
                        <td className="py-3 px-4 text-center text-indigo-600 font-medium">{row.igv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-600">
                💡 <strong>Tip:</strong> Both browsers support FASTA and GFF3 formats. 
                IGV provides additional support for BAM, CRAM, and VCF files for variant analysis.
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-amber-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                📖 Browser Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">1</span>
                    Click the buttons above to switch between browsers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">2</span>
                    Scroll to zoom in/out
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">3</span>
                    Drag to pan across the genome
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">4</span>
                    Click on features to see details
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">5</span>
                    Use search to find genes/regions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">6</span>
                    Right-click for track options
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
