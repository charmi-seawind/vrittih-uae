'use client';

import { Suspense } from 'react';
import CVPaymentForm from '@/components/Forms/CVPaymentForm';

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your CV Package</h1>
            <p className="text-gray-600 mt-2">
              Select a package to make your CV visible to employers
            </p>
          </div>
          
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <CVPaymentForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}