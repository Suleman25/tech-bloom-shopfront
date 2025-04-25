
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryTable } from '@/utils/supabaseHelpers';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { Order, OrderItemWithProduct } from '@/types/order';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await queryTable('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data as unknown as Order;
    },
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['order-items', orderId],
    queryFn: async () => {
      const { data, error } = await queryTable('order_items')
        .select(`
          *,
          product:product_id (
            name,
            price,
            image_url
          )
        `)
        .eq('order_id', orderId);

      if (error) throw error;
      return data as unknown as OrderItemWithProduct[];
    },
    enabled: !!orderId,
  });

  const isLoading = orderLoading || itemsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      </Layout>
    );
  }

  if (!order || !items) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-8">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </Layout>
    );
  }

  const shippingAddress = order.shipping_address ? JSON.parse(order.shipping_address) : {};
  const orderDate = new Date(order.created_at).toLocaleDateString();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Your order has been received and is being processed.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium">${order.total_amount?.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-brand-purple mr-1" />
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">{estimatedDelivery.toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                  {item.product?.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-gray-500">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name || 'Product'}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ${item.unit_price?.toFixed(2)}
                  </p>
                </div>
                <div className="font-medium">
                  ${(item.quantity * (item.unit_price || 0)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {shippingAddress && Object.keys(shippingAddress).length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{' '}
                  {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
                <p>Phone: {shippingAddress.phone}</p>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/orders')}
            >
              View All Orders
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
