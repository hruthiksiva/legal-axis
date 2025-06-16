import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connect with Top Legal Professionals
            </h1>
            <p className="text-xl mb-8">
              The premier platform for freelance lawyers and legal services. Find the perfect legal expert for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/find-lawyer" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Find a Lawyer
              </Link>
              <Link to="/join" className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Join as a Lawyer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Legacy</h2>
            <p className="text-lg text-gray-600 mb-8">
              With over a decade of experience, we've helped thousands of clients connect with qualified legal professionals. 
              Our platform has become the trusted choice for both lawyers and clients seeking quality legal services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-gray-600">Years of Excellence</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
                <div className="text-gray-600">Verified Lawyers</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">50k+</div>
                <div className="text-gray-600">Successful Cases</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-blue-600 text-2xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-3">Contract Review</h3>
              <p className="text-gray-600">Expert review and drafting of legal contracts and agreements.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-blue-600 text-2xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold mb-3">Legal Consultation</h3>
              <p className="text-gray-600">One-on-one consultations with experienced legal professionals.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-blue-600 text-2xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-3">Document Preparation</h3>
              <p className="text-gray-600">Professional preparation of legal documents and filings.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-blue-600 text-2xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-3">Business Law</h3>
              <p className="text-gray-600">Comprehensive business legal services and compliance.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-blue-600 text-2xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3">Family Law</h3>
              <p className="text-gray-600">Expert guidance in family and personal legal matters.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-blue-600 text-2xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-3">Employment Law</h3>
              <p className="text-gray-600">Workplace legal issues and employment contracts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-sm">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15min</div>
              <div className="text-sm">Average Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-sm">Verified Lawyers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4">
                "Found the perfect lawyer for my business needs. The platform made it easy to compare different professionals."
              </p>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm text-gray-500">Business Owner</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4">
                "As a lawyer, this platform has helped me grow my practice and connect with clients I wouldn't have reached otherwise."
              </p>
              <div className="font-semibold">Michael Chen</div>
              <div className="text-sm text-gray-500">Corporate Lawyer</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4">
                "The quality of legal professionals on this platform is outstanding. Highly recommended!"
              </p>
              <div className="font-semibold">Emily Rodriguez</div>
              <div className="text-sm text-gray-500">Startup Founder</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Card */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions? Our team is here to help you find the perfect legal solution.
              </p>
              <Link 
                to="/contact" 
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 