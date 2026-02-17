"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface EmployerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  description: string;
  foundedYear: string;
}

interface CompanyDescriptionFormProps {
  employerData: EmployerData;
  setEmployerData: (data: EmployerData) => void;
}

const CompanyDescriptionForm = ({ employerData, setEmployerData }: CompanyDescriptionFormProps) => {
  const handleInputChange = (field: keyof EmployerData, value: string) => {
    setEmployerData({
      ...employerData,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={employerData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Tell us about your company, its mission, values, and what makes it unique. This will help job seekers understand your company culture and decide if they want to work with you."
              rows={8}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              {employerData.description.length}/500 characters
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Tips for a great company description:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Describe what your company does and its mission</li>
              <li>• Highlight your company culture and values</li>
              <li>• Mention any unique benefits or perks</li>
              <li>• Keep it engaging and authentic</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDescriptionForm;