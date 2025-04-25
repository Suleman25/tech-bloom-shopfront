
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { queryTable, safelyAssertType } from '@/utils/supabaseHelpers';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      email: user?.email || '',
      country: 'United States'
    }
  });
  
  // Fetch product details for each item in the cart
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['checkout-products', items],
    queryFn: async () => {
      if (!items.length) return [];
      
      const productIds = items.map(item => item.product_id);
      
      const { data, error } = await queryTable('products')
        .select('*')
        .in('id', productIds);
        
      if (error) throw error;
      return safelyAssertType<Product[]>(data);
    },
    enabled: items.length > 0
  });
  
  const isLoading = cartLoading || productsLoading;
  
  // Calculate totals
  const calculateTotals = () => {
    if (!products || !items.length) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };
  
  const { subtotal, tax, total } = calculateTotals();
  
  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      toast.error('You must be logged in to checkout');
      navigate('/auth');
      return;
    }
    
    if (!items.length) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order
      const { data: order, error: orderError } = await queryTable('orders')
        .insert([{
          user_id: user.id,
          status: 'pending',
          total_amount: total,
          shipping_address: JSON.stringify({
            fullName: data.fullName,
            address: data.address,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
            phone: data.phone
          })
        }])
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = items.map(item => {
        const product = products?.find(p => p.id === item.product_id);
        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product?.price || 0
        };
      });
      
      const { error: itemsError } = await queryTable('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Clear cart (delete all items)
      for (const item of items) {
        await queryTable('cart_items').delete().eq('id', item.id);
      }
      
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      </Layout>
    );
  }
  
  if (!items.length) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-8">Add some products to your cart before checking out.</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      {...register('fullName', { required: 'Full name is required' })}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    {...register('address', { required: 'Address is required' })}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      {...register('city', { required: 'City is required' })}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state"
                      {...register('state', { required: 'State is required' })}
                    />
                    {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode"
                      {...register('postalCode', { required: 'Postal code is required' })}
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country"
                      {...register('country', { required: 'Country is required' })}
                    />
                    {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      {...register('phone', { required: 'Phone is required' })}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                  </div>
                </div>
                
                <div className="pt-4">
                  <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p>For this MVP, we're using "Pay on Delivery". No payment information required.</p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4">
                {items.map(item => {
                  const product = products?.find(p => p.id === item.product_id);
                  return (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                        {product?.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-xs text-gray-500">No image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-medium">
                        ${((product?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
