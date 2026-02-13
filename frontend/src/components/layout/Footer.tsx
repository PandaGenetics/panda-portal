"""
Footer component
"""
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🐼 Panda Portal</h3>
            <p className="text-gray-400 text-sm">
              A genomic data center for giant panda research.
              Supporting conservation and scientific discovery.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/genome-browser" className="hover:text-white">Genome Browser</a></li>
              <li><a href="/datasets" className="hover:text-white">Datasets</a></li>
              <li><a href="/tools/blast" className="hover:text-white">BLAST</a></li>
              <li><a href="/pedigree" className="hover:text-white">Pedigree</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              For questions about the portal or data access,
              please contact the research team.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 Panda Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
