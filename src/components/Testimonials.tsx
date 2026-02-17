"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote, Briefcase, MapPin } from "lucide-react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      location: "Mumbai",
      image: "https://i.pravatar.cc/150?img=1",
      content: "Vrrittih helped me land my dream job in just 2 weeks! The CV builder and job matching system are incredible. The ₹99 package was totally worth it.",
      rating: 5,
      jobType: "Full-time"
    },
    {
      name: "Rajesh Kumar",
      role: "Marketing Manager",
      company: "Digital Solutions",
      location: "Delhi",
      image: "https://i.pravatar.cc/150?img=2",
      content: "Amazing platform! Found multiple job opportunities and the premium features really made my profile stand out. Highly recommend the ₹999 package.",
      rating: 5,
      jobType: "Remote"
    },
    {
      name: "Priya Sharma",
      role: "Data Analyst",
      company: "Analytics Pro",
      location: "Bangalore",
      image: "https://i.pravatar.cc/150?img=3",
      content: "The resume templates are professional and the job alerts feature is fantastic. Got 3 interview calls within a week of upgrading my profile.",
      rating: 5,
      jobType: "Hybrid"
    },
    {
      name: "Amit Patel",
      role: "UI/UX Designer",
      company: "Creative Studio",
      location: "Pune",
      image: "https://i.pravatar.cc/150?img=4",
      content: "Best job portal I've used! The interface is clean, search filters are precise, and the application process is seamless. Found my perfect match!",
      rating: 5,
      jobType: "Full-time"
    },
    {
      name: "Neha Gupta",
      role: "HR Specialist",
      company: "People First",
      location: "Chennai",
      image: "https://i.pravatar.cc/150?img=5",
      content: "Vrrittih's job matching algorithm is spot-on. The platform connected me with roles that perfectly matched my skills and career goals.",
      rating: 5,
      jobType: "Remote"
    },
    {
      name: "Vikram Singh",
      role: "Business Analyst",
      company: "Consulting Inc",
      location: "Hyderabad",
      image: "https://i.pravatar.cc/150?img=6",
      content: "Exceptional service! The premium CV review feature helped me improve my profile significantly. Landed a 40% salary hike through this platform.",
      rating: 5,
      jobType: "Full-time"
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < itemsPerView; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "Remote": return "bg-green-100 text-green-800";
      case "Hybrid": return "bg-blue-100 text-blue-800";
      default: return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            Career Dreams Realized
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join 50,000+ professionals who transformed their careers with Vrrittih
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <Card 
                key={`${currentIndex}-${index}`} 
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                
                <CardContent className="p-8 relative">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-12 h-12 text-blue-500" />
                  </div>

                  {/* Job Type Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(testimonial.jobType)}`}>
                      {testimonial.jobType}
                    </span>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                    "{testimonial.content}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="rounded-full ring-4 ring-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Briefcase className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-blue-600 font-semibold text-sm">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <span className="font-medium">{testimonial.company}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white group border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white group border border-gray-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-blue-600 w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600 font-medium">Success Stories</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600 font-medium">Job Match Rate</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">2 Weeks</div>
            <div className="text-gray-600 font-medium">Avg. Hiring Time</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-indigo-600 mb-2">40%</div>
            <div className="text-gray-600 font-medium">Avg. Salary Hike</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;