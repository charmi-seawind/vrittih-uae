"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface MapProps {
  className?: string;
}

const Map = ({ className }: MapProps) => {
  return (
    <div className={cn("w-full h-full absolute", className)} id="map-container">
      {/* Placeholder UI (No Radar calls = No runtime errors) */}
      <div className="flex items-center justify-center h-full text-gray-500">
        Map will show here…
      </div>
    </div>
  );
};

export default Map;
