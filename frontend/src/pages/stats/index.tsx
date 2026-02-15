/**
 * 🎨 Professional Statistics Page
 */
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Stats() {
  const stats = {
    genomes: [
      {
        name: 'Giant Panda',
        species: 'Ailuropoda melanoleuca',
        assembly: 'ASM200744v3',
        chromosomes: 21,
        totalSize: '2.24 Gb',
        geneCount: 218,
        annotation: 'RefSeq Annotation Release 109',
        color: 'from-black to-neutral-800',
      },
      {
        name: 'Snow Leopard',
        species: 'Panthera uncia',
        assembly: 'ASM016859v3',
        chromosomes: 18,
        totalSize: '2.45 Gb',
        geneCount: 198,
        annotation: 'NCBI RefSeq',
        color: 'from-gray-600 to-gray-800',
      },
    ],
    datasets: {
      total: 0,
      byType: {
        genome: 0,
        transcriptome: 0,
        variant: 0,
        alignment: 0,
        other: 0,
      },
    },
    users: {
      total: 3,
      byRole: {
        admin: 1,
        researcher: 1,
        collaborator: 0,
        registered: 1,
      },
    },
    activity: {
      queries: 156,
      downloads: 42,
      uploads: 3,
    },
  };

  const activityData = [
    { day: 'Mon', queries: 24, downloads: 6 },
    { day: 'Tue', queries: 32, downloads: 8 },
    { day: 'Wed', queries: 28, downloads: 5 },
    { day: 'Thu', queries: 35, downloads: 9 },
    { day: 'Fri', queries: 22, downloads: 7 },
    { day: 'Sat', queries: 10, downloads: 4 },
    { day: 'Sun', queries: 5, downloads: 3 },
  ];

  return (
    <>
      <Head>
        <title>Statistics - Panda Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900">Platform Statistics</h1>
              <p className="text-neutral-600 mt-1">Overview of genomic data and platform usage</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Reference Genomes', value: '2', icon: '🧬', color: 'from-blue-500 to-blue-700' },
                { label: 'Active Users', value: '3', icon: '👥', color: 'from-green-500 to-green-700' },
                { label: 'Queries Today', value: '156', icon: '🔍', color: 'from-purple-500 to-purple-700' },
                { label: 'Downloads Today', value: '42', icon: '⬇️', color: 'from-orange-500 to-orange-700' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Reference Genomes */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Reference Genomes</h2>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  2 assemblies
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {stats.genomes.map((genome, idx) => (
                  <div
                    key={idx}
                    className="border border-neutral-200 rounded-xl overflow-hidden hover:border-primary-300 transition-colors"
                  >
                    {/* Genome Header */}
                    <div className={`bg-gradient-to-r ${genome.color} p-6 text-white`}>
                      <div className="flex items-center space-x-4">
                        <span className="text-5xl">{idx === 0 ? '🐼' : '🐆'}</span>
                        <div>
                          <h3 className="text-xl font-bold">{genome.name}</h3>
                          <p className="text-white/80 text-sm">{genome.species}</p>
                        </div>
                      </div>
                    </div>

                    {/* Genome Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <p className="text-sm text-neutral-500">Assembly</p>
                          <p className="font-semibold text-neutral-900">{genome.assembly}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <p className="text-sm text-neutral-500">Chromosomes</p>
                          <p className="font-semibold text-neutral-900">{genome.chromosomes}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <p className="text-sm text-neutral-500">Total Size</p>
                          <p className="font-semibold text-neutral-900">{genome.totalSize}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <p className="text-sm text-neutral-500">Genes</p>
                          <p className="font-semibold text-neutral-900">{genome.geneCount}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <p className="text-sm text-neutral-500">Annotation</p>
                        <p className="text-neutral-700">{genome.annotation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Chart & User Stats */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Activity Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Weekly Activity</h2>
                <div className="space-y-4">
                  {activityData.map((day, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="w-8 text-sm text-neutral-500">{day.day}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-8 bg-primary-100 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg transition-all duration-500"
                              style={{ width: `${(day.queries / 40) * 100}%` }}
                            />
                          </div>
                          <span className="w-12 text-sm text-right text-neutral-600">{day.queries}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-8 bg-green-100 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-lg transition-all duration-500"
                            style={{ width: `${(day.downloads / 10) * 100}%` }}
                          />
                        </div>
                        <span className="w-8 text-sm text-right text-neutral-600">{day.downloads}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary-500 rounded" />
                    <span className="text-sm text-neutral-600">Queries</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-sm text-neutral-600">Downloads</span>
                  </div>
                </div>
              </div>

              {/* User Statistics */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">User Distribution</h2>
                
                {/* Total Users */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e2e8f0"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#3b82f6"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${(stats.users.total / 5) * 352} 352`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-neutral-900">{stats.users.total}</span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <p className="text-lg font-semibold text-neutral-900">Total Users</p>
                    <p className="text-sm text-neutral-500">Platform members</p>
                  </div>
                </div>

                {/* Role Distribution */}
                <div className="space-y-3">
                  {Object.entries(stats.users.byRole).map(([role, count]) => (
                    <div key={role} className="flex items-center">
                      <span className="w-28 text-sm text-neutral-600 capitalize">{role}</span>
                      <div className="flex-1 mx-4">
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              role === 'admin' ? 'bg-purple-500' :
                              role === 'researcher' ? 'bg-blue-500' :
                              role === 'collaborator' ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(count / stats.users.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-8 text-sm text-right font-medium text-neutral-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '🧬', label: 'Genome Browser', href: '/genome-browser' },
                  { icon: '📊', label: 'Browse Data', href: '/datasets' },
                  { icon: '🧬', label: 'Run BLAST', href: '/tools/blast' },
                  { icon: '📤', label: 'Export Data', href: '/export' },
                ].map((action, idx) => (
                  <a
                    key={idx}
                    href={action.href}
                    className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300"
                  >
                    <span className="text-3xl mb-3">{action.icon}</span>
                    <span className="font-medium">{action.label}</span>
                  </a>
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
