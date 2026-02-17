"use client";

import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const VrrittihFooter = () => {
  return (
    <footer className="bg-gray-900 text-white w-full overflow-hidden">
      <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex text-2xl justify-center sm:justify-start font-semibold text-white">
              Why Vrrittih?
            </div>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Whether you're interested in building a new Website or want to
              sharpen your digital marketing strategy for your business, get in
              touch with our excellent creative thinking team to discuss all of
              your digital dreams, desires & demands.
            </p>

            <div className="flex justify-center sm:justify-start space-x-4">
              <Link href="https://www.facebook.com/vrrittih"  target="_blanck" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebookF className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/vrrittih/" target="_blanck"className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </Link>
              <Link href="https://www.linkedin.com/company/vrrittih-global-recruitment-consultancy/" target="_blanck"className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedinIn className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Seo Training</Link></li>
              <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Php Training</Link></li>
              <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">It Training</Link></li>
              <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Talent Acquisition</Link></li>
              <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Recruitment</Link></li>
            </ul>
          </div>

          {/* Office Information */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Office Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 break-all">
                <HiMail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">contact@vrrittih.com</span>
              </li>

              <li className="flex items-center justify-center sm:justify-start gap-2 text-gray-400">
                <HiPhone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">+918866009227</span>
              </li>

              <li className="flex items-start justify-center sm:justify-start gap-2 text-gray-400">
                <HiLocationMarker className="h-5 w-5 mt-1 flex-shrink-0" />
                <span className="text-sm sm:text-base leading-relaxed">Dubai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6 sm:pt-8">
          <div className="text-center px-2">
            <div className="text-gray-400 text-sm flex flex-wrap items-center justify-center gap-1 leading-relaxed">
              ©2026 All rights reserved. Website Design & Developed By
              <a
                href="https://seawindsolution.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#38b1f6] inline-flex items-center gap-1"
              >
                Seawind Solution Pvt. Ltd.
                <img
                  src="/logo/loaderimage.png"
                  alt="loader"
                  className="w-4 h-4 animate-spin inline-block"
                />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default VrrittihFooter;
