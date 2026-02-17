import AuthGuard from "@/components/AuthGuard";

const JobSeekerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard requiredRole="candidate">
      {children}
    </AuthGuard>
  );
};
export default JobSeekerLayout;
