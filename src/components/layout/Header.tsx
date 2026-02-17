"use client";

import Link from "next/link";
import Image from "next/image";


import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function Header() {


  return (
    <>
      {/* Top Bar */}
      <section>
        <div
          className="w-full flex justify-center"
          style={{
            background:
              "linear-gradient(90deg, #0d47a1, #1976d2, #512da8, #000000, #19489e)",
          }}
        >
          <div className="w-full max-w-[1500px] text-white py-2 px-3 sm:px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-2 text-[12px] sm:text-[13px]">

            {/* Left: Social Icons */}
            <div className="flex items-center h-full">
              <a
                href="https://www.facebook.com/vrrittih" target="_blanck"
                className="border-l border-white/30 px-3 sm:px-4 hover:opacity-80 transition-opacity"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://www.instagram.com/vrrittih/" target="_blanck"
                className="border-l border-white/30 px-3 sm:px-4 hover:opacity-80 transition-opacity"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="https://www.linkedin.com/company/vrrittih-global-recruitment-consultancy/" target="_blanck"
                className="border-l border-r border-white/30 px-3 sm:px-4 hover:opacity-80 transition-opacity"
              >
                <FaLinkedinIn size={14} />
              </a>
            </div>

            {/* Right: Contact Info */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-5 text-center">

              <div className="flex items-center gap-2">
                <FaPhone size={12} />
                <span className="whitespace-nowrap">+91 8866009227</span>
              </div>

              <span className="hidden md:inline opacity-40">|</span>

              <div className="flex items-center gap-2">
                <MdEmail size={14} />
                <a
                  href="mailto:contact@vrrittih.com"
                  className="hover:underline whitespace-nowrap"
                >
                  contact@vrrittih.com
                </a>
              </div>

              <span className="hidden md:inline opacity-40">|</span>

              <div className="flex items-center gap-2">
                <FaMapMarkerAlt size={12} />
                <span>Dubai</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16 sm:h-20 md:h-24">

            {/* Logo */}
            <Link href="/home" className="flex items-center">
              <Image
                src="/logo/vrrittih.png"
                alt="Vrrittih"
                width={250}
                height={60}
                priority
                className="
                  rounded-lg 
                  w-28 
                  sm:w-36 
                  md:w-44 
                  lg:w-56 
                  xl:w-[250px]
                  h-auto
                "
              />
            </Link>

          </div>
        </div>
      </header>
    </>
  );
}
