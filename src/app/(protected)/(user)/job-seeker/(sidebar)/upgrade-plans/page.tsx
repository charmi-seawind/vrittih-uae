"use client";

import UpgradeSubscriptionForm from "@/components/Forms/UpgradeSubscriptionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const JobSeekerUpgradePlansPage = () => {
  const router = useRouter();

  const handleUpgradeComplete = () => {
    router.push('/job-seeker/dashboard');
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Upgrade Your Plan</CardTitle>
          <p className="text-center text-muted-foreground">
            Choose a plan that fits your needs and upgrade instantly
          </p>
        </CardHeader>
        <CardContent>
          <UpgradeSubscriptionForm 
            onComplete={handleUpgradeComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSeekerUpgradePlansPage;