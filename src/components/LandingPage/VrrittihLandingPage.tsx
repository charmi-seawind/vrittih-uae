"use client";

import React, { Suspense } from "react";
import {
  Briefcase,
  Users,
  Users2,
  Shield,
  Clock,
  Lightbulb,
  Timer,
} from "lucide-react";
import { Check, UserCircle } from "lucide-react";
import Link from "next/link";
import { HiOutlineMap } from "react-icons/hi";
import { HiCheck } from "react-icons/hi";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  HiOutlineMapPin,
  HiOutlineLink,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineBolt,
} from "react-icons/hi2";
import { LuPin } from "react-icons/lu";

// Using Lucide-react for sharper, professional icons
import { HandCoins, TrendingUp } from "lucide-react";

import { FaSnowflake, FaHandshake } from "react-icons/fa6";

// Import React Icons
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper components directly
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import CountUp from "react-countup";

// Use direct URLs instead of imports for images
const service1 = "/images/service-1.jpg";
const service2 = "/images/service-2.jpg";
const service3 = "/images/service-3.jpg";
const service4 = "/images/service-4.jpg";
const service5 = "/images/service-5.webp";
const service6 = "/images/service-6.webp";

const tech1 = "/images/tech-1.svg";
const tech2 = "/images/tech-2.svg";
const tech3 = "/images/tech-3.svg";
const tech4 = "/images/tech-4.svg";
const tech5 = "/images/tech-5.svg";
const tech6 = "/images/tech-6.svg";

const logo1 = "/images/logo-1.png";
const logo2 = "/images/logo-2.webp";
const logo3 = "/images/logo-3.webp";
const logo4 = "/images/logo-4.webp";

const banner = "/images/employer-back1.jpg";
const about = "/images/about-img.avif";

const cubs = "/images/cubes.png";
const whychooseimg = "/images/why-choose.jpg";
const user1 = "/images/user-1.avif";
const user2 = "/images/newsofgujarat.webp";
const user3 = "/images/the-phone.webp";
const user4 = "/images/solitaire.png.webp";



// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const VrrittihLandingPage = () => {
  const jobSeekerFeatures = [
    "AI-Optimized Resume",
    "100% Verified & Relevant Job Opportunities",
    "Smarter & Faster Application Experience",
    "Build & Manage Your Resume Easily",
    "Designed to Boost Your Career Growth",
  ];

  const employerFeatures = [
    "Access High-Quality, Verified Talent",
    "AI-Powered Hiring Efficiency",
    "Maximum Job Visibility",
    "Smarter, Customizable Applications",
    "Full Control Over The Hiring Pipeline",
  ];

  const services = [
    {
      title: "Diversity",
      desc: "we believe in innovation and out of the box approach.",
      icon: <Users className="w-6 h-6 text-white" />,
      image: service1,
    },
    {
      title: "Our Team",
      desc: "Teamwork , client satisfaction, individual success and Win-Win for all is our way to go",
      icon: <Users2 className="w-6 h-6 text-white" />,
      image: service2,
    },
    {
      title: "Assured Confidentiality",
      desc: "We assure you the confidentiality of all the data with us.",
      icon: <Shield className="w-6 h-6 text-white" />,
      image: service3,
    },
    {
      title: "Time Management",
      desc: "Management consulting skills are essential for providing strategic advice and solutions.",
      icon: <Clock className="w-6 h-6 text-white" />,
      image: service4,
    },
    {
      title: "Innovation",
      desc: "We believe in innovation and out of the box approach",
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      image: service5,
    },
    {
      title: "Just In Time",
      desc: "Fixed Turn Around Time and priority to every client requirement.",
      icon: <Timer className="w-6 h-6 text-white" />,
      image: service6,
    },
  ];

  const techStack = [
    {
      id: 1,
      img: tech1,
    },
    {
      id: 2,
      img: tech2,
    },
    {
      id: 3,
      img: tech3,
    },
    {
      id: 4,
      img: tech4,
    },
    {
      id: 5,
      img: tech5,
    },
    {
      id: 6,
      img: tech6,
    },
    {
      id: 7,
      img: tech1,
    },
  ];

  const features = [
    {
      title: "Work With Us",
      icon: <FaSnowflake />,
      description:
        "Join our team of recruitment experts and help connect talented professionals with their dream careers.",
    },
    {
      title: "Our Process",
      icon: <HiOutlineMap />,
      description:
        "We follow a structured approach from initial consultation to final placement, ensuring the perfect match.",
    },
    {
      title: "How We Help",
      icon: <FaHandshake />,
      description:
        "We provide personalized career guidance and connect you with top employers in your industry.",
    },
  ];

  const seekerFeatures = [
    "Profile & Resume Tools",
    "Build & Post a Professional Resume directly on the platform",
    "AI ATS Resume Scoring to check how recruiter-friendly your resume is",
    "AI Resume Improvement Suggestions for better shortlisting chances",
    "AI JD-Resume Match Score to see how well you match each job",
    "Better Job Discovery",
    "Access to Featured Jobs posted by verified employers",
    "Verified Companies Badge ensuring authentic job postings",
    "Smarter Application Experience",
    "One-Click Easy Withdraw from applied jobs when required",
    "Real-Time Application Status - track every stage of your application instantly",
      "Personalized Job Recommendations based on your profile, skills, and activity",
  "Instant Job Alerts & Notifications so you never miss relevant opportunities",
  ];

  const employerData = [
    "Recruitment Tools",
    "Post Unlimited Jobs based on your plan",
    "Access Verified Job-Seekers with authentic profiles",
    "Update Applicant Status (Shortlisted, Interview Scheduled, Hired, Rejected, etc.)",
    "AI-Filtered Best Resumes for faster hiring decisions",
    "Advanced Job Posting Features",
    "Promote Your Job and increase visibility",
    "Share Job Listings on LinkedIn, Instagram, WhatsApp, and more",
    "Display Jobs on Vrrittih Website for maximum reach",
    "Custom Applicant Insights",
    "Create Custom Forms for Each Job to collect exact candidate details (skills, experience, certificates, etc.)",
    "Get Full Candidate Data including resume, form responses, skills, and job-specific answers",
  ];

  // Create a client-side only hook for intersection observer
  const [inView, setInView] = React.useState(false);
  const [ref, setRef] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        },
        { threshold: 0.3 },
      );

      observer.observe(ref);
      return () => observer.disconnect();
    }
  }, [ref]);

  const stats = [
    {
      id: 1,
      number: 450,
      suffix: "+",
      label: "Projects Completed",
      icon: <Briefcase size={32} className="text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      id: 2,
      number: 560,
      suffix: "+",
      label: "Trusted Client's",
      icon: <Users size={32} className="text-red-500" />,
      bgColor: "bg-red-100",
    },
    {
      id: 3,
      number: 100,
      suffix: "%",
      label: "Client Satisfaction",
      icon: <HandCoins size={32} className="text-blue-500" />,
      bgColor: "bg-indigo-100",
    },
    {
      id: 4,
      number: 3,
      suffix: " Billion",
      label: "USD Profit",
      icon: <TrendingUp size={32} className="text-blue-700" />,
      bgColor: "bg-blue-50",
    },
  ];

  const whychoose = [
    {
      title: "Tools powered by AI for better job matching",
      description:
        "Our AI analyzes skills, experience, and preferences to deliver accurate job matches. This ensures candidates and employers connect faster and more effectively.",
      icon: <LuPin className="text-red-500" size={32} />,
      borderColor: "hover:border-red-100",
    },
    {
      title: "Faster hiring with automated filtering",
      description:
        "Smart automation shortlists the right candidates instantly. This reduces manual effort and speeds up the entire hiring cycle.",
      icon: <HiOutlineDocumentText className="text-amber-500" size={32} />,
      borderColor: "hover:border-amber-100",
    },
    {
      title: "Premium job visibility for employers",
      description:
        "Top-tier listing options highlight your job postings. Reach more qualified applicants and stand out in competitive markets.",
      icon: <HiOutlineLink className="text-emerald-500" size={32} />,
      borderColor: "hover:border-emerald-100",
    },
    {
      title: "Access to verified profiles & companies",
      description:
        "All profiles and companies are screened for authenticity. You interact only with trusted, verified users in a secure environment.",
      icon: <HiOutlineChartBar className="text-sky-500" size={32} />,
      borderColor: "hover:border-sky-100",
    },
    {
      title: "Improved chances of getting shortlisted",
      description:
        "Optimized profiles and intelligent ranking boost visibility. Candidates receive more opportunities with better match quality.",
      icon: <HiOutlineMapPin className="text-indigo-500" size={32} />,
      borderColor: "hover:border-indigo-100",
    },
    {
      title: "Seamless, transparent, real-time hiring workflow",
      description:
        "Track applications, communicate, and manage hiring in real time. Everything stays organized, smooth, and easy to navigate.",
      icon: <HiOutlineBolt className="text-fuchsia-500" size={32} />,
      borderColor: "hover:border-fuchsia-100",
    },
  ];

  const data = [
    {
      id: 1,
      name: "	News Of Gujarat",
      // role: "Entrepreneur",
      image: user2,
      text: "We chose Seawind Solution as our partner to completely rebuild our online presence. They have been a tremendous asset to our project and a vital partner that we lean on and trust. From day one their entire team has been outstanding. There is not a better feeling than to realize you made the right choice in situations as this and we did. Hats off to the team at Seawind.",
    },
    {
      id: 2,
      name: "	The Phone Garage",
      // role: "Entrepreneur",
      image: user3,
      text: "The team adapted extremely well to the business needs and model for the project. The overall development was of good quality and delivered in a timely fashion. Seawind Solution has a personable team that instills trust in their process and capabilities.",
    },
    {
      id: 3,
      name: "	Solitaire Car Studio",
      // role: "Entrepreneur",
      image: user4,
      text: "We would like to thank the entire Seawind Solution team for a seamless and efficient experience for the updates to our Salesforce platform. As a manager in a small business, it is critical to work with a provider that understands my needs and can deliver the solutions requested in a timely manner.",
    },
    {
      id: 4,
      name: "The Phone Garage",
      // role: "Entrepreneur",
      image: user4,
      text: "We chose Seawind Solution as our partner to completely rebuild our online presence. They have been a tremendous asset to our project and a vital partner that we lean on and trust. From day one their entire team has been outstanding. There is not a better feeling than to realize you made the right choice in situations as this and we did. Hats off to the team at Seawind.",
    },
  ];

  const logos = [
    {
      id: 1,
      src: logo1,
      alt: "Brokers Pride",
    },
    {
      id: 2,
      src: logo2,
      alt: "EduTech Era",
    },
    {
      id: 3,
      src: logo3,
      alt: "AllSale",
    },
    {
      id: 4,
      src: logo4,
      alt: "Earth Carbon",
    },
    {
      id: 5,
      src: logo3,
      alt: "Logo 5",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[500px] sm:min-h-[600px] w-full flex items-center justify-center py-12 sm:py-16 px-3 sm:px-4 overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage: `url(${banner})`,
          }}
        />

        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-900/30 to-slate-900/10" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl transition-transform hover:scale-[1.02] duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 mb-6">
                <div className="p-3 sm:p-4 bg-blue-50 rounded-2xl shrink-0">
                  <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900 leading-tight">
                    Are You Looking For Job?
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 font-medium">
                    Post a resume in{" "}
                    <span className="text-slate-600 font-bold">60 seconds</span>
                  </p>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                {jobSeekerFeatures.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start sm:items-center gap-3 text-slate-700 font-medium"
                  >
                    <div className="bg-emerald-50 p-1 rounded-md mt-0.5 sm:mt-0 shrink-0">
                      <Check
                        className="w-4 h-4 text-emerald-500"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-sm sm:text-base leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
              <Link
                href="https://portal.vrrittih.com/onboarding/job-seeker"
                target="_blank"
              >
                <button className="bg-[#004AAD] hover:bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-3xl font-bold transition-colors shadow-lg shadow-blue-200 uppercase text-xs sm:text-sm tracking-wider">
                  Upload Your CV
                </button>
              </Link>

              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Already a member ?
                <Link
                  href="https://portal.vrrittih.com/job-seeker/login"
                  target="_blank"
                  className="text-[#004AAD] pl-2 font-bold hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl transition-transform hover:scale-[1.02] duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 mb-6">
                <div className="p-3 sm:p-4 bg-indigo-50 rounded-2xl shrink-0">
                  <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900 leading-tight">
                    Are You Looking For Good Candidate?
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 font-medium uppercase tracking-tighter">
                    Post a job
                  </p>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                {employerFeatures.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start sm:items-center gap-3 text-slate-700 font-medium"
                  >
                    <div className="bg-emerald-50 p-1 rounded-md mt-0.5 sm:mt-0 shrink-0">
                      <Check
                        className="w-4 h-4 text-emerald-500"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-sm sm:text-base leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
              <Link
                href="https://portal.vrrittih.com/onboarding/employer"
                target="_blank"
              >
                <button className="bg-[#004AAD] hover:bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-3xl font-bold transition-colors shadow-lg shadow-blue-200 uppercase text-xs sm:text-sm tracking-wider">
                  Post Your Job
                </button>
              </Link>

              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Already a member ?
                <Link
                  href="https://portal.vrrittih.com/employer/login"
                  target="_blanck"
                  className="text-[#004AAD] pl-2 font-bold hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full bg-[#1a4db4] py-5 sm:py-7 my-4">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <h2
            className="
          text-white 
          text-lg 
          sm:text-xl 
          md:text-2xl 
          lg:text-[28px] 
          font-semibold 
          leading-tight 
          text-center 
          md:text-left
        "
          >
            The Swiftest Path to Advance Your Career with the Leading Job Dubai
          </h2>

          <Link href="/contact-us">
            <button
              className="
            bg-[#5b95ff] 
            hover:bg-[#4a84f0] 
            text-white 
            font-bold 
            py-3 
            sm:py-4 
            px-8 
            sm:px-10 
            whitespace-nowrap 
            transition-all 
            duration-300 
            shadow-md
          "
            >
              Contact Now
            </button>
          </Link>
        </div>
      </div>

      <section
        className="relative w-full"
        style={{
          backgroundImage: `url(${about})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 z-0 bg-white/70" />

        <div className="relative z-10 max-w-[1500px] mx-auto px-3 sm:px-4 md:px-6 pt-8 sm:pt-10 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center">
            <div className="order-1">
              <div className="mb-6">
                <h2
                  className="
                text-2xl 
                sm:text-3xl 
                md:text-4xl 
                font-semibold 
                text-gray-900 
                mb-4 
                leading-tight
              "
                >
                  Welcome To Vrrittih - Recruitment Consultancy In Dubai
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  VRRITTIH is a Global Recruitment Consulting Company In Dubai
                  established in 2012, catering technical and non-technical
                  recruitment services in diversified industries.
                </p>

                <br />

                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  Recruitment is one of the most critical and high expertise
                  demanding function. Over the years of our experience in
                  Recruitment, our team has served many clients and developed a
                  large Pool of Database.
                </p>

                <br />

                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  Our main emphasis is on giving the right fit to our clients at
                  the right time. We act as a member of our client's team and
                  assist them in their requirements as per their priorities. We
                  understand the requirements well & know what will suit the
                  best. We have a good network in industry to get the right
                  candidate at all levels.
                </p>

                <br />

                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  We have developed innovative Recruitment strategies to make
                  the process of recruitment accurate & fast.
                </p>
              </div>

              <Link href="/about">
                <button
                  className="
                bg-[#004AAD] 
                hover:bg-blue-800 
                text-white 
                px-6 
                sm:px-8 
                py-3 
                sm:py-4 
                rounded-3xl 
                font-bold 
                transition-colors 
                shadow-lg 
                shadow-blue-200 
                uppercase 
                text-xs 
                sm:text-sm 
                tracking-wider
              "
                >
                  More About Vrrittih
                </button>
              </Link>
            </div>

            <div className="order-2 flex justify-center lg:justify-end">
              <img
                src="/images/girlss.png"
                alt="Enhancing Success"
                className="
                w-3/4 
                sm:w-2/3 
                md:w-1/2 
                h-auto 
                object-cover
              "
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 ">
                Our Strengths
              </h2>
            </div>
          </div>

          {/* Categories Slider */}
          <div className="relative group">
            {/* Navigation Arrows */}
            <button className="swiper-button-prev-custom absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex">
              <ChevronLeft size={20} />
            </button>
            <button className="swiper-button-next-custom absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex">
              <ChevronRight size={20} />
            </button>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: ".swiper-button-prev-custom",
                nextEl: ".swiper-button-next-custom",
              }}
              // pagination={{
              //   clickable: true,
              //   el: ".swiper-pagination-custom",
              // }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
            >
              {services.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-[#F3F6F6] p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100 group/card h-60 overflow-hidden">
                    {/* Icon Circle */}
                    <div className="w-12 h-12 bg-[#004AAD] rounded-full flex items-center justify-center mb-6">
                      {item.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover/card:text-[#004AAD] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-base leading-relaxed flex-grow">
                      {item.desc}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination Dots */}
            <div className="swiper-pagination-custom flex justify-center gap-2 mt-10"></div>
          </div>
        </div>
      </section>

      <section className="pb-10 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 ">
          <div className="text-start py-5">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 ">
              Our Featured
            </h2>
          </div>
          <div className="relative flex items-center group px-10">
            <button className="prev-btn absolute left-0 z-20 text-[#3B49DF] hover:scale-110 transition-transform disabled:opacity-30">
              <HiChevronLeft size={45} />
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={{
                prevEl: ".prev-btn",
                nextEl: ".next-btn",
              }}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
              className="w-full"
            >
              {techStack.map((tech) => (
                <SwiperSlide key={tech.id} className="py-4">
                  <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center h-36">
                    <img
                      src={tech.img}
                      alt="Technology"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="next-btn absolute right-0 z-20 text-[#3B49DF] hover:scale-110 transition-transform disabled:opacity-30">
              <HiChevronRight size={45} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          <div>
            <h2
              className="
            text-2xl 
            sm:text-3xl 
            md:text-4xl 
           font-semibold
            text-gray-900 
            leading-tight 
            mb-5 
            sm:mb-6
          "
            >
              Discover Your Career Opportunities with{" "}
              <span className="text-[#1e4db7]">
                Your Trusted Path to Success
              </span>
            </h2>

            <p
              className="
            text-gray-600 
            text-sm 
            sm:text-base 
            md:text-lg 
            leading-relaxed 
            mb-6 
            sm:mb-8
          "
            >
              Vrrittih blends aesthetic excellence with powerful usability,
              ensuring an intuitive experience across all devices while helping
              you unlock your true professional potential.
            </p>

            <div className="h-1 w-20 sm:w-24 bg-[#1e4db7] rounded-full" />
          </div>

          <div className="space-y-6 sm:space-y-8 relative">
            {features.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 sm:gap-6 group relative z-10"
              >
                <div
                  className="
                flex-shrink-0 
                w-10 
                h-10 
                sm:w-12 
                sm:h-12 
                rounded-full 
                bg-[#1e4db7]/10 
                flex 
                items-center 
                justify-center  
                group-hover:bg-[#1e4db7] 
                group-hover:text-white 
                transition-all 
                duration-300 
                group-hover:scale-110 
                text-2xl 
                sm:text-3xl 
                md:text-2xl 
                text-black
              "
                >
                  {item.icon}
                </div>

                <div className="flex-1">
                  <h3
                    className="
                  text-base 
                  sm:text-lg 
                  md:text-xl 
                  font-semibold 
                  text-gray-900 
                  mb-1.5 
                  sm:mb-2 
                  group-hover:text-[#1e4db7] 
                  transition-colors 
                  duration-300
                "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                  text-gray-600 
                  text-xs 
                  sm:text-sm 
                  md:text-base 
                  leading-relaxed
                "
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-8 sm:py-10 overflow-hidden">
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-blue-700/95" />

        <div className="relative max-w-[1500px] mx-auto px-3 sm:px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2
              className="
            text-white 
            text-2xl 
            sm:text-3xl 
            md:text-4xl 
            font-bold 
            mb-4 
            sm:mb-6
          "
            >
              Pricing Built For Businesses Of All Sizes
            </h2>

            <p
              className="
            text-blue-100 
            text-xs 
            sm:text-sm 
            md:text-base 
            leading-relaxed 
            opacity-90
          "
            >
              Our dedication to providing pricing structures that cater to the
              diverse needs and scales of businesses, regardless of their size.
              Our pricing models are designed to be flexible, affordable, and
              accessible.
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            <div className="hidden lg:block absolute left-1/2 top-0 h-full w-[1px] bg-white/20" />

            <div
              className="
            relative 
            bg-white/10 
            backdrop-blur-xl 
            border 
            border-white/20 
            rounded-3xl 
            p-6 
            sm:p-8 
            lg:p-10 
            hover:translate-y-[-6px] 
            transition-all 
            duration-300
          "
            >
              <div className="mb-8 sm:mb-10">
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  For Job Seekers
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm opacity-80">
                  Tools and guidance designed to accelerate your career journey.
                </p>
              </div>

              <ul className="space-y-4 sm:space-y-5 mb-10 sm:mb-12">
                {seekerFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-200 text-sm sm:text-base leading-relaxed"
                  >
                    <HiCheck className="text-white mt-0.5 shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact-us">
                <button
                  className="
                w-full 
                bg-white 
                hover:bg-gray-400 
                text-[#1e4db7] 
                font-semibold 
                py-3 
                sm:py-4 
                rounded-xl 
                transition-all 
                hover:scale-[1.02]
              "
                >
                  CONTACT US
                </button>
              </Link>
            </div>

            <div
              className="
            relative 
            bg-white/15 
            backdrop-blur-xl 
            border 
            border-gray-400/40 
            rounded-3xl 
            p-6 
            sm:p-8 
            lg:p-10 
            scale-100 
            lg:scale-[1.03] 
            shadow-[0_0_40px_rgba(249,115,22,0.15)]
          "
            >
              <div
                className="
              absolute 
              -top-3 
              sm:-top-4 
              right-4 
              sm:right-6 
              bg-orange-500 
              text-white 
              text-[10px] 
              sm:text-xs 
              font-bold 
              px-3 
              sm:px-4 
              py-1 
              rounded-full 
              shadow-lg
            "
              >
                Most Popular
              </div>

              <div className="mb-8 sm:mb-10">
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  For Employers & Companies
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm opacity-80">
                  Advanced hiring tools built for scaling organizations.
                </p>
              </div>

              <ul className="space-y-4 sm:space-y-5 mb-10 sm:mb-12">
                {employerData.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-200 text-sm sm:text-base leading-relaxed"
                  >
                    <HiCheck className="text-white mt-0.5 shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact-us">
                <button
                  className="
                w-full 
                bg-white 
                hover:bg-gray-400 
                text-[#1e4db7] 
                font-semibold 
                py-3 
                sm:py-4 
                rounded-xl 
                transition-all 
                hover:scale-[1.02]
              "
                >
                  CONTACT US
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative py-12 sm:py-16 bg-[#F1F4F9] overflow-hidden"
        ref={(el) => setRef(el)}
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url(${cubs})`,
            backgroundSize: "200px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div
            className="
          grid 
          grid-cols-2 
          sm:grid-cols-2 
          md:grid-cols-4 
          gap-6 
          sm:gap-8 
          md:gap-4
        "
          >
            {stats.map((item) => (
              <div
                key={item.id}
                className="
                flex 
                flex-col 
                items-center 
                text-center 
                transition-transform 
                duration-500
              "
              >
                <div
                  className="
                  mb-4 
                  sm:mb-6 
                  p-3 
                  sm:p-4 
                  rounded-2xl 
                  transition-all 
                  duration-300 
                  transform 
                  group-hover:scale-110
                "
                >
                  {item.icon}
                </div>

                <div
                  className="
                text-2xl 
                sm:text-3xl 
                font-bold 
                text-[#2D3E50] 
                mb-1.5 
                sm:mb-2
              "
                >
                  {inView ? (
                    <CountUp
                      end={item.number}
                      duration={2.5}
                      suffix={item.suffix}
                    />
                  ) : (
                    `0${item.suffix}`
                  )}
                </div>

                <p
                  className="
                text-xs 
                sm:text-sm 
                md:text-base 
                text-gray-500 
                font-medium 
                tracking-tight
              "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${whychooseimg})`,
          }}
        />

        <div className="absolute inset-0 bg-blue-900/90" />

        <div className="relative max-w-[1500px] mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 mb-8 sm:mb-10">
            <h2
              className="
            text-white 
            text-lg 
            sm:text-xl 
            md:text-2xl 
            lg:text-[28px] 
            font-semibold 
            leading-tight 
            text-center 
            md:text-left
          "
            >
              Why Choose Us? (What You Get by Being With Us)
            </h2>

            <Link href="/contact-us">
              <button
                className="
            bg-[#004AAD] 
            hover:bg-orange-600 
            text-white 
            font-bold 
            py-3 
            sm:py-4 
            px-8 
            sm:px-10 
            rounded-lg 
            whitespace-nowrap 
            transition-all 
            duration-300 
            shadow-md
          "
              >
                Contact Now
              </button>
            </Link>
          </div>

          <div
            className="
          grid 
          grid-cols-1 
          sm:grid-cols-1 
          md:grid-cols-2 
          gap-4 
          sm:gap-6
        "
          >
            {whychoose.map((service, index) => (
              <div
                key={index}
                className={`
                bg-white/95 
                backdrop-blur-sm 
                p-6 
                sm:p-8 
                md:p-10 
                rounded-2xl 
                border 
                border-white/20 
                shadow-lg 
                transition-all 
                duration-300 
                hover:shadow-xl 
                flex 
                items-start 
                gap-5 
                sm:gap-8 
                ${service.borderColor}
              `}
              >
                <div className="shrink-0 mt-1">{service.icon}</div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-gray-50 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 md:px-6 relative">
          <div className="relative text-center mb-4 flex flex-col items-center justify-center">
            <div className="relative w-full">
              <div className="text-start py-4 sm:py-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-start text-gray-900">
                  What Our Clients Say !
                </h2>
              </div>
            </div>
          </div>

          <div className="relative group px-2 sm:px-4 md:px-12">
            <button className="swiper-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-[#004AAD] transition-colors hidden md:block">
              <ChevronLeft size={40} strokeWidth={1.5} />
            </button>

            <button className="swiper-next absolute right-0 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-[#004AAD] transition-colors hidden md:block">
              <ChevronRight size={40} strokeWidth={1.5} />
            </button>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              centeredSlides={true}
              loop={true}
              autoplay={{ delay: 4000 }}
              pagination={{ clickable: true, el: ".custom-pagination" }}
              navigation={{
                nextEl: ".swiper-next",
                prevEl: ".swiper-prev",
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="testimonial-swiper"
            >
              {data.map((item) => (
                <SwiperSlide
                  key={item.id}
                  className="transition-all duration-500 py-8 sm:py-10"
                >
                  {({ isActive }) => (
                    <div
                      className={`
                      bg-white 
                      rounded-xl 
                      p-6 
                      sm:p-8 
                      shadow-sm 
                      transition-all 
                      duration-500 
                      border 
                      border-gray-100 
                      flex 
                      flex-col 
                      items-center 
                      text-center 
                      ${
                        isActive
                          ? "scale-110 shadow-xl z-10 border-[#004AAD]"
                          : "scale-90 opacity-40"
                      }
                    `}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 text-left w-full justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-orange-100 shadow-sm"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                            {item.name}
                          </h4>
                          {/* <p className="text-gray-500 text-xs sm:text-sm">
                            {item.role}
                          </p> */}
                        </div>
                      </div>

                      <p className="text-gray-600 leading-relaxed text-sm sm:text-[15px]">
                        {item.text}
                      </p>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Dots Pagination */}
            <div className="custom-pagination flex justify-center gap-2 mt-4"></div>
          </div>
        </div>

        {/* Pagination Styles */}
        <style jsx global>{`
          .custom-pagination .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: #004aad;
            opacity: 1;
            transition: all 0.3s;
          }
          .custom-pagination .swiper-pagination-bullet-active {
            background: #004aad;
            width: 24px;
            border-radius: 4px;
          }
        `}</style>
      </section>

      <section className="relative py-10 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* --- Header Section --- */}
          <div className="text-center mb-7">
            <p className="text-[#004AAD] font-bold text-sm md:text-base uppercase tracking-tight">
              We are here for
            </p>
            <div className="text-center py-5">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
                Explore Solutions
              </h2>
            </div>
            <p className="max-w-4xl mx-auto mt-6 text-slate-600 font-semibold text-sm md:text-lg leading-relaxed">
              We work with forward-looking organizations who understand that
              joining the global startup economy is key to drive innovation and
              spur economic growth.
            </p>
          </div>

          {/* --- Slider Section --- */}
          <div className="relative flex items-center group px-4 md:px-12">
            <button className="prev-btn absolute left-0 z-20 p-2 text-[#004AAD] hover:scale-110 transition-transform">
              <ChevronLeft size={35} strokeWidth={2.5} />
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={50}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={{
                prevEl: ".prev-btn",
                nextEl: ".next-btn",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="w-full flex items-center"
            >
              {logos.map((logo) => (
                <SwiperSlide
                  key={logo.id}
                  className="flex items-center justify-center py-4"
                >
                  <div className="flex items-center justify-center  hover:grayscale-0 transition-all duration-500">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="max-h-16 md:max-h-16 w-auto object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation - Right Arrow (Boxed Style) */}
            <button className="next-btn absolute right-0 z-20 p-1.5 text-[#004AAD] hover:scale-110 transition-transform">
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VrrittihLandingPage;
