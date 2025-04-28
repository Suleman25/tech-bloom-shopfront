import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryTable, assertType } from '@/utils/supabaseHelpers';
import Layout from '@/components/layout/Layout';
import { Order } from '@/types/order';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderItemWithProduct {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  created_at: string | null;
  updated_at: string | null;
  products: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string | null;
    stock: number;
    image_url: string | null;
    created_at: string | null;
    updated_at: string | null;
  } | null;
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, isAdmin } = useAuth();

  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      
      const { data, error } = await queryTable<Order>('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return assertType<Order>(data);
    },
    enabled: !!orderId,
  });

  const { data: orderItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['orderItems', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      
      const { data, error } = await queryTable<OrderItemWithProduct[]>('order_items')
        .select(`
          *,
          products:product_id (*)
        `)
        .eq('order_id', orderId);
      
      if (error) throw error;
      return assertType<OrderItemWithProduct[]>(data || []);
    },
    enabled: !!orderId,
  });

  useEffect(() => {
    if (!orderLoading && order && user && !isAdmin && order.user_id !== user.id) {
      console.error("Unauthorized access to order");
    }
  }, [order, user, orderLoading, isAdmin]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (orderLoading || itemsLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      </Layout>
    );
  }

  if (!order || !orderItems) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Order not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b">
            <h3 className="text-lg font-semibold">Order Details</h3>
            <p className="text-gray-500">Order ID: {order.id}</p>
            <p className="text-gray-500">Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <p className="text-gray-500">Status: {getStatusBadge(order.status)}</p>
            <p className="text-gray-500">Total Amount: ${order.total_amount?.toFixed(2)}</p>
          </div>

          <div className="px-4 py-5">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4">
                    <img 
                      src={item.products?.image_url || 'placeholder_image_url'} 
                      alt={item.products?.name} 
                      className="w-full h-full object-cover rounded-md" 
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.products?.name}</h4>
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">${((item.products?.price || 0) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
