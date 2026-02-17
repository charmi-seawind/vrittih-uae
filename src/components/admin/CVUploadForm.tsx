"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const CVUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!selectedFile.type.includes('pdf') && !selectedFile.name.endsWith('.pdf') && 
          !selectedFile.type.includes('word') && !selectedFile.name.endsWith('.doc') && !selectedFile.name.endsWith('.docx')) {
        toast.error("Only PDF and Word files are supported");
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file, file.name);
      
      // Debug: Check if file is properly added



      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/create-user-from-cv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      const text = await response.text();

      
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        // Handle HTML-encoded response
        const decodedText = text.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        data = JSON.parse(decodedText);
      }

      if (data.success) {
        setUploadResult(data.data);
        toast.success("User created successfully! Email sent to candidate.");
        setFile(null);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Create User from CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadResult ? (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload CV or drag and drop
                </p>
                <p className="text-xs text-gray-400">PDF and Word files only, max 5MB</p>
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  size="sm"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Create User'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">User Created Successfully</span>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <p><strong>Name:</strong> {uploadResult.name}</p>
              <p><strong>Email:</strong> {uploadResult.email}</p>
              <p><strong>Job Title:</strong> {uploadResult.parsedData.jobTitle}</p>
              <p><strong>Category:</strong> {uploadResult.parsedData.jobCategory}</p>
              {uploadResult.parsedData.phone && (
                <p><strong>Phone:</strong> {uploadResult.parsedData.phone}</p>
              )}
              <div className="text-sm text-gray-600 mt-2">
                <p>Parsed: {uploadResult.parsedData.educationCount} education, {uploadResult.parsedData.experienceCount} experience, {uploadResult.parsedData.skillsCount} skills</p>
              </div>
            </div>



            <Button
              onClick={() => {
                setUploadResult(null);
                setFile(null);
              }}
              variant="outline"
              className="w-full"
            >
              Upload Another CV
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVUploadForm;