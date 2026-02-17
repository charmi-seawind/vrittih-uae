import { Logo } from "@/components/LandingPage/NavBar";

const loading = () => {
  return (
    <>
      <div
        id="loading-bg"
        className="flex items-center justify-center h-screen w-full"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="animate-pulse">
            <Logo 
              width="150" 
              height="150" 
              fill="hsl(var(--primary))" 
              showText={false}
            />
          </div>
          <div className="text-black dark:text-white text-base tracking-[12px] uppercase font-semibold mt-4">
            Loading...
          </div>
        </div>
      </div>
    </>
  );
};
export default loading;
