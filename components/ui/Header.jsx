'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignOutButton, useClerk } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { FiHome, FiUser, FiLogOut, FiMenu, FiCheck, FiTrendingUp } from 'react-icons/fi';

// Custom implementation of useScrollDirection
function useScrollDirection() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) { // if scroll down hide the navbar
          setShow(false);
        } else { // if scroll up show the navbar
          setShow(true);
        }

        // remember current page location to use in the next move
        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return show;
}

export default function Header() {
  const showHeader = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useClerk();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    setIsMenuOpen(false);
    signOut(() => {
      window.location.href = '/';
    });
  };

  return (
    <header className={`w-full bg-white shadow-md fixed top-0 transition-transform duration-300 z-50 ${
      showHeader ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <nav className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="text-xl font-bold text-gray-800 transition-all duration-300 hover:scale-105 hover:text-blue-600 group animate-pulse"
          >
            Next<span className="text-blue-600 group-hover:text-gray-800">MCQ</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
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
              <div className="flex items-center gap-4">
                <Link href="/dashboard" onClick={closeMenu} className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <FiHome className="text-lg" />
                  Dashboard
                </Link>
                <Link href="/leaderboard" onClick={closeMenu} className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <FiTrendingUp className="text-lg" />
                  Leaderboard
                </Link>
                <Link href="/profile" onClick={closeMenu} className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <FiUser className="text-lg" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition duration-200 font-medium border border-blue-700 flex items-center gap-1"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            </SignedIn>
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button 
              className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-60 opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col items-center gap-4 pt-2">
            <SignedOut>
              <div className="w-full">
                <SignInButton mode="modal">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="w-full flex flex-col items-center gap-3">
                <Link href="/dashboard" onClick={closeMenu} className="w-full text-center py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200 flex items-center justify-center gap-2">
                  <FiHome className="text-lg" />
                  Dashboard
                </Link>
                <Link href="/leaderboard" onClick={closeMenu} className="w-full text-center py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200 flex items-center justify-center gap-2">
                  <FiTrendingUp className="text-lg" />
                  Leaderboard
                </Link>
                <Link href="/profile" onClick={closeMenu} className="w-full text-center py-2 text-gray-600 hover:text-gray-900 border-b border-gray-200 flex items-center justify-center gap-2">
                  <FiUser className="text-lg" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium border border-blue-700 flex items-center justify-center gap-2"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}