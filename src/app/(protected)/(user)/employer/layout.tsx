import AuthGuard from "@/components/AuthGuard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard requiredRole="employer">
      {children}
    </AuthGuard>
  );
};
export default layout;
