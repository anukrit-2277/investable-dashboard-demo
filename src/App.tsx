
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CompanyDashboard from "./pages/CompanyDashboard";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/company/:id" element={
                <ProtectedRoute>
                  <CompanyDashboard />
                </ProtectedRoute>
              } />
              <Route path="/company" element={
                <ProtectedRoute allowedUserTypes={['company']}>
                  <ComingSoon />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedUserTypes={['superadmin']} redirectTo="/home">
                  <AdminPage />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
