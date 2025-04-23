
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-brand-soft-purple via-white to-brand-soft-blue">
      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-purple/5 rounded-full"></div>
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-brand-blue/5 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Next-Gen Tech</span> for Your Modern Lifestyle
            </h1>
            <p className="text-lg text-gray-600 md:pr-12">
              Discover cutting-edge devices that seamlessly integrate into your daily life. 
              Premium products, endless possibilities.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button size="lg" className="bg-brand-purple hover:bg-brand-purple-dark text-white rounded-full btn-hover">
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-brand-purple text-brand-purple hover:bg-brand-soft-purple btn-hover">
                Explore Featured
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="pt-4 md:pt-8">
              <p className="text-sm text-gray-500 mb-3">Trusted by tech enthusiasts worldwide</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center text-gray-400">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">TechCorp</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.6 13.47A4.99 4.99 0 0 1 19 8.5a4.99 4.99 0 0 1-5.4 4.97zM12 14.96a8.995 8.995 0 0 1 7-14.96 9 9 0 0 1 0 18 8.995 8.995 0 0 1-7-3.04zM5 12c0-1.66.67-3.16 1.76-4.24L5.47 6.47A8.97 8.97 0 0 0 3 12c0 2.48 1 4.73 2.63 6.37l1.29-1.29A6.98 6.98 0 0 1 5 12zm10-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">GlobalTech</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">TechReview</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-magenta/10 blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1588058365815-c4e182a88410?q=80&w=2070&auto=format&fit=crop"
              alt="Premium tech gadgets" 
              className="relative z-10 w-full h-auto rounded-3xl object-cover shadow-lg"
            />
            
            {/* Floating badges */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-brand-purple">
              NEW ARRIVAL
            </div>
            <div className="absolute bottom-4 right-4 bg-brand-purple/90 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium flex items-center shadow-lg">
              <span className="mr-2">Starting at</span>
              <span className="text-lg font-bold">$299</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
