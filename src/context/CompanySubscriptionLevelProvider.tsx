"use client";
import { createContext, useContext } from "react";

const CompanySubscriptionLevelContext = createContext(null);

export function CompanySubscriptionLevelProvider({ children }: { children: React.ReactNode }) {
  return (
    <CompanySubscriptionLevelContext.Provider value={null}>
      {children}
    </CompanySubscriptionLevelContext.Provider>
  );
}

export function useCompanySubscriptionLevel() {
  return useContext(CompanySubscriptionLevelContext);
}