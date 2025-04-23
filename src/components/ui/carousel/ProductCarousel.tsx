
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCarouselProps {
  title: string;
  children: React.ReactNode[];
  itemsToShow?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  title, 
  children,
  itemsToShow = 4 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(itemsToShow);
  const maxIndex = Math.max(0, children.length - visibleItems);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 768) {
        setVisibleItems(2);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(itemsToShow);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsToShow]);

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
    }
  };

  // Handle smooth scrolling
  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.scrollWidth / children.length * currentIndex;
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, children.length]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('prev')}
            disabled={currentIndex === 0}
            className="rounded-full w-8 h-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('next')}
            disabled={currentIndex >= maxIndex}
            className="rounded-full w-8 h-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          ref={containerRef}
          className="flex space-x-4 transition-all duration-300 overflow-x-auto scrollbar-none"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {children.map((child, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4"
              style={{ scrollSnapAlign: 'start' }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
