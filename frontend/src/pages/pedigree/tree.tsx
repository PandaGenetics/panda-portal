/**
 * 🎨 Professional Pedigree Tree Page
 */
import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface PedigreeNode {
  id: string;
  name: string;
  sex: 'male' | 'female' | 'unknown';
  birthDate?: string;
  parents: string[];
  children: string[];
}

const samplePedigree = {
  generations: 4,
  nodes: [
    { id: 'founder1', name: 'Pan Bei', sex: 'male', birthDate: '2000-01-01', parents: [], children: ['panda1', 'panda2'] },
    { id: 'founder2', name: 'Mao Mao', sex: 'female', birthDate: '2000-06-01', parents: [], children: ['panda1', 'panda2'] },
    { id: 'panda1', name: 'Su Su', sex: 'female', birthDate: '2004-08-01', parents: ['founder1', 'founder2'], children: ['panda3'] },
    { id: 'panda2', name: 'Xi Xi', sex: 'male', birthDate: '2005-03-01', parents: ['founder1', 'founder2'], children: ['panda3', 'panda4'] },
    { id: 'panda3', name: 'Tian Tian', sex: 'male', birthDate: '2007-08-01', parents: ['panda1', 'panda2'], children: ['panda5', 'panda6'] },
    { id: 'panda4', name: 'Zhi Zhi', sex: 'female', birthDate: '2009-06-01', parents: ['panda1', 'panda2'], children: ['panda5'] },
    { id: 'panda5', name: 'Bao Lei', sex: 'male', birthDate: '2015-08-01', parents: ['panda3', 'panda4'], children: [] },
    { id: 'panda6', name: 'Mei Lun', sex: 'female', birthDate: '2017-06-01', parents: ['panda3', 'panda4'], children: [] },
  ],
};

export default function PedigreeTree() {
  const [pedigree] = useState(samplePedigree);
  const [selectedNode, setSelectedNode] = useState<PedigreeNode | null>(null);
  const [filterSex, setFilterSex] = useState<string>('all');

  const filteredNodes = filterSex === 'all' 
    ? pedigree.nodes 
    : pedigree.nodes.filter(n => n.sex === filterSex);

  const getGen = (node: PedigreeNode): number => {
    if (node.parents.length === 0) return 1;
    const parentGens = node.parents.map(pid => {
      const parent = pedigree.nodes.find(n => n.id === pid);
      return parent ? getGen(parent) + 1 : 1;
    });
    return Math.max(...parentGens);
  };

  const nodesByGen = filteredNodes.reduce((acc, node) => {
    const gen = getGen(node);
    if (!acc[gen]) acc[gen] = [];
    acc[gen].push(node);
    return acc;
  }, {} as Record<number, PedigreeNode[]>);

  const sortedGens = Object.keys(nodesByGen).map(Number).sort((a, b) => a - b);

  return (
    <>
      <Head>
        <title>Pedigree Tree - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">🌳 Pedigree Tree</h1>
                <p className="text-neutral-600">Interactive family relationship visualization</p>
              </div>
              <select
                value={filterSex}
                onChange={(e) => setFilterSex(e.target.value)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Pandas</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>
            </div>

            {/* Tree Visualization */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 overflow-x-auto">
              <div className="min-w-[800px]">
                {sortedGens.map(gen => (
                  <div key={gen} className="mb-12">
                    <h3 className="text-sm text-neutral-500 mb-4 text-center">Generation {gen}</h3>
                    <div className="flex justify-center space-x-8 flex-wrap">
                      {nodesByGen[gen].map(node => (
                        <div key={node.id} className="relative">
                          {node.parents.length > 0 && (
                            <div className="absolute w-0.5 h-8 bg-neutral-300 -top-8 left-1/2 transform -translate-x-1/2" />
                          )}
                          <button
                            onClick={() => setSelectedNode(node)}
                            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 ${
                              selectedNode?.id === node.id 
                                ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/30 transform scale-105'
                                : 'border-neutral-200 hover:border-orange-300 bg-white hover:shadow-lg'
                            }`}
                          >
                            <span className="text-4xl">
                              {node.sex === 'male' ? '♂' : node.sex === 'female' ? '♀' : '?'}
                            </span>
                            <span className="text-sm font-medium mt-2 truncate px-2 max-w-full">
                              {node.name}
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Panda Details */}
            <div className="grid lg:grid-cols-3 gap-8">
              {selectedNode && (
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">📋 {selectedNode.name}</h2>
                  <div className="space-y-3">
                    {[
                      ['ID', selectedNode.id],
                      ['Sex', selectedNode.sex.charAt(0).toUpperCase() + selectedNode.sex.slice(1)],
                      ['Birth Date', selectedNode.birthDate || 'Unknown'],
                      ['Parents', selectedNode.parents.length > 0 
                        ? selectedNode.parents.map(pid => pedigree.nodes.find(n => n.id === pid)?.name).join(', ')
                        : 'Founder'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-neutral-500">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Pandas', value: pedigree.nodes.length, icon: '🐼', color: 'bg-blue-100 text-blue-700' },
                  { label: 'Males', value: pedigree.nodes.filter(n => n.sex === 'male').length, icon: '♂', color: 'bg-blue-100 text-blue-700' },
                  { label: 'Females', value: pedigree.nodes.filter(n => n.sex === 'female').length, icon: '♀', color: 'bg-pink-100 text-pink-700' },
                  { label: 'Generations', value: pedigree.generations, icon: '🌳', color: 'bg-green-100 text-green-700' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <span className="text-3xl mb-2 block">{stat.icon}</span>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
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
