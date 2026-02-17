"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface AICVUploadFormProps {
  onParseComplete: (data: any) => void;
}

const AICVUploadForm = ({ onParseComplete }: AICVUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed');
      return;
    }
    
    setFile(selectedFile);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error('Photo size must be less than 2MB');
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only JPG, JPEG, and PNG files are allowed');
      return;
    }
    
    setPhoto(selectedFile);
  };

  const handleParse = async () => {
    if (!file) {
      toast.error('Please upload your CV');
      return;
    }

    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);
      if (photo) {
        formData.append('photo', photo);
      }

      const response = await fetch('/api/job-seeker/parse-cv', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to parse CV');
      }

      const result = await response.json();

      const parsedData = result.data?.data || result.data;

      onParseComplete({ ...parsedData, cvFile: file, photoFile: photo });
      toast.success('CV parsed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to parse CV');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Your CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Upload your CV</p>
              <p className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX (Max 5MB)</p>
              <Input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={() => document.getElementById('cv-upload')?.click()}>
                Choose File
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
                <Check className="h-4 w-4" />
                {file.name}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFile(null)}
                className="mt-2"
              >
                Change File
              </Button>
            </div>
          )}

          <div className="border-t pt-6">
            <p className="font-medium mb-3">Profile Photo (Optional)</p>
            {!photo ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">JPG, JPEG, or PNG (Max 2MB)</p>
                <Input
                  id="photo-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                  Choose Photo
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-green-800 dark:text-green-200 text-sm flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  {photo.name}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPhoto(null)}
                  className="mt-2"
                >
                  Remove Photo
                </Button>
              </div>
            )}
          </div>

          {file && (
            <Button
              onClick={handleParse}
              disabled={isParsing}
              className="w-full"
              size="lg"
            >
              {isParsing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing CV...
                </>
              ) : (
                'Parse CV with AI'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AICVUploadForm;
