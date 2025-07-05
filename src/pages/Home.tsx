import * as React from 'react';
import { Link } from 'react-router-dom';
import FadeInSection from '../components/animations/FadeInSection';
import CountUp from 'react-countup';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <FadeInSection>
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Connect with Top Legal Professionals
              </h1>
              <p className="text-xl mb-8 text-gray-700">
                The premier platform for freelance lawyers and legal services. Find the perfect legal expert for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/lawyers"
                  className="px-6 py-3 rounded-full text-white bg-black hover:bg-gray-900 font-semibold shadow-md transition-all duration-300 ease-in-out hover:scale-105"
                >
                  Find a Lawyer
                </Link>
                <Link
                  to="/join"
                  className="px-6 py-3 rounded-full text-black border border-black hover:bg-black hover:text-white font-semibold shadow-md transition-all duration-300 ease-in-out hover:scale-105"
                >
                  Join as a Lawyer
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Legacy Section */}
      <FadeInSection delay={0.2}>
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Legacy</h2>
              <p className="text-lg text-gray-700 mb-8">
                With over a decade of experience, we've helped thousands of clients connect with qualified legal professionals.
                Our platform has become the trusted choice for both lawyers and clients seeking quality legal services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  { end: 10, suffix: '+', desc: 'Years of Excellence' },
                  { end: 5000, suffix: '+', desc: 'Verified Lawyers' },
                  { end: 50000, suffix: '+', desc: 'Successful Cases' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="transition transform hover:-translate-y-2 duration-300 ease-in-out shadow-md p-6 rounded-lg bg-white border border-gray-200"
                  >
                    <div className="text-4xl font-bold mb-2">
                      <CountUp end={item.end} duration={2.5} separator="," suffix={item.suffix} />
                    </div>
                    <div className="text-gray-700">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Services Section */}
      <FadeInSection delay={0.4}>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                ['📝', 'Contract Review', 'Expert review and drafting of legal contracts and agreements.'],
                ['⚖️', 'Legal Consultation', 'One-on-one consultations with experienced legal professionals.'],
                ['📋', 'Document Preparation', 'Professional preparation of legal documents and filings.'],
                ['🏢', 'Business Law', 'Comprehensive business legal services and compliance.'],
                ['👥', 'Family Law', 'Expert guidance in family and personal legal matters.'],
                ['💼', 'Employment Law', 'Workplace legal issues and employment contracts.'],
              ].map(([icon, title, desc], idx) => (
                <div
                  key={idx}
                  className="transition transform hover:-translate-y-1 hover:shadow-lg duration-300 ease-in-out p-6 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <div className="text-4xl mb-4 text-black">{icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-black">{title}</h3>
                  <p className="text-gray-700">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
};

export default Home;




