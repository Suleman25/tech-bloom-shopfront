import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* These routes will be implemented as needed */}
            <Route path="/products" element={<NotFound />} />
            <Route path="/product/:id" element={<NotFound />} />
            <Route path="/cart" element={<NotFound />} />
            <Route path="/checkout" element={<NotFound />} />
            <Route path="/login" element={<NotFound />} />
            <Route path="/signup" element={<NotFound />} />
            <Route path="/forgot-password" element={<NotFound />} />
            <Route path="/category/:id" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
