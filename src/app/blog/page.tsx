"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "Why Our SEO Training in Dubai Stands Out in 2025",
    excerpt: "The SEO training in Dubai we offer transforms beginners into industry-ready experts in just 45 days. In the increasingly competitive field of SEO and SEM, quality education with practical experience has become essential for career success.",
    image: "/images/banner-1.avif",
    category: "Blog",
    readTime: "5 min read",
    publishedAt: "October 6, 2025",
    author: "Vrrittih Team"
  },
  {
    id: 2,
    title: "How to Write a Resume That Gets You Hired",
    excerpt: "Learn the secrets of crafting a compelling resume that stands out from the competition.",
    image: "/images/about-img.avif",
    category: "Resume Tips",
    readTime: "7 min read",
    publishedAt: "January 12, 2024",
    author: "HR Expert"
  },
  {
    id: 3,
    title: "Mastering the Art of Job Interviews",
    excerpt: "Proven strategies to ace your next job interview and land your dream position.",
    image: "/images/service-1.jpg",
    category: "Interview Tips",
    readTime: "6 min read",
    publishedAt: "January 10, 2024",
    author: "Career Coach"
  },
  {
    id: 4,
    title: "Remote Work: Best Practices for Success",
    excerpt: "Essential tips for thriving in a remote work environment and maintaining productivity.",
    image: "/images/service-2.jpg",
    category: "Remote Work",
    readTime: "4 min read",
    publishedAt: "January 8, 2024",
    author: "Remote Work Specialist"
  },
  {
    id: 5,
    title: "Salary Negotiation: Get What You're Worth",
    excerpt: "Learn effective strategies to negotiate your salary and secure better compensation packages.",
    image: "/images/service-3.jpg",
    category: "Salary Tips",
    readTime: "8 min read",
    publishedAt: "January 5, 2024",
    author: "Compensation Expert"
  },
  {
    id: 6,
    title: "Building Your Professional Network",
    excerpt: "Discover how to build meaningful professional relationships that advance your career.",
    image: "/images/service-4.jpg",
    category: "Networking",
    readTime: "5 min read",
    publishedAt: "January 3, 2024",
    author: "Networking Guru"
  }
];

const categories = ["All Posts", "Blog", "Resume Tips", "Interview Tips", "Remote Work", "Salary Tips", "Networking"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [visiblePosts, setVisiblePosts] = useState(6);

  const filteredPosts = selectedCategory === "All Posts" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const displayedPosts = filteredPosts.slice(0, visiblePosts);

  const loadMore = () => {
    setVisiblePosts(prev => prev + 3);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#19489e] to-[#163a7a] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Blog
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Stay updated with the latest career insights, job market trends, and professional development tips
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#19489e]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Blog</span>
          </nav>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main Blog Content */}
            <div className="xl:w-2/3">
              {/* Blog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {blogPosts.slice(0, visiblePosts).map((post) => (
                  <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/blog/${post.id}`}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>{post.publishedAt}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                      </div>
                      
                      <Link href={`/blog/${post.id}`}>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 hover:text-[#19489e] transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      
                      <Link 
                        href={`/blog/${post.id}`}
                        className="text-[#19489e] text-sm font-medium hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              {visiblePosts < blogPosts.length && (
                <div className="text-center">
                  <Button 
                    onClick={loadMore} 
                    variant="outline"
                    className="px-6 sm:px-8 py-2"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar - Recent Blogs */}
            <div className="xl:w-1/3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 sticky top-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Posts</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                      <Link href={`/blog/${post.id}`}>
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/blog/${post.id}`}>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-900 hover:text-[#19489e] line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-gray-500">{post.publishedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}