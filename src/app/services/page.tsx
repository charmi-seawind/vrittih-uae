"use client";

import { Users, Shield } from "lucide-react";
import {
  GraduationCap,
  FileText,
  Briefcase,
  Code,
  Monitor,
  Search,
  Palette,
  Wrench,
  UserCheck,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";
const  s1 = "/images/service-1.jpg";
const s2 = "/images/service-2.jpg";
const s3 = "/images/service-3.jpg";
const s4 = "/images/service-4.jpg";
const s5 = "/images/service-5.webp";
const s6 = "/images/service-6.webp";
const s7 = "/images/service-7.jpg";
const s8 = "/images/service-8.jpg";
const s9 = "/images/service-9.jpg";
const s10 = "/images/service-10.jpg";
const s11 = "/images/service-11.jpg";
const s12 = "/images/service-12.jpg";

const ServicesPage = () => {
  const router = useRouter();
  const services = [
    {
      title: "Training And Placement",
      desc: "We create websites for you that are more than just looking good; Get a website that sells your brand!.",
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      image: s1,
    },
    {
      title: "Resume Writing",
      desc: "That's what it means actually; ready for a multi-device world. Developing a website that is responsive is no longer a new requirement, its mandatory.",
      icon: <FileText className="w-8 h-8 text-white" />,
      image: s2,
    },
    {
      title: "Talent Acquisition",
      desc: "VRRITTIH is a vastly growing recruitment consulting company in technical & non-technical Talent Acquisition.",
      icon: <Users className="w-8 h-8 text-white" />,
      image: s3,
    },
    {
      title: "Recruitments",
      desc: "Standing out from the crowd is a key element to convincing your potential customers to work with you over your competitors.",
      icon: <Briefcase className="w-8 h-8 text-white" />,
      image: s4,
    },
    {
      title: "Php Training",
      desc: "Vrrittih Global Consultancy, located in Ahmedabad, Gujarat is one of the leading consultancies offering training in programming languages.",
      icon: <Code className="w-8 h-8 text-white" />,
      image: s5,
    },
    {
      title: "IT Training",
      desc: "Knowing different technologies and staying updated about the changes & new arrivals in the technologies is critical for survival & growth.",
      icon: <Monitor className="w-8 h-8 text-white" />,
      image: s6,
    },
    {
      title: "SEO Training",
      desc: "Vrrittih Global Consultancy is a leading consultancy providing SEO training in Ahmedabad with placement in Ahmadabad.",
      icon: <Search className="w-8 h-8 text-white" />,
      image: s7,
    },
    {
      title: "Web Design Training",
      desc: "Vrrittih global consultancy offers web designing training in Ahmedabad this is the place of opportunities where every aspiring student is directed towards success.",
      icon: <Palette className="w-8 h-8 text-white" />,
      image: s8,
    },
    {
      title: "Live Project Training",
      desc: "Vrrittih global consultancy is one of the consultancies is one of the consultancies who provides training on a Live Project Training in Ahmadabad & our prime goal is to provide employment to our trainer.",
      icon: <Wrench className="w-8 h-8 text-white" />,
      image: s9,
    },
    {
      title: "Talent Deployment",
      desc: "The world is full of opportunities and you never know when the opportunity knocks your door.",
      icon: <UserCheck className="w-8 h-8 text-white" />,
      image: s10,
    },
    {
      title: "Recruitment Process Outsourcing",
      desc: "We use methods like strategy analysis, Geographical survey, industry mapping, Competitor analysis, Cultural analysis, Retention strategies and many others to achieve the desired results.",
      icon: <Building className="w-8 h-8 text-white" />,
      image: s11,
    },
    {
      title: "Employee Background Verification",
      desc: "Employee background verification is vital for maintaining Safety, reputation and integrity in the organization.",
      icon: <Shield className="w-8 h-8 text-white" />,
      image: s12,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-[#19489e] to-slate-900 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl font-bold text-white mb-4 sm:mb-6">
            Our Services
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Comprehensive recruitment and job portal services to connect talent
            with opportunities
          </p>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
            {services.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border-b-4 border-transparent hover:border-[#004AAD] h-full"
              >
                <div className="relative h-40 overflow-hidden rounded-t-3xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2357] via-[#0A2357]/40 to-transparent opacity-90" />
                </div>

                <div className="absolute top-32 left-8 z-20">
                  <div className="w-16 h-16 bg-[#004aad] rounded-full flex items-center justify-center border-4 border-white shadow-lg group-hover:bg-[#004AAD] transition-colors duration-300">
                    {item.icon}
                  </div>
                </div>

                <div className="p-8 pt-10 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#0A2357] mb-4 group-hover:text-[#004AAD] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed flex-grow">
                    {item.desc}
                  </p>
                  <button 
                    onClick={() => router.push('/features')}
                    className="mt-6 px-6 py-2.5 bg-[#004aad] text-white rounded-full font-medium hover:bg-[#004AAD] transition-colors duration-300 self-start"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
