import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">RetireSmart TR</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Anasayfa
            </Link>
            <Link
              to="/calculate"
              className={`text-sm font-medium transition-colors ${location.pathname === '/calculate' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Hesapla
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
