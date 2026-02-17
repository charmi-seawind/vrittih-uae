"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "Explore Companys" },
    { href: "/features", label: "For Candidates" },
    { href: "/how-we-work", label: "For Employers" },
    { href: "/contact-us", label: "Pricings" },
    { href: "/contact-us", label: "Support" },
    { href: "/contact-us", label: "Blog" },
  ];

  const services = [
    "Training & Placement",
    "Recruitments Process Outsourcing",
    "Employee Background Verification",
    "Talent Deployment",
    "Live Project Training",
    "Web Design Training",
    "SEO Training",
    "PHP Training",
    "IT Training",
    "Talent Acquisition",
    "Recruitment",
    "Resume Writing",
    "Financial Services",
    "PF/ESIC/Factory Act Inquiry",
  ];

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo/vrrittih.png"
                  alt="Vrrittih"
                  width={200}
                  height={200}
                />
              </div>
            </div>

            <nav className="flex-1">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-2 text-lg font-medium text-gray-700 hover:text-[#19489e] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {/* Services Dropdown */}
                <li>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center justify-between w-full py-2 text-lg font-medium text-gray-700 hover:text-[#19489e] transition-colors"
                  >
                    Services
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {servicesOpen && (
                    <div className="ml-4 mt-2 max-h-48 overflow-y-auto">
                      <ul className="space-y-2">
                        {services.map((service, index) => (
                          <li key={index}>
                            <Link
                              href="#"
                              className="block py-1 text-sm text-gray-600 hover:text-[#19489e] transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {service}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            </nav>

            <div className="space-y-4 mt-8">
              <Button
                className="w-full bg-[#19489e] hover:bg-[#163a75]"
                asChild
              >
                <Link
                  href="https://vrrittih.com"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
