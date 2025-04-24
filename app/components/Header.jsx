'use client';

import Link from 'next/link';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';

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
            
            {/* Auth UI */}
            <SignedOut>
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition duration-200 font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </nav>
      </div>
    </header>
  )
}