'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import VrrittihFooter from '../LandingPage/VrrittihFooter';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide header and footer on onboarding pages, job-seeker dashboard, employer dashboard, admin dashboard, get-started page, pending-user pages, pending-employer pages, and public job pages
  const hideHeaderFooter = pathname.startsWith('/onboarding') || pathname.startsWith('/job-seeker') || pathname.startsWith('/employer') || pathname.startsWith('/admin') || pathname.startsWith('/get-started') || pathname.startsWith('/pending-user') || pathname.startsWith('/pending-employer') || pathname.startsWith('/jobs/');

  if (hideHeaderFooter) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <div suppressHydrationWarning>
      <Header />
      {children}
      <VrrittihFooter />
    </div>
  );
}