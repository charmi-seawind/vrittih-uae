"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
});

type ForgetPasswordSchemaType = z.infer<typeof ForgetPasswordSchema>;
import CardWrapper from "../Global/CardWrapper";
import LoadingButton from "../ui/loading-button";
// import { sendResetPasswordVerification } from "@/actions/auth/sendResetPasswordVerification";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const ForgetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ForgetPasswordSchemaType>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgetPasswordSchemaType) => {
    startTransition(async () => {
      // 🟠 API call commented out
      // const { error, success } = await sendResetPasswordVerification(
      //   data.email
      // );
      // if (error) {
      //   toast.error(error, { id: "forget-password-error" });
      // } else if (success) {
      //   toast.success(success, { id: "forget-password-success" });
      //   router.push("/login");
      // }
      
      // 🔹 Dummy password reset
      setTimeout(() => {
        toast.success("Password reset link sent to your email!", { id: "forget-password-success" });
        router.push("/login");
      }, 1000);
    });
  };

  return (
    <CardWrapper
      classname="bg-white dark:bg-black"
      backButtonHref="/login"
      backButtonLabel="Back To Login"
      headerLabel="Forget Password?"
      showFooter
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">Email Address *</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    className="h-11 sm:h-12 text-base"
                    disabled={isPending} 
                    placeholder="Enter your email address"
                    autoFocus 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
                <FormDescription className="text-xs sm:text-sm">
                  Enter your user account's verified email address and we will
                  send you a password reset link.
                </FormDescription>
              </FormItem>
            )}
          />
          <LoadingButton
            className="w-full h-11 sm:h-12 text-base font-medium"
            showIconOnly
            loading={isPending}
            type="submit"
          >
            Send Password Reset Link
          </LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default ForgetPasswordForm;
