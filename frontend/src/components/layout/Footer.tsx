/**
 * 🎨 Enhanced Footer Component - Professional Design
 */
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Genome Browser', href: '/genome-browser' },
      { label: 'BLAST Tool', href: '/tools/blast' },
      { label: 'Datasets', href: '/datasets' },
      { label: 'Pedigree', href: '/pedigree' },
    ],
    resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'API Docs', href: '/api-docs' },
      { label: 'Statistics', href: '/stats' },
      { label: 'Export Data', href: '/export' },
    ],
    about: [
      { label: 'About Us', href: '#' },
      { label: 'Research', href: '#' },
      { label: 'Publications', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <span className="text-4xl">🐼</span>
              <div>
                <span className="font-bold text-xl block">Panda Portal</span>
                <span className="text-xs text-neutral-400">Genomic Research Center</span>
              </div>
            </Link>
            <p className="text-neutral-400 text-sm mb-6">
              Advanced genomic data platform for panda research and conservation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-primary-600 hover:text-white transition-all duration-200">
                <span className="text-lg">𝕏</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-blue-600 hover:text-white transition-all duration-200">
                <span className="text-lg">in</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-green-500 hover:text-white transition-all duration-200">
                <span className="text-lg">📧</span>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-300 mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-300 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-300 mb-4">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats Card */}
          <div className="hidden lg:block bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6">
            <h4 className="font-semibold text-white mb-4">Platform Statistics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 text-sm">Genomes</span>
                <span className="font-bold text-white text-xl">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 text-sm">Datasets</span>
                <span className="font-bold text-white text-xl">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 text-sm">Users</span>
                <span className="font-bold text-white text-xl">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 text-sm">Queries</span>
                <span className="font-bold text-white text-xl">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-neutral-400 text-sm">
              <span>© {currentYear} Panda Portal. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
                Data Usage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
