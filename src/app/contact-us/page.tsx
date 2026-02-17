"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  Globe,
  Share2,
} from "lucide-react";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";


const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

const contactInfo = [
  {
    icon: MapPin,
    title: "Our Address",
    details: ["Dubai"],
  },
  {
    icon: Phone,
    title: "Phone Number",
    details: ["+971 88660 09227"],
  },
  {
    icon: Mail,
    title: "Email Address",
    details: ["contact@vrrittih.com"],
  },
  {
    icon: Share2,
    title: "Follow Us",
    details: ["Connect with us on social media"],
    socialIcons: [
        { icon: FaFacebook, color: "text-blue-600", hoverColor: "hover:bg-blue-50", url: "https://www.facebook.com/vrrittih" },
      { icon: FaLinkedin, color: "text-blue-700", hoverColor: "hover:bg-blue-50", url: "https://www.linkedin.com/company/vrrittih-global-recruitment-consultancy/" },
      { icon: FaInstagram, color: "text-pink-600", hoverColor: "hover:bg-pink-50", url: "https://www.instagram.com/vrrittih/" },
    ],
  },
];

  return (
    <div className="min-h-screen bg-white">
    
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16  md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Get in touch with us. We're here to help you with your recruitment
            needs.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow border-0 bg-white"
              >
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-[#0a2e70] to-[#19489e] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {info.title}
                  </h3>
                  {info.title === "Follow Us" && info.socialIcons ? (
                    <div className="flex justify-center space-x-3 mb-3">
                      {info.socialIcons.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`bg-white border-2 border-gray-200 ${social.hoverColor} rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 shadow-sm hover:shadow-md`}
                        >
                          <social.icon className={`h-6 w-6 ${social.color} transition-colors`} target="_blanck " />
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm mb-1">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Have a question or need assistance? Fill out the form below
                  and we'll get back to you as soon as possible.
                </p>
              </div>

              <Card className="shadow-lg border-0">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="h-12"
                      />
                      <Input
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="h-12"





                    





                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-12"
                      />
                      <Input
                        placeholder="Subject *"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        className="h-12"
                      />
                    </div>
                    <Textarea
                      placeholder="Your Message *"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={6}
                      className="resize-none"
                    />
                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#19489e] hover:bg-[#19489e] text-white text-base font-semibold"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Visit Our Office
                </h2>
                <p className="text-gray-600">
                  We're located in the heart of Dubai, Gujarat. Feel free to
                  visit us during our working hours.
                </p>
              </div>

              {/* Map Placeholder */}
              <Card className="shadow-lg border-0 mb-8">
                <CardContent className="p-0">
                  <div className="h-64 rounded-lg overflow-hidden">
                    <iframe
                      title="Google Map"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      style={{ border: 0 }}
                      allowFullScreen
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.596533170368!2d72.51614597505057!3d23.006943579175323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b3201a29f75%3A0xbe819b7631c6fba3!2sWide%20Angle%20Multiplex!5e0!3m2!1sen!2sin!4v1732105000000!5m2!1sen!2sin"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="text-center hover:shadow-md transition-shadow border border-blue-100">
                  <CardContent className="p-4">
                    <MessageCircle className="w-8 h-8 text-[#19489e] mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Live Chat
                    </p>
                    <p className="text-xs text-gray-500">Available 24/7</p>
                  </CardContent>
                </Card>
                <Card className="text-center hover:shadow-md transition-shadow border border-green-100">
                  <CardContent className="p-4">
                    <HeadphonesIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Call Support
                    </p>
                    <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM</p>
                  </CardContent>
                </Card>
                <Card className="text-center hover:shadow-md transition-shadow border border-purple-100">
                  <CardContent className="p-4">
                    <Globe className="w-8 h-8 text-[#19489e] mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Online Help
                    </p>
                    <p className="text-xs text-gray-500">FAQ & Resources</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default ContactUsPage;
