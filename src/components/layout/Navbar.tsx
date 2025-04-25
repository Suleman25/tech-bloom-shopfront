import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cart } from '@/components/cart/Cart';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-magenta rounded-lg"></div>
            <span className="text-xl font-bold">TechBloom</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-brand-purple">Home</Link>
            <Link to="/products" className="text-sm font-medium hover:text-brand-purple">Products</Link>
            <Link to="/categories" className="text-sm font-medium hover:text-brand-purple">Categories</Link>
            <Link to="/deals" className="text-sm font-medium hover:text-brand-purple">Deals</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium hover:text-brand-purple">Admin</Link>
            )}
          </nav>

          <div className="hidden md:flex relative w-64 lg:w-80">
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2 rounded-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="hidden md:flex" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => navigate('/auth')}>
                <User className="w-5 h-5" />
              </Button>
            )}
            <Cart />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <div className="md:hidden py-3">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2 w-full rounded-full"
            />
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col py-4">
            <Link to="/" className="px-4 py-3 text-sm font-medium hover:bg-gray-50">Home</Link>
            <Link to="/products" className="px-4 py-3 text-sm font-medium hover:bg-gray-50">Products</Link>
            <Link to="/categories" className="px-4 py-3 text-sm font-medium hover:bg-gray-50">Categories</Link>
            <Link to="/deals" className="px-4 py-3 text-sm font-medium hover:bg-gray-50">Deals</Link>
            {isAdmin && (
              <Link to="/admin" className="px-4 py-3 text-sm font-medium hover:bg-gray-50">Admin</Link>
            )}
            {user ? (
              <button onClick={handleSignOut} className="px-4 py-3 text-sm font-medium hover:bg-gray-50">
                Sign Out
              </button>
            ) : (
              <Link to="/auth" className="px-4 py-3 text-sm font-medium hover:bg-gray-50">
                Login / Sign up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
