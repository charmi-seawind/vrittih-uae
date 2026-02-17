'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface ParsedCV {
  name: string;
  email: string;
  phone: string;
  experience: string;
  skills: string[];
  education: string;
  summary: string;
}

export default function CVUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);

    // Save file to localStorage as base64
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem('uploadedResume', reader.result as string);
    };
    reader.readAsDataURL(selectedFile);

    // Simulate CV parsing
    // setTimeout(() => {
    //   setParsedData({
    //     name: 'John Doe',
    //     email: 'john.doe@email.com',
    //     phone: '+91 9876543210',
    //     experience: '3 years in Software Development',
    //     skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    //     education: 'B.Tech Computer Science',
    //     summary: 'Experienced software developer with expertise in full-stack development.'
    //   });
    //   setIsParsing(false);
    // }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Save CV and parsed data
    setTimeout(() => {
      setIsUploading(false);
      router.push('/register/job_seeker/payment');
    }, 1500);
  };

  const updateParsedField = (field: keyof ParsedCV, value: string | string[]) => {
    if (parsedData) {
      setParsedData({ ...parsedData, [field]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your CV</h1>
          <p className="text-gray-600 mt-2">Upload your CV and review the parsed information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              CV Upload & Parsing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Label htmlFor="cv-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-gray-900">Upload your CV</span>
                  <p className="text-gray-500 mt-1">PDF, DOC, or DOCX files only</p>
                  <Input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button className="mt-4">Choose File</Button>
                </Label>
              </div>
            )}

            {file && !parsedData && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Parsing your CV...</p>
              </div>
            )}

            {parsedData && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">CV parsed successfully! Please review and edit the information below:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={parsedData.name}
                      onChange={(e) => updateParsedField('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={parsedData.email}
                      onChange={(e) => updateParsedField('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={parsedData.phone}
                      onChange={(e) => updateParsedField('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      value={parsedData.experience}
                      onChange={(e) => updateParsedField('experience', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={parsedData.skills.join(', ')}
                    onChange={(e) => updateParsedField('skills', e.target.value.split(', '))}
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    value={parsedData.education}
                    onChange={(e) => updateParsedField('education', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    value={parsedData.summary}
                    onChange={(e) => updateParsedField('summary', e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue to Payment
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}