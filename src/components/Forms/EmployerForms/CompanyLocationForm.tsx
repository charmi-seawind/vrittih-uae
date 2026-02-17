"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Construction",
  "Transportation",
  "Hospitality",
  "Real Estate",
  "Media & Entertainment",
  "Agriculture",
  "Energy",
  "Consulting",
  "Other"
];

const indianStates = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Anantapur", "Vizianagaram"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Navsari"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Bareilly", "Aligarh", "Moradabad"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Kharagpur", "Haldia", "Krishnanagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Malappuram", "Kannur", "Kasaragod"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Batala", "Pathankot", "Moga"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Diphu"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi", "Nahan", "Paonta Sahib", "Sundarnagar", "Chamba"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Kotdwar", "Ramnagar", "Manglaur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Korba", "Bilaspur", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Cuncolim", "Quepem"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar", "Belonia", "Khowai", "Pratapgarh", "Ranirbazar", "Sonamura", "Amarpur"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Senapati", "Tamenglong", "Chandel", "Jiribam", "Kakching"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara", "Williamnagar", "Nongstoin", "Mawkyrwat", "Resubelpara", "Ampati"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Kiphire", "Longleng", "Peren"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Mamit", "Lawngtlai", "Saitual", "Khawzawl"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tezpur", "Bomdila", "Tawang", "Ziro", "Along", "Basar", "Khonsa"],
  "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan", "Jorethang", "Nayabazar", "Rangpo", "Singtam", "Pakyong", "Ravangla"],
  "Delhi": ["New Delhi", "Delhi", "Dwarka", "Rohini", "Janakpuri", "Lajpat Nagar", "Karol Bagh", "Connaught Place", "Saket", "Vasant Kunj"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
};

interface EmployerData {
  fullName: string;
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
  is_consultancy: boolean;
  job_title: string;
  job_category: string;
  job_type: string;
  work_location_type: string;
  office_address: string;
  pay_type: string;
  pay_amount: string;
  additional_perks: string;
  joining_fee_required: boolean;
  job_description: string;
  is_walk_in: boolean;
  application_email: string;
  // Profile completion fields
  founded_year: number;
  website_url: string;
  about_company: string;
  zip_code: string;
  gst_number?: string;
  minimum_education: string;
  language_required: string;
  experience_required: string;
  additional_requirements: string;
}

interface CompanyLocationFormProps {
  employerData: EmployerData;
  setEmployerData: (data: EmployerData) => void;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

const CompanyLocationForm = ({ employerData, setEmployerData, errors = {}, onClearError }: CompanyLocationFormProps) => {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showGstField, setShowGstField] = useState(!!employerData.gst_number);

  const handleInputChange = (field: keyof EmployerData, value: string) => {
    const sanitizedValue = value.replace(/<script[^>]*>.*?<\/script>/gi, '')
                               .replace(/javascript:/gi, '')
                               .replace(/on\w+=/gi, '');
    setEmployerData({
      ...employerData,
      [field]: sanitizedValue,
    });
    if (onClearError && errors[field as string]) {
      onClearError(field as string);
    }
  };

  const handleGeoLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            );
            
            if (!response.ok) {
              throw new Error('Failed to fetch location data');
            }
            
            const data = await response.json();
            
            // Extract location details
            const detectedState = data.address?.state || "";
            const detectedCity = data.address?.city || data.address?.town || data.address?.village || "";
            const detectedZip = data.address?.postcode || "";
            const detectedAddress = [
              data.address?.road,
              data.address?.suburb || data.address?.neighbourhood
            ].filter(Boolean).join(", ");
            
            setEmployerData({
              ...employerData,
              state: detectedState,
              city: detectedCity,
              zip_code: detectedZip,
              address: detectedAddress || employerData.address
            });
            

          } catch (error) {
            console.error("Error fetching location:", error);
            // Don't show alert, just log the error
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          setIsDetectingLocation(false);
          console.error('Geolocation error:', error);
          // Don't show alert for geolocation errors
        }
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* ✅ Additional Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
              <Select value={employerData.industry || ""} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-sm text-red-500">{errors.industry}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="founded_year">Founded Year <span className="text-red-500">*</span></Label>
              <Input
                id="founded_year"
                type="number"
                value={employerData.founded_year || ""}
                onChange={(e) => handleInputChange("founded_year", e.target.value)}
                placeholder="2020"
                className={errors.founded_year ? "border-red-500" : ""}
                required
              />
              {errors.founded_year && <p className="text-sm text-red-500">{errors.founded_year}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL <span className="text-red-500">*</span></Label>
              <Input
                id="website_url"
                value={employerData.website_url}
                onChange={(e) => handleInputChange("website_url", e.target.value)}
                placeholder="https://company.com"
                className={errors.website_url ? "border-red-500" : ""}
                required
              />
              {errors.website_url && <p className="text-sm text-red-500">{errors.website_url}</p>}
            </div>

            {/* ✅ Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                id="phone"
                value={employerData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="about_company">About Company <span className="text-red-500">*</span></Label>
              <Input
                id="about_company"
                value={employerData.about_company}
                onChange={(e) => handleInputChange("about_company", e.target.value)}
                placeholder="Tech company"
                className={errors.about_company ? "border-red-500" : ""}
                required
              />
              {errors.about_company && <p className="text-sm text-red-500">{errors.about_company}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Input
                id="address"
                value={employerData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main St"
                className={errors.address ? "border-red-500" : ""}
                required
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>
          </div>

          {/* GST Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="want_gst"
                checked={showGstField}
                onCheckedChange={(checked) => {
                  setShowGstField(!!checked);
                  if (!checked) {
                    handleInputChange("gst_number", "");
                  }
                }}
              />
              <Label htmlFor="want_gst" className="text-sm font-medium">
                Want to enter GST Number?
              </Label>
            </div>
            
            {showGstField && (
              <div className="space-y-2">
                <Label htmlFor="gst_number">GST Number</Label>
                <Input
                  id="gst_number"
                  value={employerData.gst_number || ""}
                  onChange={(e) => handleInputChange("gst_number", e.target.value)}
                  placeholder="Enter GST Number (e.g., 22AAAAA0000A1Z5)"
                  maxLength={15}
                  className={errors.gst_number ? "border-red-500" : ""}
                />
                {errors.gst_number && <p className="text-sm text-red-500">{errors.gst_number}</p>}
                <p className="text-xs text-muted-foreground">
                  GST number should be 15 characters long
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Location <span className="text-red-500">*</span></Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGeoLocation}
                disabled={isDetectingLocation}
              >
                {isDetectingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                Auto Detect
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Click "Auto Detect" to fill location automatically or enter manually below
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
              <Input
                id="state"
                value={employerData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Enter state"
                className={errors.state ? "border-red-500" : ""}
                required
              />
              {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
              <Input
                id="city"
                value={employerData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
                className={errors.city ? "border-red-500" : ""}
                required
              />
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">Zip Code <span className="text-red-500">*</span></Label>
              <Input
                id="zip_code"
                value={employerData.zip_code}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
                placeholder="400001"
                className={errors.zip_code ? "border-red-500" : ""}
                required
              />
              {errors.zip_code && <p className="text-sm text-red-500">{errors.zip_code}</p>}
            </div>
          </div>


        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLocationForm;
