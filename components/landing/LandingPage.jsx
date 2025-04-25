import Link from 'next/link';
import { FaBookOpen, FaClipboardCheck, FaTrophy } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Your Studies with Interactive MCQs
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Practice unlimited MCQs, take mock tests, and improve your performance with our engaging learning platform.
            </p>
            <div className="flex gap-4">
              <Link href="/sign-in" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Get Started
              </Link>
              <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Students Learning" 
              className="rounded-lg shadow-xl"
              style={{ maxWidth: '500px', width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition group">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition">
                <FaBookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Unlimited Practice</h3>
              <p className="text-gray-600">Access a vast library of MCQs across various subjects and topics. Practice at your own pace.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition group">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition">
                <FaClipboardCheck className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Mock Tests</h3>
              <p className="text-gray-600">Take teacher-created test sets and get instant feedback on your performance.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition group">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition">
                <FaTrophy className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Leaderboards</h3>
              <p className="text-gray-600">Compete with peers and track your progress on our dynamic leaderboard system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Students Collaborating" 
              className="rounded-lg shadow-xl mx-auto mb-10"
              style={{ maxWidth: '600px', width: '100%', height: 'auto' }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">Join thousands of students improving their scores every day.</p>
          <Link href="/sign-in" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition inline-block">
            Create Free Account
          </Link>
        </div>
      </section>
    </main>
  );
} 