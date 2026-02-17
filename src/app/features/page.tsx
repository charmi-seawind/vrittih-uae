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
           Seo Training Service
          </h1>
         
        </div>
      </section>
      <div className=" max-w-[1500px] mx-auto px-4 sm:px-6 pt-10   grid grid-cols-1 lg:grid-cols-2 py-10 gap-12 items-center">
     
        <div className="space-y-6 text-gray-700">
          <h1 className="text-3xl font-bold text-black">
            Seo Training Service
          </h1>

          <div className="space-y-6  text-[16px]">
            <p>
              VRRITTIH Global Consulting provide the best SEO training agency in
              Dubai. They can help you improve your digital marketing
              skills. Look Our{" "}
              <span className="font-bold text-black">
                SEO training institute is in Dubai
              </span>
              . It offers{" "}
              <span className="font-bold text-black">
                top best SEO training classes
              </span>
              . We designed these techniques and strategies to give you the
              latest tools.
            </p>

            <p>
              At our institute, we pride ourselves on recognition. We are known
              as the{" "}
              <span className="font-bold text-black">
                best SEO training company
              </span>
              . We are in Dubai. Our curriculum is comprehensive. It covers
              the basics of search engine optimization(SEO). It also covers
              advanced tactics for getting the best website visibility.
            </p>

            <p>
              You Will gain valuable insights from our{" "}
              <span className="font-bold text-black">
                SEO training in institute in Dubai
              </span>
              . It covers keyword research, On-page optimization, link building,
              Off-page and more. Our experienced instructors will guide you
              through exercises and case studies. They will make sure you're
              ready to tackle any SEO challenge.
            </p>

            <p>
              Don't miss this opportunity to speed up your{" "}
              <span className="font-bold text-black">
                digital marketing career
              </span>
              . Join our{" "}
              <span className="font-bold text-black">SEO training classes</span>
              today. and Boost your potential in the dynamic world of search
              engine optimization.
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
