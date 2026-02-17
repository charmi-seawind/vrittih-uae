"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeatures {
  // Job Seeker features
  cv_uploads?: number;
  job_applications?: number;
  job_withdrawals?: number;
  featured_jobs_access?: boolean;
  // Employer features
  job_posts?: number;
  featured_jobs?: number;
  featured_company?: boolean;
}

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  user_type: 'employer' | 'job_seeker';
  features: PlanFeatures;
  is_active: boolean;
}

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelectPlan: (planId: string) => void;
  disabled?: boolean;
}

const PlanCard = ({ plan, isCurrentPlan = false, onSelectPlan, disabled = false }: PlanCardProps) => {
  const isBasicPlan = plan.name.toLowerCase().includes('basic') || plan.price === 0;
  const isPremiumPlan = plan.name.toLowerCase().includes('premium') || plan.name.toLowerCase().includes('pro');

  const formatFeatureValue = (value: number) => {
    return value === -1 ? 'Unlimited' : value.toString();
  };

  const renderJobSeekerFeatures = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-500" />
        <span className="text-sm">CV Uploads: {formatFeatureValue(plan.features.cv_uploads || 1)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-500" />
        <span className="text-sm">Job Applications: {formatFeatureValue(plan.features.job_applications || 3)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-500" />
        <span className="text-sm">Job Withdrawals: {formatFeatureValue(plan.features.job_withdrawals || 0)}</span>
      </div>
      {plan.features.featured_jobs_access && (
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm">Featured Jobs Access</span>
        </div>
      )}
    </div>
  );

  const renderEmployerFeatures = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-500" />
        <span className="text-sm">Job Posts: {formatFeatureValue(plan.features.job_posts || 5)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-500" />
        <span className="text-sm">Featured Jobs: {formatFeatureValue(plan.features.featured_jobs || 0)}</span>
      </div>
      {plan.features.featured_company && (
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-purple-500" />
          <span className="text-sm">Featured Company Profile</span>
        </div>
      )}
    </div>
  );

  return (
    <Card className={cn(
      "relative transition-all duration-200 hover:shadow-lg",
      isCurrentPlan && "ring-2 ring-primary border-primary",
      isPremiumPlan && "border-gradient-to-r from-purple-500 to-pink-500",
      disabled && "opacity-50"
    )}>
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Current Plan</Badge>
        </div>
      )}
      
      {isPremiumPlan && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        {plan.description && (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        )}
        <div className="mt-4">
          <div className="text-3xl font-bold">
            ₹{plan.price}
            <span className="text-sm font-normal text-muted-foreground">
              /{plan.duration} days
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3">Features:</h4>
          {plan.user_type === 'job_seeker' ? renderJobSeekerFeatures() : renderEmployerFeatures()}
        </div>

        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={disabled || isCurrentPlan}
          onClick={() => onSelectPlan(plan.id)}
        >
          {isCurrentPlan ? "Current Plan" : disabled ? "Downgrade Not Allowed" : "Select Plan"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;