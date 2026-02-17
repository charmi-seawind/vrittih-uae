"use client";

import { Upload, FileText, Briefcase, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const PostResumePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    state: "",
    city: "",
    zipCode: "",
    email: "",
    primaryPhone: "",
    primaryPhoneType: "mobile",
    secondaryPhone: "",
    secondaryPhoneType: "home",
    regardingJob: "",
    resume: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-[#19489e] to-slate-900 py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Post Your Resume
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Upload your resume and get noticed by top employers
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-4 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#0A2357] font-semibold mb-2">
                    First Name 
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#0A2357] font-semibold mb-2">
                    Last Name 
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[#0A2357] font-semibold mb-2">
                  Address 
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              {/* Address2 */}
              <div>
                <label className="block text-[#0A2357] font-semibold mb-2">
                  Address2
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.address2}
                  onChange={(e) =>
                    setFormData({ ...formData, address2: e.target.value })
                  }
                />
              </div>

              {/* State, City, Zip Code */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[#0A2357] font-semibold mb-2">
                    State 
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#0A2357] font-semibold mb-2">
                    City 
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#0A2357] font-semibold mb-2">
                    Zip Code 
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#0A2357] font-semibold mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email 
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              {/* Primary Phone Number */}
              <div>
                <label className="block text-[#0A2357] font-semibold mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Primary Phone Number 
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="primaryPhoneType"
                        value="home"
                        checked={formData.primaryPhoneType === "home"}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryPhoneType: e.target.value })
                        }
                        className="w-4 h-4 text-[#004AAD]"
                      />
                      Home
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="primaryPhoneType"
                        value="mobile"
                        checked={formData.primaryPhoneType === "mobile"}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryPhoneType: e.target.value })
                        }
                        className="w-4 h-4 text-[#004AAD]"
                      />
                      Mobile
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="primaryPhoneType"
                        value="work"
                        checked={formData.primaryPhoneType === "work"}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryPhoneType: e.target.value })
                        }
                        className="w-4 h-4 text-[#004AAD]"
                      />
                      Work
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="primaryPhoneType"
                        value="other"
                        checked={formData.primaryPhoneType === "other"}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryPhoneType: e.target.value })
                        }
                        className="w-4 h-4 text-[#004AAD]"
                      />
                      Other
                    </label>
                  </div>
                  <input
                    type="tel"
                    required
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                    placeholder="+971 1234567890"
                    value={formData.primaryPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Secondary Phone Number */}
              <div>
                <label className="block text-[#0A2357] font-semibold mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Secondary Phone Number
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="secondaryPhoneType"
                        value="home"
                        checked={formData.secondaryPhoneType === "home"}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryPhoneType: e.target.value })
                        }
                        className="w-4 h-4 text-[#004AAD]"
                      />
                      Home
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="secondaryPhoneType"
                        value="mobile"
                        checked={formData.secondaryPhoneType === "mobile"}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryPhoneType: e.target.value })
                        }
                        className="w-4 h-4 text-[#004AAD]"
                      />
                      Mobile
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="secondaryPhoneType"
                        value="work"
                        checked={formData.secondaryPhoneType === "work"}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryPhoneType: e.target.value })
                        }
                        className="w-4 h-4 text-[#004AAD]"
                      />
                      Work
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="secondaryPhoneType"
                        value="other"
                        checked={formData.secondaryPhoneType === "other"}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryPhoneType: e.target.value })
                        }
                        className="w-4 h-4 text-[#004AAD]"
                      />
                      Other
                    </label>
                  </div>
                  <input
                    type="tel"
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                    placeholder="+971 1234567890"
                    value={formData.secondaryPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, secondaryPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Regarding Job */}
              <div>
                <label className="block text-[#0A2357] font-semibold mb-2">
                  <Briefcase className="inline w-4 h-4 mr-1" />
                  Regarding Job 
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004AAD]"
                  placeholder="Job title or position"
                  value={formData.regardingJob}
                  onChange={(e) =>
                    setFormData({ ...formData, regardingJob: e.target.value })
                  }
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-[#0A2357] font-semibold mb-2">
                  <FileText className="inline w-4 h-4 mr-1" />
                  Upload Resume *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#004AAD] transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your resume here or
                  </p>
                  <label className="inline-block px-6 py-2 bg-[#004aad] text-white rounded-full cursor-pointer hover:bg-[#004AAD] transition-colors">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        setFormData({ ...formData, resume: e.target.files?.[0] ?? null })
                      }
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-1/4 py-4 bg-[#004aad] text-white rounded-full font-semibold text-lg hover:bg-[#004AAD] transition-colors duration-300"
              >
                Submit Resume
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostResumePage;
