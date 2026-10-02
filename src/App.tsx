import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { EnquiryWidget } from "@/components/layout/EnquiryWidget";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Core Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductModel from "./pages/ProductModel";
import Services from "./pages/Services";
import Clients from "./pages/Clients";
import CSR from "./pages/CSR";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import Enquiry from "./pages/Enquiry";
import Certification from "./pages/Certification";
import NotFound from "./pages/NotFound";

// Portal Pages
import PortalLogin from "./pages/PortalLogin";
import PriceSupportPortal from "./pages/PriceSupportPortal";
import OrderSupportPortal from "./pages/OrderSupportPortal";
import AdminUnifiedDashboard from "./pages/AdminUnifiedDashboard";
import AdminDispatched from "./pages/AdminDispatched";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:categoryId" element={<Products />} />
              <Route path="/products/:categoryId/:modelId" element={<ProductModel />} />
              <Route path="/services" element={<Services />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/csr" element={<CSR />} />
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/certifications/:certId" element={<Certification />} />
              
              {/* Portal routes */}
              <Route path="/portal/login" element={<PortalLogin />} />
              
              <Route 
                path="/portal/price-support" 
                element={<Navigate to="/portal/order-support" replace />} 
              />
              
              <Route 
                path="/portal/order-support" 
                element={
                  <ProtectedRoute allowedRole="dealer">
                    <OrderSupportPortal />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/portal/admin" 
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminUnifiedDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/portal/admin/dispatched" 
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDispatched />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <EnquiryWidget />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

