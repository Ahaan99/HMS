import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/context/AuthContext';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import AuthLayout from '@/components/layouts/AuthLayout';
import LandingPage from '@/pages/LandingPage';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import RoomBooking from '@/pages/dashboard/RoomBooking';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ManageStudents from '@/pages/admin/ManageStudents';
import ManageRooms from '@/pages/admin/ManageRooms';
import ManageRequests from '@/pages/admin/ManageRequests';
import ManageMess from '@/pages/admin/ManageMess';
import MessView from '@/pages/dashboard/MessView';
import Complaints from '@/pages/dashboard/Complaints';
import ManageComplaints from '@/pages/admin/ManageComplaints';
import Payments from '@/pages/dashboard/Payments';
import ManagePayments from '@/pages/admin/ManagePayments';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* Student Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="room-booking" element={<RoomBooking />} />
            <Route path="mess" element={<MessView />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="payments" element={<Payments />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="admin/"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="requests" element={<ManageRequests />} />
            <Route path="mess" element={<ManageMess />} />
            <Route path="complaints" element={<ManageComplaints />} />
            <Route path="payments" element={<ManagePayments />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
