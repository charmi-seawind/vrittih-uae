"use client";

import Container from "@/components/Global/Container";
import React from "react";
import { FaFileAlt, FaPaperPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SEOTrainingPage = () => {
  const router = useRouter();
  return (
    <div className="">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
           IT / Software Services
          </h1>
         
        </div>
      </section>
      <div className=" max-w-[1500px] mx-auto px-4 sm:px-6 pt-10   grid grid-cols-1 lg:grid-cols-2 py-10 gap-12 items-center">
     
        <div className="space-y-6 text-gray-700">
          <h1 className="text-3xl font-bold text-black">
            IT / Software Services
          </h1>

          <div className="space-y-6  text-[16px]">
            <p>
              VRRITTIH Global Consulting provides the best IT and software recruitment services in
              Dubai. We can help you find top talent for your technology needs. Our{" "}
              <span className="font-bold text-black">
                IT recruitment agency in Dubai
              </span>
              {" "}offers{" "}
              <span className="font-bold text-black">
                specialized software developer hiring solutions
              </span>
              . We are designed to connect you with skilled professionals in the latest technologies.
            </p>

            <p>
              At our agency, we pride ourselves on excellence. We are known as the{" "}
              <span className="font-bold text-black">
                best IT staffing company
              </span>
              {" "}in Dubai. Our services are comprehensive. They cover software development, system administration,
              cloud computing, cybersecurity, and advanced IT infrastructure management.
            </p>

            <p>
              You will gain access to our{" "}
              <span className="font-bold text-black">
                extensive IT talent pool in Dubai
              </span>
              . It includes full-stack developers, DevOps engineers, data scientists,
              software architects, and more. Our experienced recruiters will guide you
              through the hiring process with personalized solutions. We make sure you find
              the perfect fit for any IT position.
            </p>

            <p>
              Don't miss this opportunity to strengthen your{" "}
              <span className="font-bold text-black">
                technology team
              </span>
              . Partner with our{" "}
              <span className="font-bold text-black">IT recruitment services</span>
              {" "}today and unlock your potential in the dynamic world of software
              and technology.
            </p>
          </div>

          <button 
            onClick={() => router.push('/post-resume')}
            className="flex items-center gap-2 bg-[#1a4db4] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-[0_5px_15px_rgba(37,137,208,0.4)] hover:bg-[#1e72ad] transition-all transform hover:-translate-y-1"
          >
            <FaFileAlt /> Post Resume
          </button>
        </div>

        {/* Right Side Form Card */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_15px_50px_-15px_rgba(0,0,0,0.2)] border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Contact Our Experts
          </h2>

          <form className="space-y-8">
            {/* Input Field Component Helper */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm text-gray-500 font-medium">
                Your Name:
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-[#1a4db4] focus:ring-1 focus:ring-[#1a4db4] transition-colors"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm text-gray-500 font-medium">
                Email Address:
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-[#1a4db4] focus:ring-1 focus:ring-[#1a4db4] transition-colors"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm text-gray-500 font-medium">
                Phone Number*
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-[#1a4db4] focus:ring-1 focus:ring-[#1a4db4] transition-colors"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm text-gray-500 font-medium">
                Subject*
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-[#1a4db4] focus:ring-1 focus:ring-[#1a4db4] transition-colors"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm text-gray-500 font-medium">
                Your Message (optional)
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-[#1a4db4] focus:ring-1 focus:ring-[#1a4db4] transition-colors resize-none"
              ></textarea>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#1a4db4] text-white px-16 py-4 rounded-full font-bold text-lg uppercase tracking-wider shadow-lg hover:bg-[#1e72ad] transition-all transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SEOTrainingPage;
