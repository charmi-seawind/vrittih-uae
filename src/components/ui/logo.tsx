import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-40 h-40",
    md: "w-56 h-56", 
    lg: "w-72 h-72"
  };

  return (
    <div className={cn(
      "flex justify-center items-center ",
      className
    )}>
      <div className={cn(
        "relative transform transition-all duration-300 hover:scale-105",
        "drop-shadow-2xl",
        sizeClasses[size]
      )}>
        <Image
          src="/logo/vrrittih.png"
          alt="Vrrittih Logo"
          width={160}
          height={160}
          className={cn(
            "object-contain filter drop-shadow-lg",
            "hover:drop-shadow-2xl transition-all duration-300",
            sizeClasses[size]
          )}
          priority
        />
      </div>
    </div>
  );
};

export default Logo;