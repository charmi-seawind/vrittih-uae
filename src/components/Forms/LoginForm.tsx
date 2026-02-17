"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import LoadingButton from "../ui/loading-button";
import { useRef, useState } from "react";
import RegisterModel from "../RegisterModel";
import { toast } from "sonner";
import FormHeader from "./FormHeader";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { api, apiCall } from "@/lib/api";
import BackButton from "../Global/BackButton";

interface LoginFormProps {
  error: string;
}

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or mobile number is required")
    .refine((value) => {
      // Check if it's a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Check if it's a valid mobile number (10-15 digits)
      const mobileRegex = /^[0-9]{10,15}$/;
      return emailRegex.test(value) || mobileRegex.test(value);
    }, "Please enter a valid email address or mobile number"),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

const LoginForm = ({ error }: LoginFormProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    
    try {
      const response = await apiCall(api.auth.login, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        const redirectPaths = {
          'admin': '/admin/dashboard',
          'employer': '/employer/dashboard', 
          'candidate': '/job-seeker/dashboard'
        };
        
        toast.success('Login successful!');
        router.push(redirectPaths[response.user.role as keyof typeof redirectPaths] || '/job-seeker/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <BackButton/>
      <article className="mx-auto max-w-[500px] w-full px-4 sm:px-6 pt-8 sm:pt-16 pb-6">
        <div className="text-center sm:text-left flex flex-col gap-3 mb-6 sm:mb-8">
          <FormHeader
            headingText="Welcome Back"
            supportingText="Nice to see you again! Please login to continue"
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Email or Mobile Number *</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white dark:bg-transparent h-11 sm:h-12 text-base"
                        disabled={isLoading}
                        placeholder="Enter your email or mobile number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-right text-primary text-xs mt-2  ">
              <Link
                className={cn(
                  "group relative",
                  isLoading && "pointer-events-none"
                )}
                href="/forget-password"
              >
                Forgot Password?
                <div className="bg-primary w-0  h-[1px] group-hover:w-full transition-all duration-300 ease-in-out  block absolute right-0"></div>
              </Link>
            </div>

            <LoadingButton
              ref={ref}
              type="submit"
              className="w-full h-11 sm:h-12 text-base font-medium my-6"
              loading={isLoading}
              disabled={isLoading}
            >
              Login
            </LoadingButton>
          </form>
        </Form>

        <div className="text-center my-8 sm:my-10 text-sm sm:text-base">
          <span>New To Vrrittih? </span>
          <span
            onClick={() => setOpen(!open)}
            className={cn(
              " cursor-pointer text-primary relative group font-medium",
              isLoading && "pointer-events-none"
            )}
          >
            Register Now
            <div className="bg-primary w-0  h-[1.5px] group-hover:w-full transition-all duration-300 ease-in-out  block absolute right-0"></div>
          </span>
        </div>
        <RegisterModel showFooter={false} open={open} setOpen={setOpen} />
      </article>
    </>
  );
};
export default LoginForm;