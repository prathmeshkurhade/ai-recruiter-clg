import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JobForm from "./pages/JobForm";
import JobDetail from "./pages/JobDetail";
import Solutions from "./pages/Solutions";
import Platform from "./pages/Platform";
import AboutUs from "./pages/AboutUs";
import EthicalSettings from "./pages/EthicalSettings";
import SidebarLayout from "./components/SidebarLayout";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <SidebarLayout>{children}</SidebarLayout> : <Navigate to="/login" />;
}

// Public Layout for non-authenticated pages
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with standard Navbar/Footer */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/platform" element={<PublicLayout><Platform /></PublicLayout>} />
          <Route path="/solutions" element={<PublicLayout><Solutions /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
          
          {/* Protected Routes wrapped in the new SidebarLayout */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/jobs/new" element={<ProtectedRoute><JobForm /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><EthicalSettings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
