"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Video, X, CheckCircle, AlertCircle } from "lucide-react";

// Add global event listener for testing
if (typeof window !== 'undefined') {
  // Global state for uploaded files
  if (!window.uploadedFiles) {
    window.uploadedFiles = {};
  }
  
  window.addEventListener('videoUploaded', (event: any) => {
    const { fieldId, videoUrl } = event.detail;
    window.uploadedFiles[fieldId] = videoUrl;
  });
  
  window.addEventListener('fileUploaded', (event: any) => {
    const { fieldId, fileUrl } = event.detail;
    window.uploadedFiles[fieldId] = fileUrl;
  });
}

interface VideoUploadProps {
  fieldId: string;
  fieldLabel: string;
  required?: boolean;
  onVideoUploaded: (fieldId: string, videoUrl: string) => void;
  jobId: string;
}

const VideoUpload = ({ fieldId, fieldLabel, required, onVideoUploaded, jobId }: VideoUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (file.type !== 'video/mp4') {
      return 'Only MP4 video files are allowed';
    }

    // Check file size (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Video file size must be less than 100MB';
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

  const uploadVideo = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
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
            setVideoUrl(response.data.url);
            // Call the callback if it exists, otherwise log error
            if (typeof onVideoUploaded === 'function') {
              onVideoUploaded(fieldId, response.data.url);
            } else {
              // Alternative: dispatch a custom event
              window.dispatchEvent(new CustomEvent('videoUploaded', {
                detail: { fieldId, videoUrl: response.data.url }
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

      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/applications/upload-video`);
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
    setVideoUrl(null);
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
        <Video className="h-4 w-4" />
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
            accept="video/mp4"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mb-4">
            MP4 files only, max 100MB
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Video File
          </Button>
        </div>
      )}

      {selectedFile && uploadStatus !== 'success' && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
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
                <span>Uploading and compressing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {!uploading && (
            <Button
              type="button"
              onClick={uploadVideo}
              className="w-full"
              size="sm"
            >
              Upload Video
            </Button>
          )}
        </div>
      )}

      {uploadStatus === 'success' && videoUrl && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Video uploaded successfully
            </span>
          </div>
          <p className="text-xs text-green-600 mb-3">
            Your video has been compressed and uploaded
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
            >
              Replace Video
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

export default VideoUpload;