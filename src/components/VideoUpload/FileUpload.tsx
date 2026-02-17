"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";

// Ensure global listeners are set up (same as VideoUpload)
if (typeof window !== 'undefined' && !window.fileUploadListenerSet) {
  window.fileUploadListenerSet = true;
  if (!window.uploadedFiles) {
    window.uploadedFiles = {};
  }
}

interface FileUploadProps {
  fieldId: string;
  fieldLabel: string;
  required?: boolean;
  onFileUploaded: (fieldId: string, fileUrl: string) => void;
  jobId: string;
}

const FileUpload = ({ fieldId, fieldLabel, required, onFileUploaded, jobId }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, DOC, and DOCX files are allowed';
    }

    // Check file size (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size must be less than 50MB';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setUploadStatus('error');
      return;
    }

    setSelectedFile(file);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('jobId', jobId);

      const token = localStorage.getItem('token');
      
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Handle response
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setUploadStatus('success');
            setFileUrl(response.data.url);
            // Call the callback if it exists, otherwise log error
            if (typeof onFileUploaded === 'function') {
              onFileUploaded(fieldId, response.data.url);
            } else {
              // Alternative: dispatch a custom event
              window.dispatchEvent(new CustomEvent('fileUploaded', {
                detail: { fieldId, fileUrl: response.data.url }
              }));
            }
          } else {
            setUploadStatus('error');
            setErrorMessage(response.message || 'Upload failed');
          }
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          setUploadStatus('error');
          setErrorMessage(errorResponse.message || 'Upload failed');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setUploadStatus('error');
        setErrorMessage('Network error occurred');
        setUploading(false);
      });

      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/applications/upload-file`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || 'Upload failed');
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
    setUploadProgress(0);
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span className="font-medium">
          {fieldLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </div>

      {!selectedFile && uploadStatus !== 'success' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mb-4">
            PDF, DOC, DOCX files only, max 50MB
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </Button>
        </div>
      )}

      {selectedFile && uploadStatus !== 'success' && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Size: {formatFileSize(selectedFile.size)}
          </p>
          
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {!uploading && (
            <Button
              type="button"
              onClick={uploadFile}
              className="w-full"
              size="sm"
            >
              Upload File
            </Button>
          )}
        </div>
      )}

      {uploadStatus === 'success' && fileUrl && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              File uploaded successfully
            </span>
          </div>
          <p className="text-xs text-green-600 mb-3">
            Your file has been uploaded
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
            >
              Replace File
            </Button>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;