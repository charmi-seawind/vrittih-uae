import BackButton from "@/components/Global/BackButton";
import Light from "@/components/Global/Light";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Profile - Vrrittih",
  description: "Complete your job seeker profile to get started",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative">
      <BackButton
        href="/"
        className=" bg-white text-[#164bac] md:bg-white md:text-[#164bac]  xl:bg-[#164bac] xl:text-white dark:bg-black dark:border hover:bg-primary/80 dark:border-gray-700 fixed  hover:dark:bg-black/80 top-10 left-10 z-20"
      />
      <Light className="invisible lg:visible z-10 " />
      <section className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2  h-dvh ">
        {children}
      </section>
    </main>
  );
}