
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import PromoSection from "@/components/home/PromoSection";
import CategorySection from "@/components/home/CategorySection";
import ProductCarousel from "@/components/ui/carousel/ProductCarousel";
import ProductCard from "@/components/product/ProductCard";

// Mock data
const trendingProducts = [
  {
    id: "1",
    name: "Ultra Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=2070&auto=format&fit=crop",
    description: "Premium sound quality with active noise cancellation and touch controls.",
    price: 149.99,
    rating: 4.8,
    category: "Audio"
  },
  {
    id: "2",
    name: "Pro Max Smartphone",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1480&auto=format&fit=crop",
    description: "Flagship smartphone with outstanding camera and all-day battery life.",
    price: 999.99,
    rating: 4.9,
    category: "Smartphones"
  },
  {
    id: "3",
    name: "SmartWatch Series 5",
    image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=1480&auto=format&fit=crop",
    description: "Track fitness, receive notifications, and more on your wrist.",
    price: 299.99,
    rating: 4.7,
    category: "Wearables"
  },
  {
    id: "4",
    name: "Ultra Slim Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    description: "Powerful performance in a sleek, lightweight design.",
    price: 1299.99,
    rating: 4.6,
    category: "Laptops"
  },
  {
    id: "5",
    name: "Wireless Gaming Mouse",
    image: "https://images.unsplash.com/photo-1608344858807-d18e0a71afe6?q=80&w=1175&auto=format&fit=crop",
    description: "Ultra-precise tracking with customizable RGB lighting.",
    price: 79.99,
    rating: 4.5,
    category: "Accessories"
  }
];

const newArrivals = [
  {
    id: "6",
    name: "Smart Home Speaker",
    image: "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?q=80&w=2070&auto=format&fit=crop",
    description: "Voice-controlled smart speaker with premium sound quality.",
    price: 129.99,
    rating: 4.4,
    category: "Smart Home"
  },
  {
    id: "7",
    name: "4K Streaming Media Player",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1474&auto=format&fit=crop",
    description: "Stream your favorite content in stunning 4K resolution.",
    price: 99.99,
    rating: 4.3,
    category: "Entertainment"
  },
  {
    id: "8",
    name: "Noise-Canceling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    description: "Premium over-ear headphones with industry-leading noise cancellation.",
    price: 349.99,
    rating: 4.9,
    category: "Audio"
  },
  {
    id: "9",
    name: "Portable Power Bank",
    image: "https://images.unsplash.com/photo-1609692814857-d439226d10a2?q=80&w=1974&auto=format&fit=crop",
    description: "Fast-charging power bank with high capacity for all your devices.",
    price: 49.99,
    rating: 4.7,
    category: "Accessories"
  }
];

const categories = [
  {
    id: "smartphones",
    name: "Smartphones",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1527&auto=format&fit=crop",
    productCount: 42
  },
  {
    id: "laptops",
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    productCount: 27
  },
  {
    id: "audio",
    name: "Audio",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070&auto=format&fit=crop",
    productCount: 35
  },
  {
    id: "wearables",
    name: "Wearables",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1472&auto=format&fit=crop",
    productCount: 18
  },
  {
    id: "cameras",
    name: "Cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop",
    productCount: 24
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?q=80&w=2070&auto=format&fit=crop",
    productCount: 65
  }
];

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductCarousel title="Trending Products">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </ProductCarousel>
        </div>
      </section>
      
      <PromoSection />
      
      <CategorySection categories={categories} />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductCarousel title="New Arrivals">
            {newArrivals.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </ProductCarousel>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-brand-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6">Subscribe to our newsletter for exclusive deals, new product announcements, and tech tips.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-full text-gray-900"
              />
              <button className="bg-white text-brand-purple px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
