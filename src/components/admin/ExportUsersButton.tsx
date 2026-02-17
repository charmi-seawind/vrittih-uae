"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

const ExportUsersButton = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/export-users`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export users");
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(result.data);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        
        // Generate filename with current date
        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `users_export_${currentDate}.xlsx`;
        
        // Save file
        XLSX.writeFile(workbook, filename);
        
        toast.success(`Successfully exported ${result.data.length} users to ${filename}`);
      } else {
        throw new Error(result.message || "Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export users. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isExporting ? "Exporting..." : "Export Users"}
    </Button>
  );
};

export default ExportUsersButton;