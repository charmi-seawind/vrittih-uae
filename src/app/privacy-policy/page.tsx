"use client";

import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl font-bold text-white mb-4 sm:mb-6">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 sm:py-16 bg-gray-50 w-full">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg border-0 w-full">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <div className="prose prose-gray max-w-none">
                
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl mt-0 font-bold text-gray-900 ">
                    Collection of your Personal Information
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                    We collect personal information, such as your e-mail id, name, home or work address or contact number, professional experience and other such user data associated with a resume/biodata/C.V. for job applications.
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Please keep in mind that, when you apply for jobs advertised on Vrrittih.com, your resume data is stored in your account and any other information that you disclosed during your job application will be made available to the companies you applied to. It is our policy to discuss specific vacancies with candidates prior to submitting their job application to the client, but this may not always be possible.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Use of your Personal Information
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                    We collect and use your personal information to operate Vrrittih.com and deliver the services you have requested. We also use your personal information to inform you of other products or services available from Vrrittih.com and its affiliates. We may also contact you via surveys to conduct research about your opinion of current services or of potential new services that may be offered.
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                    Vrrittih can sell registered member lists to third parties. We may, from time to time, contact you on behalf of external business partners about a particular offering that may be of interest to you. In those cases, your personal information (e-mail, name, address, telephone number) is not transferred to the third party.
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                    Vrrittih – Job Placement Consultancy may access and/or disclose your personal information if required to do so by law or in the good faith belief that such action is necessary to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-sm sm:text-base text-gray-600 leading-relaxed space-y-2">
                    <li>Conform to the edicts of the law or comply with legal process served on Vrrittih – Job Placement Consultancy or the site.</li>
                    <li>Protect and defend the rights or property of Vrrittih – Job Placement Consultancy and its family of websites.</li>
                    <li>Act under exigent circumstances to protect the personal safety of users of Vrrittih – Job Placement Consultancy, its websites, or the public.</li>
                  </ul>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Personal information collected on this site may be stored and processed in any country in which Vrrittih – Job Placement Consultancy or its affiliates, subsidiaries or agents maintain facilities, and by using this site, you consent to any such transfer of information outside of your country.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Security of your Personal Information
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We are committed to protecting the security of your personal information. We use a variety of security technologies and procedures to help protect your personal information from unauthorized access, use, or disclosure.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Changes to This Privacy Policy
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Vrrittih.com will occasionally update this Privacy Policy to reflect company and user feedback. When we post changes to this Privacy Policy, you will see the word "updated" next to the Privacy Policy link on the front page of Vrrittih.com. If there are material changes to this Privacy Policy or in how we are using your personal information, Vrrittih.com will prominently post such changes prior to implementing the change. We encourage you to periodically review this Privacy Policy to be informed of how Vrrittih.com is protecting your information on the internet.
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;