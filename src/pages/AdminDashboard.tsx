
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Package,
  ShoppingCart,
  DollarSign,
  Loader2,
  Users,
  Box,
} from 'lucide-react';

// Define types for order data since they're not in the Supabase types yet
interface OrderData {
  id: string;
  created_at: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  user_id: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface OrderItemData {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: {
    name: string;
    price: number;
    image_url: string | null;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch dashboard data (counts and stats)
  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      // Get product count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
        
      // Get total orders count - using type assertion for now
      const { count: orderCount } = await supabase
        .from('orders' as any)
        .select('*', { count: 'exact', head: true }) as any;
        
      // Get orders with pending status count  
      const { count: pendingOrderCount } = await supabase
        .from('orders' as any)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending') as any;
        
      // Get revenue (sum of order total_amount)
      const { data: revenueData } = await supabase
        .from('orders' as any)
        .select('total_amount') as any;
        
      const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      
      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders' as any)
        .select(`
          id, 
          created_at, 
          status, 
          total_amount, 
          user_id,
          profiles:user_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5) as { data: OrderData[] | null };
      
      // Get low stock products (stock < 10)
      const { data: lowStockProducts } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 10)
        .order('stock', { ascending: true })
        .limit(5);
        
      return {
        productCount,
        orderCount: orderCount || 0,
        pendingOrderCount: pendingOrderCount || 0,
        totalRevenue,
        recentOrders: recentOrders || [],
        lowStockProducts: lowStockProducts || []
      };
    },
    enabled: !!isAdmin
  });
  
  const isLoading = authLoading || statsLoading;
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }
  
  if (!isAdmin) {
    navigate('/');
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products" onClick={() => navigate('/admin')}>Products</TabsTrigger>
            <TabsTrigger value="orders" onClick={() => navigate('/admin/orders')}>Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${dashboardData?.totalRevenue.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">Lifetime sales</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardData?.orderCount}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-yellow-500">{dashboardData?.pendingOrderCount} pending</span>
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Products</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardData?.productCount}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-red-500">
                          {dashboardData?.lowStockProducts?.length} low stock
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        $
                        {dashboardData?.orderCount && dashboardData?.orderCount > 0
                          ? (dashboardData.totalRevenue / dashboardData.orderCount).toFixed(2)
                          : '0.00'}
                      </div>
                      <p className="text-xs text-muted-foreground">Per order</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardData?.recentOrders?.length ? (
                        <div className="space-y-4">
                          {dashboardData.recentOrders.map((order: OrderData) => (
                            <div 
                              key={order.id} 
                              className="flex justify-between items-center"
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div>
                                <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString()} • 
                                  {order.profiles?.first_name} {order.profiles?.last_name}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${order.total_amount?.toFixed(2)}</div>
                                <div className={`text-sm ${
                                  order.status === 'pending' ? 'text-yellow-500' :
                                  order.status === 'shipped' ? 'text-blue-500' :
                                  order.status === 'delivered' ? 'text-green-500' : 'text-gray-500'
                                }`}>
                                  {order.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">No recent orders</div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Low Stock Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardData?.lowStockProducts?.length ? (
                        <div className="space-y-4">
                          {dashboardData.lowStockProducts.map((product) => (
                            <div 
                              key={product.id} 
                              className="flex justify-between items-center"
                              onClick={() => navigate(`/admin?edit=${product.id}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                  {product.image_url ? (
                                    <img 
                                      src={product.image_url} 
                                      alt={product.name} 
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <Box className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.category}</div>
                                </div>
                              </div>
                              <div className={`font-medium ${product.stock <= 5 ? 'text-red-500' : 'text-yellow-500'}`}>
                                {product.stock} in stock
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">No low stock products</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
