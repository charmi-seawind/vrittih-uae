import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ResumeEditorFormShell from "./ResumeEditorFormShell";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { certificationsSchema, CertificationsValues } from "@/schema/ResumeEditorSchema";

const CertificationForm = forwardRef(({
  resumeData,
  setResumeData,
}: any, ref) => {
  const [certifications, setCertifications] = useState(resumeData.certifications || []);
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
  });
  
  // Sync with parent resumeData when it changes
  useEffect(() => {
    setCertifications(resumeData.certifications || []);
  }, [resumeData.certifications]);
  
  const form = useForm<CertificationsValues>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: formData,
    values: formData,
    mode: "onChange",
  });

  // Update form data whenever form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as any);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: CertificationsValues) => {
    // Check for duplicate certification entry
    const isDuplicate = certifications.some((certification: any) => 
      certification.name?.toLowerCase().trim() === data.name?.toLowerCase().trim() &&
      certification.issuer?.toLowerCase().trim() === data.issuer?.toLowerCase().trim()
    );

    if (isDuplicate) {
      form.setError("name", {
        type: "manual",
        message: "This certification already exists"
      });
      return;
    }

    const newCertifications = [...certifications, data];
    setCertifications(newCertifications);
    setResumeData({
      ...resumeData,
      certifications: newCertifications,
    });
    // Reset form and persistent form data
    const resetData = {
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
    };
    setFormData(resetData);
    form.reset(resetData);
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = certifications.filter((_: any, i: number) => i !== index);
    setCertifications(updatedCertifications);
    setResumeData({
      ...resumeData,
      certifications: updatedCertifications,
    });
  };

  useImperativeHandle(ref, () => ({
    getValues: () => form.getValues(),
  }));

  return (
    <ResumeEditorFormShell
    //  title="Certifications" 
    //  description="Add your professional certifications"
     >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Certification Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter certification name" 
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Issuer</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter issuer name" 
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Issue Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      onChange={(e) => {
                        const year = e.target.value;
                        field.onChange(year ? `${year}-01-01` : '');
                      }}
                      value={field.value ? field.value.split('-')[0] : ''}
                      placeholder="YYYY"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Expiry Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      onChange={(e) => {
                        const year = e.target.value;
                        field.onChange(year ? `${year}-01-01` : '');
                      }}
                      value={field.value ? field.value.split('-')[0] : ''}
                      placeholder="YYYY"
                      min="1900"
                      max={new Date().getFullYear() + 50}
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="credentialId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Credential ID</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter credential ID (optional)" 
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium">
            Add Certification
          </Button>
        </form>
      </Form>
      
      {certifications.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Added Certifications</h3>
          <div className="space-y-3 sm:space-y-4">
            {certifications.map((certification: any, index: number) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow relative group"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{certification.name}</h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-1">{certification.issuer}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    {certification.issueDate ? `${certification.issueDate.split('-')[0]} - ${certification.expiryDate ? certification.expiryDate.split('-')[0] : 'No Expiry'}` : ''}
                  </p>
                  {certification.credentialId && (
                    <p className="text-xs sm:text-sm text-gray-600 font-mono">ID: {certification.credentialId}</p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeCertification(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ResumeEditorFormShell>
  );
});

// Validation function to check if certifications section is complete
export const validateCertificationsSection = (resumeData: any) => {
  // Certifications are optional, always return valid
  return {
    isValid: true,
    message: ""
  };
};

export default CertificationForm;
