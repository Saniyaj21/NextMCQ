'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { FiUser, FiBook, FiGift, FiCheck } from 'react-icons/fi';
import { BiCoin } from 'react-icons/bi';
import axios from 'axios';
import Loading from '@/components/Loading';

export default function OnboardPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'student'
  });
  
  const [referralApplied, setReferralApplied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  
  // Check if user already exists when component mounts
  useEffect(() => {
    if (isLoaded && user) {
      checkUser();
    }
  }, [isLoaded, user]);

  // Function to check if user exists
  const checkUser = async () => {
    try {
      const { data: exists } = await axios.get(`/api/users/check?clerkId=${user.id}`);
      
      if (exists) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };
  
  // Check for stored referral code on component mount
  useEffect(() => {
    // Try to get referral from localStorage first
    const storedReferral = localStorage.getItem('referralCode');
    
    if (storedReferral) {
      try {
        const referralData = JSON.parse(storedReferral);
        
        // Check if referral code has expired
        if (referralData.expires && referralData.expires > new Date().getTime()) {
          setReferralCode(referralData.code);
          setReferralApplied(true);
        } else {
          // Clear expired referral
          localStorage.removeItem('referralCode');
        }
      } catch (e) {
        // If JSON parse fails, try to use the string directly
        setReferralCode(storedReferral);
        setReferralApplied(true);
      }
    } else {
      // Fallback to cookies if localStorage failed
      const cookies = document.cookie.split(';');
      const referralCookie = cookies.find(cookie => cookie.trim().startsWith('referralCode='));
      
      if (referralCookie) {
        const code = referralCookie.split('=')[1];
        setReferralCode(code);
        setReferralApplied(true);
      }
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const { data } = await axios.post('/api/users', {
        clerkId: user.id,
        email: user?.primaryEmailAddress?.emailAddress,
        name: formData.fullName,
        role: formData.role,
        inviteCode: referralCode
      });

      // Show success message with coins earned
      setSuccess({
        coins: data.user.coins,
        wasReferred: !!data.user.referredBy
      });

      // Clear stored referral data
      localStorage.removeItem('referralCode');
      document.cookie = 'referralCode=; max-age=0; path=/; SameSite=Lax';
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
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
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FiCheck className="text-green-500 text-xl" />
              <span className="font-medium">Profile Created Successfully!</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <BiCoin className="text-xl" />
              <span>
                You earned {success.coins} coins
                {success.wasReferred ? ' (including referral bonus)' : ''}!
              </span>
            </div>
            <p className="text-sm text-green-600 mt-2">
              Redirecting to dashboard in 3 seconds...
            </p>
          </div>
        )}
        
        {/* Referral Applied Message */}
        {referralApplied && !success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-6 flex items-center gap-2">
            <FiGift className="text-green-500" />
            <span>Invitation code applied - you'll get bonus coins!</span>
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
              disabled={isSubmitting || success}
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
                } ${(isSubmitting || success) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isSubmitting && !success && setFormData(prev => ({ ...prev, role: 'student' }))}
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
                } ${(isSubmitting || success) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isSubmitting && !success && setFormData(prev => ({ ...prev, role: 'teacher' }))}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiBook className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-medium">Teacher</div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || success}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
              ${(isSubmitting || success) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
            `}
          >
            {isSubmitting ? 'Creating Profile...' : success ? 'Profile Created!' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
} 