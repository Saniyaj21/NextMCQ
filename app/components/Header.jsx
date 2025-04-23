'use client';

import Link from 'next/link';
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function Header() {
  const showHeader = useScrollDirection();

  return (
    <header className={`w-full bg-white shadow-md fixed top-0 transition-transform duration-300 z-50 ${
      showHeader ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-xl font-bold text-gray-800 transition-all duration-300 hover:scale-105 hover:text-blue-600 group animate-pulse"
          >
            Next<span className="text-blue-600 group-hover:text-gray-800">MCQ</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/sign-in" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}