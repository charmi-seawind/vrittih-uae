"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

import { Target, Shield, Lightbulb } from "lucide-react";

// import Footer from "@/components/LandingPage/Footer";

const AboutPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const features = [
    {
      icon: Target,
      title: "Expertise in Hiring",
      description:
        "With over 12 years of experience in the recruitment industry, we specialize in recruiting for positions ranging from entry-level to VP. We cater to both skilled and unskilled job seekers, freshers, and experienced candidates in Dubai, Dubai .",
    },
    {
      icon: Shield,
      title: "Manpower Services",
      description:
        "At Vrittih Global Recruitment Consulting, we are committed to modernizing the workplace. We empower individuals and companies to thrive by enhancing their work and life experiences.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description:
        "We strive to lead in creating and delivering services that empower our clients.Our goal is to help them succeed in the dynamic job market. We prioritize innovation, adaptability, and client success.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl font-bold text-white mb-4 sm:mb-6">
            About Vrrittih
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            India's most trusted job portal connecting millions with their dream
            careers.
          </p>
        </div>
      </section>

      {/* About + Form */}
      <section className="py-12 sm:py-16 bg-gray-50 w-full">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between gap-8 sm:gap-12 flex-col lg:flex-row">
          {/* About */}
          <div className="w-full lg:w-3/5">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              About Vrrittih
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              VRRITTIH is a Global Recruitment Consulting Company established in
              2012, catering technical and non-technical recruitment services in
              diversified industries. Recruitment is one of the most critical
              and high expertise demanding function. Over the years of our
              experience in Recruitment, our team has served many clients and
              developed a large Pool of Database.
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 leading-relaxed">
              Our main emphasis is on giving the right fit to our clients at the
              right time. We act as a member of our client's team and assist
              them in their requirements as per their priorities. We understand
              the requirements well & know what will suit the best. We have a
              good network in industry to get the right candidate at all levels.
              We have developed innovative Recruitment strategies to make the
              process of recruitment accurate & fast.
            </p>

            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 leading-relaxed">
              We have highly competent and dedicated professionals which gives
              our clients an edge in the current scenario. We use active and
              passive sourcing methodologies efficiently to deliver the unique
              candidates for our client requirements. Headhunting and company
              mapping is our specialty. We also ensure clear communication with
              both clients and candidates. In order to mark our presence
              globally we are undergoing a tie up drive in various continents
              including Asia, Europe and Africa.
            </p>

            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 leading-relaxed">
              We provide requirement specific services and dedicated
              representatives to our clients. We are looking forward to be
              associated with you to fulfill your recruiting needs.Join us to
              have a different experience of recruitment.
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
                <Button className="w-full bg-[#19489e] hover:bg-[#163a75] text-sm sm:text-base py-2 sm:py-3">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-20 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl">
                <Image
                  src="/images/Staffing.gif"
                  alt="Vrrittih Platform"
                  width={600}
                  height={400}
                  className="w-full h-auto "
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
                  Our Services - Our Expertise
                </h2>

                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  Vrittih Global Recruitment Consulting specializes in IT,
                  industrial, and non-technical recruitment in Dubai,
                  Dubai . Our expert team has extensive experience and
                  knowledge in these industries, allowing us to understand
                  employers' needs and hiring patterns.
                </p>

                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  As a leading recruitment consultant, we are dedicated to
                  filling vacancies efficiently. We value our clients' time and
                  strive to complete the recruitment process quickly. During the
                  first round of interviews, our team verifies essential
                  information such as communication skills, attitude, stability,
                  educational background, experience, and skills. Once verified,
                  we move forward with scheduling client interviews.
                </p>

                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  We understand that every organization has its unique culture,
                  policies, management responsibilities, and job descriptions.
                  At Vrittih Global Recruitment Consulting, we tailor our
                  services to meet the specific requirements of each client.
                </p>

                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  We understand the requirements well & know what will suit the
                  best. We have a good network in industry to get the right
                  candidate at all levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Vrrittih?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              Why Choose Us Vrittih Global Recruitment Consulting?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 border-0 w-full bg-white group"
              >
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="bg-gradient-to-br from-[#19489e] to-[#092f74] rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* <VrrittihFooter /> */}
    </div>
  );
};

export default AboutPage;
