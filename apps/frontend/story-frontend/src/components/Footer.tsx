import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              © 2024 Story Creator. Tous droits réservés.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Admin Login
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/mentions-legales"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Mentions Légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}