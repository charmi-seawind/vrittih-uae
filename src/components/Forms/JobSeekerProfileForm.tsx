'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingButton from '@/components/ui/loading-button';
import { useState } from 'react';

const JobSeekerProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .regex(/^[a-zA-Z\s]*$/, 'Please enter only letters and spaces')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .regex(/^[a-zA-Z\s]*$/, 'Please enter only letters and spaces')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  phone: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]*$/, 'Please enter numbers only')
    .min(10, 'Mobile number must be at least 10 digits')
    .max(10, 'Mobile number must be exactly 10 digits'),
  location: z
    .string()
    .min(1, 'Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must not exceed 100 characters'),
  experience: z
    .string()
    .min(1, 'Experience level is required'),
  skills: z
    .string()
    .min(1, 'Skills are required')
    .min(3, 'Skills must be at least 3 characters')
    .max(500, 'Skills must not exceed 500 characters'),
  expectedSalary: z
    .string()
    .min(1, 'Expected salary is required')
    .regex(/^[0-9]*$/, 'Please enter numbers only')
    .refine((val) => val === '' || parseInt(val) > 0, 'Expected salary must be greater than 0')
    .refine((val) => val === '' || parseInt(val) <= 10000000, 'Expected salary must not exceed ₹1 crore'),
  jobTitle: z
    .string()
    .min(1, 'Job title is required')
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must not exceed 100 characters'),
  summary: z
    .string()
    .min(1, 'Professional summary is required')
    .min(10, 'Professional summary must be at least 10 characters')
    .max(1000, 'Professional summary must not exceed 1000 characters'),
});

type JobSeekerProfileFormData = z.infer<typeof JobSeekerProfileSchema>;

export default function JobSeekerProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<JobSeekerProfileFormData>({
    resolver: zodResolver(JobSeekerProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      experience: '',
      skills: '',
      expectedSalary: '',
      jobTitle: '',
      summary: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: JobSeekerProfileFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/jobseeker/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/register/job_seeker/cv-upload');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first name"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your last name"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter 10 digit mobile number"
                    disabled={isLoading}
                    maxLength={10}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location <span className="text-red-500">*</span> </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your location"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level <span className="text-red-500">*</span> </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fresher">Fresher (0-1 years)</SelectItem>
                    <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                    <SelectItem value="mid">Mid-level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., JavaScript, React, Node.js"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Salary (₹) <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter expected salary"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Software Developer"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your professional background..."
                    rows={4}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Continue to CV Upload
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}