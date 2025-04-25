
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import ProductTable from '@/components/admin/ProductTable';
import ProductForm from '@/components/admin/ProductForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Admin = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'View Products' : 'Add New Product'}
          </Button>
        </div>

        {showForm ? (
          <ProductForm onSuccess={() => setShowForm(false)} />
        ) : (
          <ProductTable onEdit={() => setShowForm(true)} />
        )}
      </div>
    </Layout>
  );
};

export default Admin;
