
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoSection = () => {
  return (
    <div className="py-12 md:py-20 bg-gradient-to-br from-brand-soft-purple to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 max-w-lg">
            <span className="inline-block text-sm font-semibold bg-brand-soft-purple text-brand-purple px-4 py-1 rounded-full">
              LIMITED TIME OFFER
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Summer Sale: Get Up to <span className="text-brand-magenta">40% OFF</span>
            </h2>
            <p className="text-lg text-gray-600">
              Upgrade your tech with our biggest sale of the season. Get premium devices at unbeatable prices, only until supplies last.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-brand-magenta hover:bg-brand-magenta/90 text-white rounded-full btn-hover">
                Shop the Sale
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-brand-magenta text-brand-magenta rounded-full hover:bg-brand-soft-pink btn-hover">
                View All Deals
              </Button>
            </div>
            
            {/* Countdown Timer */}
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-3">Hurry! Sale Ends In:</p>
              <div className="flex space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-800">
                    3
                  </div>
                  <span className="text-xs mt-1 text-gray-500">Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-800">
                    8
                  </div>
                  <span className="text-xs mt-1 text-gray-500">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-800">
                    42
                  </div>
                  <span className="text-xs mt-1 text-gray-500">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-800">
                    17
                  </div>
                  <span className="text-xs mt-1 text-gray-500">Seconds</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top Left Image */}
            <div className="aspect-square rounded-2xl overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop"
                alt="Smart watch" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <span className="text-white text-sm font-medium">Smart Watches</span>
                <span className="text-brand-magenta font-bold">Up to 30% OFF</span>
              </div>
            </div>
            
            {/* Top Right Image */}
            <div className="aspect-square rounded-2xl overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"
                alt="Wireless headphones" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <span className="text-white text-sm font-medium">Headphones</span>
                <span className="text-brand-magenta font-bold">Up to 40% OFF</span>
              </div>
            </div>
            
            {/* Bottom Image (Spans Full Width) */}
            <div className="col-span-2 aspect-video rounded-2xl overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1577375729078-820d5283031c?q=80&w=2080&auto=format&fit=crop"
                alt="Smartphone" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <span className="text-white text-sm font-medium">Latest Smartphones</span>
                <span className="text-brand-magenta font-bold text-xl">Up to 25% OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSection;
