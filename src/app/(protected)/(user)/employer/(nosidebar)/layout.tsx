import EmployerNav from "@/components/sidebar/EmployerNav";

const NoSidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <EmployerNav activeCompanyId={null} user={null} />
      <div className="relative flex min-h-[calc(100vh-4rem)]">{children}</div>
    </>
  );
};
export default NoSidebarLayout;
