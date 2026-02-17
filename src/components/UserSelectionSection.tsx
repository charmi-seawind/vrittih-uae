"use client";
import { Building, User } from "lucide-react";
import { MagicCard } from "./ui/magic-card";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterLinks from "./RegisterLinks";
import Container from "./Global/Container";
import { Button } from "./ui/button";
import Logo from "./ui/logo";
import Image from "next/image";
const UserSelectionSection = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Container>
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-4">
            Welcome to 
            <div 
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => window.open('https://vrrittih.com', '_blank')}
            >
              <Image
                src="/logo/vrrittih.png"
                alt="Vrrittih Logo"
                width={280}
                height={280}
                className="object-contain inline-block"
                priority
              />
            </div>
          </h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Choose your path to get started with our job portal platform
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="relative">
              <MagicCard
                gradientColor={theme === "dark" ? "gray" : "#d9d9d9"}
                className="w-72 h-48 bg-background rounded-lg border-input border-2 dark:text-white text-black flex justify-center flex-col gap-4 px-6"
              >
                <div className="flex justify-center">
                  <User className="size-12 text-primary" />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-semibold block mb-2">
                    Job Seeker
                  </span>
                  <span className="text-sm text-muted-foreground dark:text-slate-300 mb-10">
                    Search for Dream jobs
                  </span>
                  <div className="flex gap-2 my-1">
                    <RegisterLinks href="/onboarding/job-seeker" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Register
                      </Button>
                    </RegisterLinks>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push('/job-seeker/login')}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </MagicCard>
            </div>

            <div className="relative">
              <MagicCard
                gradientColor={theme === "dark" ? "gray" : "#d9d9d9"}
                className="w-72 h-48 bg-background rounded-lg border-input border-2 dark:text-white text-black flex justify-center flex-col gap-4 px-6"
              >
                <div className="flex justify-center">
                  <Building className="size-12 text-primary" />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-semibold block mb-2">
                    Employer
                  </span>
                  <span className="text-sm text-muted-foreground dark:text-slate-300 mb-10">
                    Post Dream jobs
                  </span>
                  <div className="flex gap-2 my-1">
                    <RegisterLinks href="/onboarding/employer" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Register
                      </Button>
                    </RegisterLinks>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push('/employer/login')}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </MagicCard>
            </div>
          </div>
        </div>
      </Container>

    </div>
  );
};

export default UserSelectionSection;