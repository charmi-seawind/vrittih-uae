"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Loader2, FileSpreadsheet, Users } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface UserData {
  Name: string;
  Phone: string;
  Email: string;
  Status: string;
}

const ExportUsersDialog = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<UserData[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const loadPreview = async () => {
    setIsLoadingPreview(true);
    
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
        throw new Error("Failed to load preview");
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setPreviewData(result.data.slice(0, 5)); // Show first 5 records as preview
      }
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Failed to load preview");
    } finally {
      setIsLoadingPreview(false);
    }
  };

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
        
        // Set column widths
        const columnWidths = [
          { wch: 25 }, // Name
          { wch: 15 }, // Phone
          { wch: 30 }, // Email
          { wch: 15 }, // Status
        ];
        worksheet['!cols'] = columnWidths;
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        
        // Generate filename with current date
        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `users_export_${currentDate}.xlsx`;
        
        // Save file
        XLSX.writeFile(workbook, filename);
        
        toast.success(`Successfully exported ${result.data.length} users to ${filename}`);
        setIsOpen(false);
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && previewData.length === 0) {
      loadPreview();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Export Users to Excel
          </DialogTitle>
          <DialogDescription>
            Export all users (registered and pending) to an Excel spreadsheet with the following columns:
            Name, Phone, Email, and Status.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview Section */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Preview (First 5 records)
            </h4>
            
            {isLoadingPreview ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading preview...</span>
              </div>
            ) : previewData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Phone</th>
                      <th className="text-left p-2 font-medium">Email</th>
                      <th className="text-left p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((user, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{user.Name}</td>
                        <td className="p-2">{user.Phone}</td>
                        <td className="p-2 truncate max-w-[200px]">{user.Email}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.Status === 'Registered User' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No data available for preview</p>
            )}
          </div>
          
          {/* Export Button */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={isExporting || previewData.length === 0}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? "Exporting..." : "Export to Excel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportUsersDialog;