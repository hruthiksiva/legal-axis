import * as React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-200 shadow-inner">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Legal Axis</h3>
            <p className="text-gray-600">
              Connecting clients with top legal professionals for quality legal services.
            </p>
          </div>

          {/* Quick Links */}
<div>
  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
  <ul className="space-y-2">
    <li>
      <Link to="/" className="text-gray-600 hover:text-orange-500 transition duration-300">
        Home
      </Link>
    </li>
    <li>
      <Link to="/lawyers" className="text-gray-600 hover:text-orange-500 transition duration-300">
        Find a Lawyer
      </Link>
    </li>
    <li>
      <Link to="/join" className="text-gray-600 hover:text-orange-500 transition duration-300">
        Join as a Lawyer
      </Link>
    </li>
    <li>
      <Link to="/about" className="text-gray-600 hover:text-orange-500 transition duration-300">
        About Us
      </Link>
    </li>
  </ul>
</div>


          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/contract-review" className="text-gray-600 hover:text-orange-500 transition duration-300">
                  Contract Review
                </Link>
              </li>
              <li>
                <Link to="/services/legal-consultation" className="text-gray-600 hover:text-orange-500 transition duration-300">
                  Legal Consultation
                </Link>
              </li>
              <li>
                <Link to="/services/document-preparation" className="text-gray-600 hover:text-orange-500 transition duration-300">
                  Document Preparation
                </Link>
              </li>
              <li>
                <Link to="/services/business-law" className="text-gray-600 hover:text-orange-500 transition duration-300">
                  Business Law
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Email: info@legalaxis.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>
                Address: 123 Legal Street, Suite 100<br />
                New York, NY 10001
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-center space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-500 transition duration-200"
            >
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-500 transition duration-200"
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-500 transition duration-200"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Legal Axis. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

