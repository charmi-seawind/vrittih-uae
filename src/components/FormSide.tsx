// import {
//   FileUser,
//   MailCheck,
//   UserSearch,
//   GraduationCap,
//   Briefcase,
//   Code,
//   FolderOpen,
//   Award,
//   Upload,
//   Heart,
//   Home,
// } from "lucide-react";
// import OrbitingCircles from "./ui/orbiting-circles";
// import Image from "next/image";
// import { Button } from "./ui/button";

// import Logo from "@/components/ui/logo";

// interface FormSideProps {
//   title?: string;
//   description?: string;
//   currentStep?: number;
// }

// const stepContent = {
//   1: {
//     title: "Personal Information",
//     description:
//       "Share your basic details to create your professional profile. This helps employers understand who you are.",
//   },
//   2: {
//     title: "Education Background",
//     description:
//       "Add your educational qualifications to showcase your academic achievements and learning journey.",
//   },
//   3: {
//     title: "Work Experience",
//     description:
//       "Highlight your professional experience to demonstrate your skills and career progression.",
//   },
//   4: {
//     title: "Skills & Expertise",
//     description:
//       "List your technical and soft skills to help employers match you with the right opportunities.",
//   },
//   5: {
//     title: "Projects Portfolio",
//     description:
//       "Showcase your projects to demonstrate your practical experience and problem-solving abilities.",
//   },
//   6: {
//     title: "Certifications",
//     description:
//       "Add your certifications and achievements to validate your expertise and commitment to learning.",
//   },
//   7: {
//     title: "Upload Resume",
//     description:
//       "Upload your CV to complete your profile and make it ready for employers to discover.",
//   },
// };

// const getStepIcon = (step: number) => {
//   switch (step) {
//     case 1:
//       return UserSearch;
//     case 2:
//       return GraduationCap;
//     case 3:
//       return Briefcase;
//     case 4:
//       return Code;
//     case 5:
//       return FolderOpen;
//     case 6:
//       return Award;
//     case 7:
//       return Upload;
//     default:
//       return UserSearch;
//   }
// };

// const FormSide = ({ description, title, currentStep = 1 }: FormSideProps) => {
//   const content =
//     stepContent[currentStep as keyof typeof stepContent] || stepContent[1];
//   const displayTitle = title || content.title;
//   const displayDescription = description || content.description;
//   const StepIcon = getStepIcon(currentStep);
//   return (
//     <div className="h-full flex  flex-col  w-full p-8   ">

// {/* h-full fixed left-1/4 -translate-x-1/2 flex flex-col p-8 w-screen */}


//       <div className="flex-1 flex justify-center items-center relative top-1/2">
//         <div className="w-[360px] h-[360px] flex items-center justify-center p-16">
//           <div
//             className="cursor-pointer hover:scale-105 transition-transform"
//             onClick={() => window.open("https://vrrittih.com", "_blank")}
//           >
//             <Image
//               src="/logo/vrrittih.png"
//               alt="Vrrittih Logo"
//               width={280}
//               height={280}
//               className="object-contain z-10"
//               priority
//             />
//           </div>
//         </div>
//         <OrbitingCircles
//           className="size-[50px] border-none bg-transparent"
//           duration={20}
//           delay={20}
//           radius={180}
//         >
//           <StepIcon size={80} className="fill-primary text-primary" />
//         </OrbitingCircles>
//         <OrbitingCircles
//           className="size-[50px] border-none bg-transparent"
//           duration={20}
//           delay={10}
//           radius={180}
//         >
//           <StepIcon size={50} className="fill-primary text-primary" />
//         </OrbitingCircles>

//         <OrbitingCircles
//           className="size-[100px] border-none bg-transparent"
//           radius={280}
//           duration={20}
//           reverse
//         >
//           <FileUser size={80} className="fill-primary text-white" />
//         </OrbitingCircles>
//         <OrbitingCircles
//           className="size-[100px] border-none bg-none"
//           radius={280}
//           duration={20}
//           delay={20}
//           reverse
//         >
//           <MailCheck size={80} className="fill-primary text-white" />
//         </OrbitingCircles>
//       </div>

//       <div
//         className="
//   absolute bottom-4 left-0 right-0
//   flex flex-wrap items-center justify-center
//   gap-2 sm:gap-2
//   text-xs sm:text-sm
//   text-muted-foreground
//   px-3 text-center
// "
//       >
//         <span>Made with</span>

//         <Heart className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />

//         <span>Designed by</span>

//         <a
//           href="https://seawindsolution.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="no-underline break-words"
//           style={{ color: "#163A7A" }}
//         >
//           Seawind Solution Pvt Ltd
//         </a>

//         <Image
//           src="/favicon/favicon.ico"
//           alt="Favicon"
//           width={16}
//           height={16}
//           className="animate-spin flex-shrink-0"
//         />
//       </div>
//     </div>
//   );
// };
// export default FormSide;



import {
  FileUser,
  MailCheck,
  UserSearch,
  GraduationCap,
  Briefcase,
  Code,
  FolderOpen,
  Award,
  Upload,
  Heart,
  Home,
} from "lucide-react";
import OrbitingCircles from "./ui/orbiting-circles";
import Image from "next/image";
import { Button } from "./ui/button";

import Logo from "@/components/ui/logo";

interface FormSideProps {
  title?: string;
  description?: string;
  currentStep?: number;
}

const stepContent = {
  1: {
    title: "Personal Information",
    description:
      "Share your basic details to create your professional profile. This helps employers understand who you are.",
  },
  2: {
    title: "Education Background",
    description:
      "Add your educational qualifications to showcase your academic achievements and learning journey.",
  },
  3: {
    title: "Work Experience",
    description:
      "Highlight your professional experience to demonstrate your skills and career progression.",
  },
  4: {
    title: "Skills & Expertise",
    description:
      "List your technical and soft skills to help employers match you with the right opportunities.",
  },
  5: {
    title: "Projects Portfolio",
    description:
      "Showcase your projects to demonstrate your practical experience and problem-solving abilities.",
  },
  6: {
    title: "Certifications",
    description:
      "Add your certifications and achievements to validate your expertise and commitment to learning.",
  },
  7: {
    title: "Upload Resume",
    description:
      "Upload your CV to complete your profile and make it ready for employers to discover.",
  },
};

const getStepIcon = (step: number) => {
  switch (step) {
    case 1:
      return UserSearch;
    case 2:
      return GraduationCap;
    case 3:
      return Briefcase;
    case 4:
      return Code;
    case 5:
      return FolderOpen;
    case 6:
      return Award;
    case 7:
      return Upload;
    default:
      return UserSearch;
  }
};

const FormSide = ({ description, title, currentStep = 1 }: FormSideProps) => {
  const content =
    stepContent[currentStep as keyof typeof stepContent] || stepContent[1];
  const displayTitle = title || content.title;
  const displayDescription = description || content.description;
  const StepIcon = getStepIcon(currentStep);
  return (
    <div className="fixed left-0 top-0 h-screen w-1/2 hidden xl:block bg-white z-10">
      <div className="h-full flex justify-center items-center relative">
        <div className="w-[360px] h-[360px] flex items-center justify-center p-16">
          <div
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => window.open("https://vrrittih.com", "_blank")}
          >
            <Image
              src="/logo/vrrittih.png"
              alt="Vrrittih Logo"
              width={280}
              height={280}
              className="object-contain z-20 relative"
              priority
            />
          </div>
        </div>
        <OrbitingCircles
          className="size-[50px] border-none bg-transparent"
          duration={20}
          delay={20}
          radius={180}
        >
          <StepIcon size={80} className="fill-primary text-primary" />
        </OrbitingCircles>
        <OrbitingCircles
          className="size-[50px] border-none bg-transparent"
          duration={20}
          delay={10}
          radius={180}
        >
          <StepIcon size={50} className="fill-primary text-primary" />
        </OrbitingCircles>

        <OrbitingCircles
          className="size-[100px] border-none bg-transparent"
          radius={280}
          duration={20}
          reverse
        >
          <FileUser size={80} className="fill-primary text-white" />
        </OrbitingCircles>
        <OrbitingCircles
          className="size-[100px] border-none bg-none"
          radius={280}
          duration={20}
          delay={20}
          reverse
        >
          <MailCheck size={80} className="fill-primary text-white" />
        </OrbitingCircles>
      </div>

      <div
        className="
  absolute bottom-10 left-0 right-0
  flex flex-wrap items-center justify-center
  gap-2 sm:gap-2
  text-xs sm:text-sm
  text-muted-foreground
  px-3 text-center
"
      >
        <span>Made with</span>

        <Heart className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />

        <span>Designed by</span>

        <a
          href="https://seawindsolution.com"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline break-words"
          style={{ color: "#163A7A" }}
        >
          Seawind Solution Pvt Ltd
        </a>

        <Image
          src="/favicon/favicon.ico"
          alt="Favicon"
          width={16}
          height={16}
          className="animate-spin flex-shrink-0"
        />
      </div>
    </div>
  );
};
export default FormSide;
