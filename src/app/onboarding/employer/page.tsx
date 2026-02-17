"use client";

import { useRouter } from "next/navigation";
import MultiStepEmployerOnboardingForm from "@/components/Forms/MultiStepEmployerOnboardingForm";
import FormSide from "@/components/FormSide";
import AnimateWrapper from "@/components/Global/AnimateWrapper";
import Logo from "@/components/ui/logo";
import Image from "next/image";
import { Heart } from "lucide-react";

const EmployerOnboardingPage = () => {
  const router = useRouter();

  const handleOnboardingComplete = () => {
    router.push("/employer/dashboard");
  };

  return (
    <>
      <div className="min-h-screen flex">
    <article className="relative hidden xl:contents">
      <AnimateWrapper reverse>
        <FormSide
          title="Build Your Company Profile"
          description="Complete your company profile to start posting jobs and finding the best talent on Vrrittih."
        />
      </AnimateWrapper>
    </article>
    <article className="dark:bg-black bg-[#164bac] place-content-center xl:w-1/2 w-full">
      {/* rest of your content */}
    </article>
  </div>
      <article className="dark:bg-black bg-[#164bac]   place-content-center">
        <AnimateWrapper className="relative">
          <div className="mx-auto max-w-5xl w-full px-4 pt-1 pb-1">
            {/* Mobile Logo - only visible on small screens */}
            <div className="xl:hidden mb-0 text-center">
              <div 
                className="cursor-pointer hover:scale-105 transition-transform inline-block"
                onClick={() => window.location.href = 'https://vrrittih.com'}
              >
                <Image
                  src="/logo/vrrittih.png"
                  alt="Vrrittih Logo"
                  width={160}
                  height={160}
                
                  className="object-contain mx-auto mt-10 md:mt-0 bg-white p-3 rounded-3xl"
                  priority
                />
              </div>
            </div>
            <MultiStepEmployerOnboardingForm onComplete={handleOnboardingComplete} />
            {/* Mobile Footer - only visible on small screens */}
            <div className="xl:hidden mt-6 flex items-center justify-center gap-2 text-[11px] md:text-sm text-white">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Designed by</span>
              <a 
                href="https://seawindsolution.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-underline"
                style={{ color: 'white' }}
              >
                Seawind Solution Pvt Ltd
              </a>
              <Image
                src="/favicon/favicon.ico"
                alt="Favicon"
                width={16}
                height={16}
                className="animate-spin"
              />
            </div>
          </div>
        </AnimateWrapper>
      </article>
    </>
  );
};

export default EmployerOnboardingPage;


