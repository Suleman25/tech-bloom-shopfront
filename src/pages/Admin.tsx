
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, LayoutDashboard, PackageOpen, ShoppingCart } from 'lucide-react';

const Admin = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  if (!isAdmin) return null;

  const adminMenuItems = [
    {
      title: "Dashboard",
      description: "View sales analytics, recent orders, and inventory status",
      icon: <LayoutDashboard className="h-8 w-8" />,
      path: "/admin/dashboard"
    },
    {
      title: "Product Management",
      description: "Add, edit, or remove products from your inventory",
      icon: <PackageOpen className="h-8 w-8" />,
      path: "/admin/products"
    },
    {
      title: "Order Management",
      description: "Process and manage customer orders",
      icon: <ShoppingCart className="h-8 w-8" />,
      path: "/admin/orders"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminMenuItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center justify-center h-16 w-16 bg-brand-purple/10 rounded-full mb-4 mx-auto">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{item.title}</h3>
              <p className="text-gray-500 text-center">{item.description}</p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.path);
                }} 
                className="w-full mt-6"
              >
                Go to {item.title}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
