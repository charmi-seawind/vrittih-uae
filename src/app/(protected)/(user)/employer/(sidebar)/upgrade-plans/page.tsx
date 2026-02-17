"use client";

import EmployerUpgradeForm from "@/components/Forms/EmployerUpgradeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  user_type: 'employer';
  features: {
    job_posts?: number;
    featured_jobs?: number;
    featured_company?: boolean;
  };
  is_active: boolean;
}

interface CurrentSubscription {
  id: string;
  plan_id: string;
  status: string;
  plan: {
    id: string;
    name: string;
    price: number;
  };
}

const EmployerUpgradePlansPage = () => {
  const router = useRouter();

  const handleUpgradeComplete = () => {
    router.push('/employer/dashboard');
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Upgrade Your Plan</CardTitle>
          <p className="text-center text-muted-foreground">
            Choose a plan that fits your hiring needs and upgrade instantly
          </p>
        </CardHeader>
        <CardContent>
          <EmployerUpgradeForm 
            onComplete={handleUpgradeComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

// const EmployerUpgradePlansPage = () => {
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [subscribing, setSubscribing] = useState<string | null>(null);
//   const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch plans and current subscription in parallel
//       const [plansResponse, subscriptionResponse] = await Promise.allSettled([
//         planAPI.getPlansByUserType('employer'),
//         planAPI.getCurrentSubscription()
//       ]);

//       if (plansResponse.status === 'fulfilled') {
//         setPlans(plansResponse.value.data.plans || []);
//       } else {
//         toast.error('Failed to load plans');
//       }

//       if (subscriptionResponse.status === 'fulfilled') {
//         const subData = subscriptionResponse.value.data;
//         setCurrentSubscription(subData || null);
//         setSubscriptionStatus(subData?.status || null);
//       }
//     } catch (error) {
//       toast.error('Failed to load upgrade plans');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectPlan = async (planId: string) => {
//     try {
//       setSubscribing(planId);
      
//       // Generate mock payment ID (in real app, this would come from payment gateway)
//       const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
//       const response = await planAPI.subscribeToPlan(planId, paymentId);
      
//       if (response.success) {
//         toast.success('Successfully upgraded your plan!');
//         // Refresh data to show updated subscription
//         await fetchData();
//       } else {
//         toast.error(response.message || 'Failed to upgrade plan');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to upgrade plan');
//     } finally {
//       setSubscribing(null);
//     }
//   };

//   const getCurrentPlanPrice = () => {
//     return currentSubscription?.plan?.price || 0;
//   };

//   const isPlanDisabled = (plan: Plan) => {
//     const currentPrice = parseFloat(getCurrentPlanPrice().toString());
//     const planPrice = parseFloat(plan.price.toString());
//     return planPrice < currentPrice; // Only disable downgrades, allow same price and upgrades
//   };

//   const isCurrentPlan = (plan: Plan) => {
//     return currentSubscription?.plan_id === plan.id || 
//            (currentSubscription?.plan?.id === plan.id);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <div className="flex items-center gap-2">
//           <Loader2 className="h-6 w-6 animate-spin" />
//           <span>Loading upgrade plans...</span>
//         </div>
//       </div>
//     );
//   }

//   if (subscriptionStatus === 'pending') {
//     return (
//       <div className="space-y-6">
//         <Card className="border-yellow-200 bg-yellow-50">
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <AlertCircle className="w-16 h-16 text-yellow-600 mb-4" />
//             <h3 className="text-xl font-semibold text-yellow-800 mb-2">
//               Payment Verification Pending
//             </h3>
//             <p className="text-yellow-700 text-center mb-4 max-w-md">
//               Your payment is currently being verified by our admin team. You will be able to upgrade your plan once your current payment is verified.
//             </p>
//             <p className="text-sm text-yellow-600">
//               This usually takes 24-48 hours. You'll receive an email once verified.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <div className="text-center">
//           <h1 className="text-3xl font-bold mb-2">Upgrade Your Plan</h1>
//           <p className="text-gray-600 mb-4">
//             Scale your hiring with advanced features and increased job posting limits
//           </p>
          
//           {currentSubscription && (
//             <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
//               <span className="font-medium">Current Plan:</span>
//               <Badge variant="secondary">{currentSubscription.plan.name}</Badge>
//               <span>₹{currentSubscription.plan.price}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Plans Grid */}
//       {plans.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {plans.map((plan) => (
//             <div key={plan.id} className="relative">
//               {subscribing === plan.id && (
//                 <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                     <span>Subscribing...</span>
//                   </div>
//                 </div>
//               )}
//               <PlanCard
//                 plan={plan}
//                 isCurrentPlan={isCurrentPlan(plan)}
//                 onSelectPlan={handleSelectPlan}
//                 disabled={isPlanDisabled(plan)}
//               />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <Card className="max-w-md mx-auto">
//           <CardHeader>
//             <CardTitle>No Plans Available</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-600 mb-4">
//               No upgrade plans are currently available for employers.
//             </p>
//             <Button asChild className="w-full">
//               <a href="/employer/dashboard">
//                 Back to Dashboard
//               </a>
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       {/* Benefits Section */}
//       <div className="mt-8">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-center">Why Upgrade?</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-lg">Enhanced Hiring</h3>
//                 <ul className="space-y-2 text-sm">
//                   <li>• Post unlimited job openings</li>
//                   <li>• Feature your jobs for better visibility</li>
//                   <li>• Priority company profile placement</li>
//                   <li>• Advanced candidate filtering</li>
//                 </ul>
//               </div>
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-lg">Business Growth</h3>
//                 <ul className="space-y-2 text-sm">
//                   <li>• Attract top talent faster</li>
//                   <li>• Detailed hiring analytics</li>
//                   <li>• Dedicated account manager</li>
//                   <li>• Custom branding options</li>
//                 </ul>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

export default EmployerUpgradePlansPage;