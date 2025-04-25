'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FiUser, FiBook, FiGift, FiCheck } from 'react-icons/fi';
import Loading from '@/components/Loading';

export default function OnboardPage() {
  const { isLoaded } = useUser();
  
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'student', // Default to student
    referralCode: '' // Will be filled from localStorage if available
  });
  
  const [referralApplied, setReferralApplied] = useState(false);
  const [referralReadOnly, setReferralReadOnly] = useState(false);
  
  // Check for stored referral code on component mount
  useEffect(() => {
    // Try to get referral from localStorage first
    const storedReferral = localStorage.getItem('referralCode');
    
    if (storedReferral) {
      try {
        const referralData = JSON.parse(storedReferral);
        
        // Check if referral code has expired
        if (referralData.expires && referralData.expires > new Date().getTime()) {
          setFormData(prev => ({ ...prev, referralCode: referralData.code }));
          setReferralApplied(true);
          setReferralReadOnly(true);
        } else {
          // Clear expired referral
          localStorage.removeItem('referralCode');
        }
      } catch (e) {
        // If JSON parse fails, try to use the string directly
        setFormData(prev => ({ ...prev, referralCode: storedReferral }));
        setReferralApplied(true);
        setReferralReadOnly(true);
      }
    } else {
      // Fallback to cookies if localStorage failed
      const cookies = document.cookie.split(';');
      const referralCookie = cookies.find(cookie => cookie.trim().startsWith('referralCode='));
      
      if (referralCookie) {
        const referralCode = referralCookie.split('=')[1];
        setFormData(prev => ({ ...prev, referralCode }));
        setReferralApplied(true);
        setReferralReadOnly(true);
      }
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission - placeholder
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // In a real implementation, this would save to the database
    
    // Clear stored referral after successful registration
    localStorage.removeItem('referralCode');
    // Clear cookie as well
    document.cookie = 'referralCode=; max-age=0; path=/; SameSite=Lax';
  };

  // Show loading state while clerk user data is loading
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Complete Your Profile</h1>
        
        {/* Referral Applied Message */}
        {referralApplied && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-6 flex items-center gap-2">
            <FiCheck className="text-green-500" />
            <span>Invitation code applied automatically!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="fullName">
              <div className="flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Full Name
              </div>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 font-medium">I am a:</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  formData.role === 'student' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiUser className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-medium">Student</div>
                </div>
              </div>
              
              <div
                className={`border rounded-lg p-4 cursor-pointer ${
                  formData.role === 'teacher' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'teacher' }))}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiBook className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="font-medium">Teacher</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Referral Code (Optional or Auto-filled) */}
          <div className={`mb-8 ${referralApplied ? 'opacity-80' : ''}`}>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="referralCode">
              <div className="flex items-center gap-2">
                <FiGift className="text-purple-600" />
                {referralApplied ? 'Applied Invitation Code' : 'Invitation Code (optional)'}
              </div>
            </label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              readOnly={referralReadOnly}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg 
                ${referralReadOnly ? 'bg-gray-50' : 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
              placeholder={referralApplied ? '' : 'Enter invitation code if you have one'}
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
} 