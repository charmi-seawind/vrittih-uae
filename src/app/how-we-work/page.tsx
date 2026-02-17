"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Mail,
  Users,
  Search,
  Building2,
  Database,
  Shield,
  Phone,
  CheckCircle,
  ArrowRight,
  Target,
} from "lucide-react";

// import VrrittihFooter from "@/components/LandingPage/VrrittihFooter";

const HowWeWorkPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-[#19489e] to-slate-900 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl font-bold text-white mb-4 sm:mb-6">
            How We Work
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Our proven methodology ensures successful placements and long-term
            satisfaction for both candidates and employers
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50 w-full">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8 sm:gap-12 flex-col lg:flex-row">
          {/* About */}
          <div className="w-full lg:w-3/5">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              How We Work
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Vrrittih Job Consultancy is our service that caters to "glocal"
              clients, meaning both global and local organizations, while also
              serving a large pool of clients seeking the correct candidates.
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              At the same time, we cater to the needs of various job-seeking
              candidates who are eagerly looking for the right opportunities for
              themselves.
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              We provide manpower to our clients across all levels of management
              and support hiring needs with accuracy.
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Industries such as cement, pharmacy, electronics, and FMCG are
              among the many sectors we serve—so how do we do this?
            </p>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg border-0 w-full lg:w-2/5">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Get In Touch
              </h3>
              <form className="space-y-3 sm:space-y-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full text-sm sm:text-base"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full text-sm sm:text-base"
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full text-sm sm:text-base"
                />
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full text-sm sm:text-base"
                />
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full text-sm sm:text-base"
                />
                <Button className="w-full bg-[#19489e] hover:bg-[#2b3d5f] text-sm sm:text-base py-2 sm:py-3">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-[#19489e] text-sm font-medium mb-4">
              <Target className="w-4 h-4 mr-2" />
              Our Process
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Connecting talent with opportunities through our proven,
              innovative process
            </p>
          </div>

          {/* Grid Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Job Seekers Section */}
            <div className="group h-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 lg:p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#19489e] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-[#19489e] to-[#2b3d5f] p-4 rounded-2xl">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl lg:text-2xl font-bold text-gray-900">
                      For Job Seekers
                    </h3>
                    <p className="text-blue-600 font-medium">
                      Your career journey starts here
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start group/item hover:bg-blue-50/50 p-4 rounded-xl transition-colors">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4 flex-shrink-0 group-hover/item:bg-blue-200 transition-colors">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-base">
                        Submit Your Resume
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Candidates can submit your updated resume through a
                        simple email address
                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {" "}
                          job@vrrittih.com{" "}
                        </span>
                        stating all necessary details like the industry or
                        sector you wish to apply in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item hover:bg-blue-50/50 p-4 rounded-xl transition-colors">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4 flex-shrink-0 group-hover/item:bg-blue-200 transition-colors">
                      <Search className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-base">
                        Personal Consultation
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        Having duly received your email, candidates are
                        contacted personally to know more about their
                        preferences and choices.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item hover:bg-blue-50/50 p-4 rounded-xl transition-colors">
                    <div className="bg-blue-100 p-3 rounded-xl mr-4 flex-shrink-0 group-hover/item:bg-blue-200 transition-colors">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Professional Screening
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        After that, a primary evaluation and screening is
                        done from our end to match the client and candidate
                        requirements. Our team comprises of experienced
                        professional panel that caters to the need of the
                        candidates and matching it with the client needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employers Section */}
            <div className="group h-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 lg:p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl lg:text-2xl font-bold text-gray-900">
                      For Employers
                    </h3>
                    <p className="text-green-600 font-medium">
                      Find your perfect talent match
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start group/item hover:bg-green-50/50 p-4 rounded-xl transition-colors">
                    <div className="bg-green-100 p-3 rounded-xl mr-4 flex-shrink-0 group-hover/item:bg-green-200 transition-colors">
                      <Database className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Comprehensive Services
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        We have a wide range of free as well as paid
                        services for job listings. Job employers,
                        consultants, and companies can all gain access to
                        these services.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item hover:bg-green-50/50 p-4 rounded-xl transition-colors">
                    <div className="bg-green-100 p-3 rounded-xl mr-4 flex-shrink-0 group-hover/item:bg-green-200 transition-colors">
                      <Search className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Pre-filtered Database
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        We provide employers a pre-filtered candidate
                        database matching their exact needs. Our recruitment
                        specialists screen CVs thoroughly to serve our
                        clients better.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group/item hover:bg-green-50/50 p-4 rounded-xl transition-colors">
                    <div className="bg-green-100 p-3 rounded-xl mr-4 flex-shrink-0 group-hover/item:bg-green-200 transition-colors">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        Background Verification
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        We follow a strict procedure to get the best
                        candidates from the market. Detailed background
                        checks help eliminate risks of hiring the wrong
                        person.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#19489e] via-[#19489e] to-green-600 rounded-3xl blur-lg opacity-20"></div>
              <div className="relative bg-gradient-to-r from-[#19489e] via-[#19489e] to-green-600 rounded-3xl p-12 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center px-6 py-3 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Trusted by 10,000+ Professionals
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                    Join thousands of successful placements through our
                    proven process
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg">
                      <span className="flex items-center justify-center">
                        Post Your Resume
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                    <button className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105">
                      <span className="flex items-center justify-center">
                        Hire Talent
                        <Building2 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <VrrittihFooter /> */}
    </div>
  );
};

export default HowWeWorkPage;
