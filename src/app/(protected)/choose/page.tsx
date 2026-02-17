import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { VrrittihLogo } from "../../../../public/logo/Vrrittih";
// import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// import { getUserByEmail } from "@/data-access/user";
// import {
//   DEFAULT_LOGIN_REDIRECT_ADMIN,
//   DEFAULT_LOGIN_REDIRECT_EMPLOYER,
//   DEFAULT_LOGIN_REDIRECT_JOB_SEEKER,
// } from "@/routes";
// import prisma from "@/lib/prisma";
// import { UserType } from "@prisma/client";
import ChooseCard from "./ChooseCard";
const Choose = async () => {
  // Commented out original authentication logic
  // const session = await auth();
  // const user = session?.user;

  // const dbUser = await getUserByEmail(user?.email!);

  // if (dbUser?.userType) {
  //   if (dbUser.userType === "JOB_SEEKER") {
  //     redirect(DEFAULT_LOGIN_REDIRECT_JOB_SEEKER);
  //   } else if (dbUser.userType === "EMPLOYER") {
  //     redirect(DEFAULT_LOGIN_REDIRECT_EMPLOYER);
  //   } else if (dbUser.userType === "ADMIN") {
  //     redirect(DEFAULT_LOGIN_REDIRECT_ADMIN);
  //   }
  // }
  
  const updateUserType = async (type: string) => {
    "use server";
    // Dummy implementation for role selection
    const redirectPaths = {
      'JOB_SEEKER': '/job-seeker/dashboard',
      'EMPLOYER': '/employer/dashboard',
      'ADMIN': '/admin/dashboard'
    };
    
    redirect(redirectPaths[type as keyof typeof redirectPaths]);
    
    // Original database logic commented out
    // const updatedUser = await prisma.user.update({
    //   where: {
    //     email: dbUser?.email,
    //   },
    //   data: {
    //     userType: type,
    //   },
    // });
    // if (type === "JOB_SEEKER") {
    //   await prisma.jOB_SEEKER.create({
    //     data: {
    //       userId: updatedUser.id,
    //     },
    //   });
    //   redirect(DEFAULT_LOGIN_REDIRECT_JOB_SEEKER);
    // } else if (type === "EMPLOYER") {
    //   await prisma.employer.create({
    //     data: {
    //       userId: updatedUser.id,
    //     },
    //   });
    //   redirect(DEFAULT_LOGIN_REDIRECT_EMPLOYER);
    // } else if (type === "ADMIN") {
    //   redirect(DEFAULT_LOGIN_REDIRECT_ADMIN);
    // }
  };
  return (
    <main className="flex relative h-dvh flex-col justify-center items-center">
      <div className="flex items-center gap-2 absolute top-10 left-10 ">
        {/* <VrrittihLogo width={"35px"} height={"35px"} fill={"#19489e"} /> */}
        <div className="w-[35px] h-[35px] bg-primary rounded-full flex items-center justify-center text-white font-bold">V</div>
        <span className=" text-3xl tracking-wide text-primary">Vrrittih</span>
      </div>
      <Card className="max-w-[550px]  sm:w-[550px] mx-auto">
        <CardHeader>
          <CardTitle>Choose Account Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ChooseCard updateUserType={updateUserType} />
        </CardContent>
      </Card>
    </main>
  );
};
export default Choose;
