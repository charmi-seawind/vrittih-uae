// import ManageSubscriptionButton from "@/components/applications/ManageSubscriptionButton";
import BoxReveal from "@/components/ui/box-reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getUserSubscription } from "@/data-access/subscription/getUserSubscription";
const getUserSubscription = () => Promise.resolve(null);
import { Metadata } from "next";
import { Suspense } from "react";
import Stripe from "stripe";
// import * as motion from "motion/react-client";
// import * as motion from "framer-motion";
const motion = { div: 'div' };
import { formatDate } from "@/lib/utils";
// import BuyPremiumModalButton from "@/components/applications/BuyPremiumModalButton";
import { adminAPI } from "@/services/api";
import BillingSkeleton from "@/components/skeletons/BillingPageSkeleton";
export const metadata: Metadata = {
  title: "Billing | Manage Your Vrrittih Billing Information",
  description: "Manage your Vrrittih billing information",
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
const BillingPage = async () => {
  return (
    <main>
      <BoxReveal>
        <div className="space-y-3">
          <h1 className=" text-xl md:text-2xl font-semibold tracking-tighter">
            Billing
          </h1>
          <p className="text-sm text-muted-foreground  tracking-wide">
            Manage your subscription and billing information
          </p>
        </div>
      </BoxReveal>
      <Suspense fallback={<BillingSkeleton />}>
        <BillingPageData />
      </Suspense>
    </main>
  );
};
export default BillingPage;

const BillingPageData = async () => {
  const subscriptionData = await getUserSubscription();
  const subscription = subscriptionData?.subscription || null;
  const priceInfo = subscriptionData?.priceInfo || null;
  const currentPlan = priceInfo
    ? (priceInfo.product as Stripe.Product).name
    : "Free";
  
  // Fetch job seeker plans from database
  let plans = [];
  try {
    const response = await adminAPI.getPlansByUserType('job_seeker');
    plans = response.data.plans;
  } catch (error) {
    plans = [];
  }
  return (
    <div className="mt-10">
      <Card className="p-6 bg-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Current Plan: {currentPlan}
            </h2>
            {currentPlan === "Free" ? (
              <p className="text-muted-foreground">
                Your next billing date will be shown here when you subscribe to
                a paid plan
              </p>
            ) : (
              <>
                {subscription?.stripeCancelAtPeriodEnd ? (
                  <>
                    <p className=" text-sm text-destructive">
                      Your Subscription will be cancelled on{" "}
                      {formatDate(subscription?.stripeCurrentPeriodEnd)}
                    </p>
                  </>
                ) : (
                  <>
                    {subscription?.stripeCurrentPeriodEnd && (
                      <p className="text-muted-foreground text-sm">
                        Your next billing date:{" "}
                        {formatDate(subscription?.stripeCurrentPeriodEnd)}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {/* {currentPlan === "Free" ? (
            <BuyPremiumModalButton />
          ) : (
            <ManageSubscriptionButton />
          )} */}
        </div>
      </Card>
      <div className="mt-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Plan Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop view - horizontal table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    {plans.map((plan: any) => (
                      <th key={plan.name} className="text-left py-3 px-4">
                        {plan.name}
                        <div className="text-muted-foreground font-normal">
                          ₹{plan.price}/{plan.duration} days
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Features</td>
                    {plans.map((plan: any) => (
                      <td key={`${plan.name}-features`} className="py-3 px-4">
                        {plan.features && plan.features.length > 0 ? (
                          <ul className="text-sm space-y-1">
                            {plan.features.map((feature: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="text-primary mr-1">✓</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted-foreground">No features listed</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile view - cards for each plan */}
            <div className="md:hidden space-y-6">
              {plans.map((plan: any) => (
                <div key={plan.name} className="border rounded-lg p-4">
                  <div className="text-lg font-bold mb-2">{plan.name}</div>
                  <div className="text-muted-foreground mb-4">
                    ₹{plan.price}/{plan.duration} days
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Features:</span>
                      {plan.features && plan.features.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {plan.features.map((feature: string, index: number) => (
                            <li key={index} className="flex items-center text-sm">
                              <span className="text-primary mr-1">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground text-sm">No features listed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
