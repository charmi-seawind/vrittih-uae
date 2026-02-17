import { Star, Download } from 'lucide-react';

export default function AppDownloadSection() {
  return (
    <div className="w-full flex justify-center items-center py-10 bg-white">
      {/* Main Card Container */}
      <div className="w-full max-w-[1500px] bg-[#fcf5ff] rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden shadow-sm">
        {/* --- LEFT SIDE: Text & QR --- */}
        <div className="z-10 flex-1 w-full lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-[#48167c] mb-4 tracking-tight">
            Download Apna app!
          </h1>
          <p className="text-gray-800 text-lg font-medium mb-10 leading-relaxed">
            Unlimited job applications{" "}
            <span className="mx-1 text-gray-400">|</span>
            HRs contact you directly{" "}
            <span className="mx-1 text-gray-400">|</span>
            Track your Applications
          </p>

          {/* White Card for QR & Store Buttons */}
          <div className="bg-white p-6 rounded-2xl shadow-sm inline-flex flex-col sm:flex-row gap-6 items-center border border-gray-100">
            <div className="flex flex-col gap-3">
              <p className="text-md font-semibold text-gray-900">
                Scan QR to download Apna app
              </p>
              <div className="flex gap-3 items-center">
                {/* App Store Button */}
                <div className="w-1/3">
                  <img src="/images/app.webp" alt="App Store" className="w-full h-full object-contain" />
                </div>
                {/* Play Store Button */}
                <div className="w-1/3">
                  <img src="/images/gpay.png" alt="Google Play Store" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* QR Code Image */}
            <div className="border-l border-gray-200 pl-0 sm:pl-6">
              <div className="relative w-24 h-24">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ApnaApp"
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Phone Mockup & Stats --- */}
        <div className="flex-1 w-1/2 relative flex justify-center items-center">
          {/* Phone Container with Tilt */}
          <img 
            src="https://png.pngtree.com/png-clipart/20250107/original/pngtree-smartphone-illustration-with-floating-app-icons-png-image_19080372.png" 
            alt="Phone mockup with app icons" 
          />

          {/* Floating Stat Card 1: Ratings */}
          <div className="absolute top-1/4 right-0 md:-right-4 lg:right-0 bg-purple-50/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm animate-bounce-slow">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <span className="text-3xl font-bold text-[#48167c]">4.7</span>
              </div>
              <span className="text-sm text-[#48167c] font-semibold">
                7L reviews
              </span>
            </div>
          </div>

          {/* Floating Stat Card 2: Downloads */}
          <div className="absolute bottom-1/4 right-0 md:-right-4 lg:right-0 bg-purple-50/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm mt-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-[#8b5cf6] p-1.5 rounded-full text-white">
                  <Download size={16} strokeWidth={3} />
                </div>
                <span className="text-3xl font-bold text-[#48167c]">
                  5 cr+
                </span>
              </div>
              <span className="text-sm text-[#48167c] font-semibold">
                App downloads
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}