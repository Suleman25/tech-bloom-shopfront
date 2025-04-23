
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our wide range of products across various categories to find exactly what you need.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              to={`/category/${category.id}`} 
              key={category.id}
              className="group"
            >
              <div className="flex flex-col items-center text-center card-hover">
                <div className="w-full aspect-square bg-brand-soft-purple rounded-2xl overflow-hidden flex items-center justify-center mb-4 group-hover:bg-brand-soft-pink transition-colors duration-300">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-3/5 h-3/5 object-contain"
                  />
                </div>
                <h3 className="font-medium text-gray-800 mb-1">{category.name}</h3>
                <span className="text-sm text-gray-500">{category.productCount} Products</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
