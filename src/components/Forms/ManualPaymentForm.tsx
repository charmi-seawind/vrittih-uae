"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ManualPaymentFormProps {
  selectedPlan: string;
  pendingUserId: string;
  onSuccess: () => void;
  onSubmit: () => Promise<void>;
  isUploading: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
}

const BANK_DETAILS = {
  accountName: "Iceberg Business solutions Private Limited",
  accountNumber: "935150200097369351",
  ifscCode: "HDFC0009173",
  upiId: "vrrittih@paytm",
  qrCode: "/images/payment-qr.png" // Add QR code image to public folder
};

const ManualPaymentForm = ({ selectedPlan, pendingUserId, onSuccess, onSubmit, isUploading }: ManualPaymentFormProps) => {
  const [copiedField, setCopiedField] = useState<string>("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/plans/${selectedPlan}`);
        const data = await response.json();
        setPlan(data.plan);
      } catch (error) {
        toast.error('Failed to load plan details');
      } finally {
        setLoading(false);
      }
    };
    if (selectedPlan) fetchPlan();
  }, [selectedPlan]);



  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(""), 2000);
  };



  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold text-lg">Bank Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="font-medium">{BANK_DETAILS.accountName}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(BANK_DETAILS.accountName, "name")}
              >
                {copiedField === "name" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-medium">{BANK_DETAILS.accountNumber}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, "account")}
              >
                {copiedField === "account" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="font-medium">{BANK_DETAILS.ifscCode}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(BANK_DETAILS.ifscCode, "ifsc")}
              >
                {copiedField === "ifsc" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-600">UPI ID</p>
                <p className="font-medium">{BANK_DETAILS.upiId}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(BANK_DETAILS.upiId, "upi")}
              >
                {copiedField === "upi" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="p-3 bg-blue-50 rounded text-center">
              <p className="text-sm text-blue-800 font-medium">
                Amount to Pay: ₹{plan?.price || 0}
              </p>
            </div>

            <div className="flex justify-center p-4 bg-white rounded border">
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Scan QR Code to Pay</p>
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                  {BANK_DETAILS.qrCode ? (
                    <Image
                      src={BANK_DETAILS.qrCode}
                      alt="Payment QR Code"
                      width={192}
                      height={192}
                      className="rounded"
                    />
                  ) : (
                    <p className="text-gray-400 text-sm">QR Code</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold text-lg">Upload Payment Proof</h3>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">After making the payment, click &quot;Verify Payment&quot; button below to upload proof and complete registration.</p>


          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualPaymentForm;
