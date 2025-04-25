
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter, { FilterOptions } from '@/components/product/ProductFilter';
import { Loader2 } from 'lucide-react';

const Products = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 2000],
    rating: null
  });
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      // Apply category filter
      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }
      
      // Apply price range filter
      query = query
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
            <ProductFilter onFilterChange={handleFilterChange} />
          </aside>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6">
              {filters.categories.length ? 
                `${filters.categories.join(', ')} Products` : 
                'All Products'}
            </h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
              </div>
            ) : products?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description || ''}
                    price={product.price}
                    image={product.image_url || ''}
                    category={product.category || ''}
                    rating={4.5} // Default rating
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
