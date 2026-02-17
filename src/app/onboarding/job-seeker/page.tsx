"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import MultiStepOnboardingForm from "@/components/Forms/MultiStepOnboardingForm";
import FormSide from "@/components/FormSide";
import AnimateWrapper from "@/components/Global/AnimateWrapper";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import Logo from "@/components/ui/logo";
import Image from "next/image";
import { Heart } from "lucide-react";
import { blockquote } from "framer-motion/client";

const JobSeekerOnboardingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, setPendingUserId, setEmailVerified, setMobileVerified } = useOnboardingStore();
  
  const pendingUserId = searchParams.get('pendingUserId');

  useEffect(() => {
    if (pendingUserId) {
      // Admin-created user - skip to payment step
      setPendingUserId(pendingUserId);
      setEmailVerified(true);
      localStorage.setItem('pendingUserId', pendingUserId);
    }
  }, [pendingUserId, setPendingUserId, setEmailVerified]);

  const handleOnboardingComplete = () => {
    router.push("/job-seeker/dashboard");
  };

  return (
    <>
            <article className="relative hidden xl:contents" >

        <AnimateWrapper reverse>
          <FormSide currentStep={currentStep} />
        </AnimateWrapper>
      </article>
      <article className="dark:bg-black bg-[#164bac]  grid grid-cols-1 place-content-center p-5">
        <AnimateWrapper className="relative">
          <div className="mx-auto max-w-5xl w-full   pb-6 md:pb-8 lg:pb-0">
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
                  className="object-contain mx-auto mt-20 md:mt-10 bg-white p-3 rounded-3xl "
                  priority
                />
              </div>
            </div>
            <MultiStepOnboardingForm onComplete={handleOnboardingComplete} isAdminCreated={!!pendingUserId} />
            {/* Mobile Footer - only visible on small screens */}
            <div className="xl:hidden mt-6 flex items-center justify-center gap-2 text-[12px] text-white">
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

export default JobSeekerOnboardingPage;