import React from 'react';
import { 
  Code, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Wrench, 
  Users,
  Building2,
  Palette
} from 'lucide-react';

const jobCategories = [
  {
    id: 1,
    title: "IT / Software",
    description: "Web development, mobile apps, AI/ML, cybersecurity",
    icon: Code,
    jobCount: "2,500+",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 hover:bg-blue-100"
  },
  {
    id: 2,
    title: "Sales & Marketing",
    description: "Digital marketing, sales executive, business development",
    icon: TrendingUp,
    jobCount: "1,800+",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 hover:bg-green-100"
  },
  {
    id: 3,
    title: "Accounting",
    description: "Finance, taxation, auditing, bookkeeping",
    icon: Calculator,
    jobCount: "950+",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50 hover:bg-purple-100"
  },
  {
    id: 4,
    title: "Admin / Back Office",
    description: "Data entry, office management, documentation",
    icon: FileText,
    jobCount: "1,200+",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 hover:bg-orange-100"
  },
  {
    id: 5,
    title: "Technician",
    description: "Maintenance, repair, technical support",
    icon: Wrench,
    jobCount: "750+",
    color: "from-gray-600 to-gray-800",
    bgColor: "bg-gray-50 hover:bg-gray-100"
  },
  {
    id: 6,
    title: "HR / Recruiter",
    description: "Talent acquisition, employee relations, training",
    icon: Users,
    jobCount: "650+",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 hover:bg-pink-100"
  },
  {
    id: 7,
    title: "Construction",
    description: "Civil engineering, architecture, project management",
    icon: Building2,
    jobCount: "850+",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-50 hover:bg-yellow-100"
  },
  {
    id: 8,
    title: "Design / Creative",
    description: "UI/UX design, graphic design, content creation",
    icon: Palette,
    jobCount: "450+",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 hover:bg-indigo-100"
  }
];

const PopularJobCategories = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Job Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore thousands of opportunities across various industries and find your perfect career match
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`group relative p-6 rounded-2xl border border-gray-200 ${category.bgColor} transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer`}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
                    {category.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* Job Count */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                      {category.jobCount} jobs
                    </span>
                    <div className="w-6 h-6 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-colors duration-300">
                      <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            View All Categories
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularJobCategories;