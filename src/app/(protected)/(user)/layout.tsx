const UserTypePageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div suppressHydrationWarning>{children}</div>;
};
export default UserTypePageLayout;
