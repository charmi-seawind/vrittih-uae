"use client";

import { useTheme } from "next-themes";
import { Toaster as Toast } from "sonner";
import { useEffect, useState } from "react";

const Toaster = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Toast
      richColors
      theme={theme as "light" | "dark" | "system" | undefined}
    />
  );
};
export default Toaster;
