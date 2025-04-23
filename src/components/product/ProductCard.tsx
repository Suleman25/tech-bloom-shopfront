
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  description,
  price,
  rating,
  category,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };
  
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success(`${name} added to cart!`);
  };

  // Format price with two decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  return (
    <Link to={`/product/${id}`}>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col card-hover">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-4"
          />
          <button 
            onClick={toggleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart 
              className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
            />
          </button>
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-xs font-medium text-brand-purple uppercase tracking-wider mb-1">
            {category}
          </span>
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
            </div>
          </div>
          
          <div className="mt-auto pt-3 flex items-center justify-between">
            <span className="font-bold text-gray-900">{formattedPrice}</span>
            <Button 
              size="sm" 
              onClick={addToCart} 
              className="rounded-full bg-brand-purple hover:bg-brand-purple-dark btn-hover"
            >
              <ShoppingCart className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
