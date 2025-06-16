import React from 'react';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Lead Instructor',
      image: 'https://placehold.co/200x200',
    },
    {
      name: 'Jane Smith',
      role: 'Senior Instructor',
      image: 'https://placehold.co/200x200',
    },
    {
      name: 'Mike Johnson',
      role: 'Course Developer',
      image: 'https://placehold.co/200x200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About Us</h1>
        
        {/* General Instructions Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">General Instructions</h2>
            <div className="space-y-4 text-gray-600">
              <p>Welcome to our learning platform! Here's how to get started:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Browse through our comprehensive course catalog</li>
                <li>Select courses that match your learning goals</li>
                <li>Track your progress through our intuitive dashboard</li>
                <li>Engage with instructors and fellow learners</li>
                <li>Complete assessments to earn certificates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mission and Vision Section */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To empower learners worldwide with accessible, high-quality education that transforms
              lives and careers through innovative learning experiences and practical knowledge.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the global leader in online education, creating a world where quality learning
              is accessible to everyone, everywhere, at any time.
            </p>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs; 