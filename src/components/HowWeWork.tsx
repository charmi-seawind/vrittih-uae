import { Mail, Users, Search, Building2, Database, Shield } from 'lucide-react';

export default function HowWeWork() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Work</h2>
          <p className="text-lg text-gray-600">Connecting talent with opportunities through our proven process</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Job Seekers Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">For Job Seekers</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Submit Your Resume</h4>
                  <p className="text-gray-600">Send your updated resume to <span className="font-medium text-blue-600">job@vrrittih.com</span> with details about your preferred industry or sector.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Search className="h-6 w-6 text-blue-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Consultation</h4>
                  <p className="text-gray-600">Our team contacts you personally to understand your preferences, career goals, and specific requirements.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-6 w-6 text-blue-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Screening</h4>
                  <p className="text-gray-600">Our experienced panel evaluates and screens candidates to match client requirements effectively.</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Global Network:</strong> We maintain strong relationships with corporate professionals worldwide, including India, for location-specific opportunities.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>For Freshers:</strong> We ensure career starters get opportunities with recognized organizations to launch their professional journey.
                </p>
              </div>
            </div>
          </div>

          {/* Employers Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Building2 className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">For Employers</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Database className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Comprehensive Services</h4>
                  <p className="text-gray-600">Access our wide range of free and paid job listing services for employers, consultants, and companies.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Search className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pre-filtered Database</h4>
                  <p className="text-gray-600">Get access to our candidate database that's pre-screened and filtered according to your specific needs.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Expert Recruitment Team</h4>
                  <p className="text-gray-600">Our recruitment specialists screen CVs and resumes to serve our clients' specific requirements.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Background Verification</h4>
                  <p className="text-gray-600">We conduct thorough background checks to minimize hiring risks and ensure quality candidates.</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Extensive Database:</strong> Years of experience have helped us build a large database of both fresh and experienced candidates across industries.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Client Focus:</strong> Our panel understands the core of client requirements and works dedicatedly to fulfill them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6">Join thousands of successful placements through our proven process</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Post Your Resume
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Hire Talent
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}