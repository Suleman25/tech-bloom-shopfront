
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  User as UserIcon,
  Heart,
  Clock,
  Package 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { queryTable, safelyAssertType } from '@/utils/supabaseHelpers';
import { Loader2 } from 'lucide-react';
import { Order } from '@/types/order';

const UserDashboard = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
      return;
    }
    
    // Redirect admins to admin dashboard
    if (!isLoading && isAdmin) {
      navigate('/admin/dashboard');
      return;
    }
  }, [user, isLoading, isAdmin, navigate]);

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['user-recent-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await queryTable('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      return safelyAssertType<Order[]>(data);
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!user) return null;

  const dashboardItems = [
    {
      title: "My Orders",
      icon: <ShoppingBag className="h-10 w-10" />,
      description: "View and track your order history",
      path: "/orders",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "My Profile",
      icon: <UserIcon className="h-10 w-10" />,
      description: "Update your personal information",
      path: "/profile",
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Wishlist",
      icon: <Heart className="h-10 w-10" />,
      description: "Products you've saved for later",
      path: "/wishlist",
      color: "bg-pink-50 text-pink-600"
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome, {user.user_metadata.first_name || 'User'}</h1>
            <p className="text-gray-600">Here's what's happening with your account</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(item.path)}
            >
              <div className={`${item.color} p-3 rounded-full inline-flex mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
          </div>
          
          {ordersLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />
            </div>
          ) : recentOrders && recentOrders.length > 0 ? (
            <div className="divide-y">
              {recentOrders.map(order => (
                <div 
                  key={order.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4"
                  onClick={() => navigate(`/order-confirmation/${order.id}`)}
                >
                  <div className={`p-2 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {order.status === 'delivered' ? <Package /> :
                     order.status === 'shipped' ? <Package /> :
                     order.status === 'pending' ? <Clock /> :
                     <Clock />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${order.total_amount?.toFixed(2)}</div>
                    <div className="text-sm capitalize text-gray-500">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No orders yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/products')}
              >
                Browse Products
              </Button>
            </div>
          )}
          
          {recentOrders && recentOrders.length > 0 && (
            <div className="px-6 py-4 border-t bg-gray-50 text-center">
              <Button variant="link" onClick={() => navigate('/orders')}>
                View All Orders
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
