import './App.css';
// 1. Thêm Navigate
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './services/AuthContext';

// Layouts
import CustomerLayout from './components/NavBar';

import AdminDashboard from './pages/admin/AdminPage';
import StaffPage from './pages/staff/StaffPage';

// Public Pages
import Homepage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';


// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashBoard';
import MyVehicles from './pages/customer/CustomerVehicle';
import BookingPage from './pages/customer/CustomerBooking';
import PaymentPage from './pages/customer/CustomerPayment';

// Admin Pages
import AdminAppointments from './pages/admin/AdBookingManagement';
import AdminOrders from './pages/admin/AdOrderManagement';
import AdminUsers from './pages/admin/AdUserManagement';
import AdminVehicles from './pages/admin/AdVehicleManagement';
import AdminStations from './pages/admin/AdCenterManagement';
import AdminEditStation from './pages/admin/AdCenterEdit';
import AdminParts from './pages/admin/AdPartManagement';
import AdminFinancePage from './pages/admin/AdminDashboard';
// Staff Pages
import StaffCustomers from './pages/staff/StaffCustomers';
import StaffServiceAppointments from './pages/staff/StaffServiceAppointments';

import StaffParts from './pages/staff/StaffParts';
import StaffServiceTicketDetail from './pages/staff/StaffOrder';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffPaymentPage from './pages/staff/StaffPayment';
import TechnicianPage from './pages/technician/TechnicianPage';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianMaintenanceProcess from './pages/technician/TechnicianMaintenanceProcess';
import TechnicianChecklist from './pages/technician/TechnicianChecklist';
import PartCard from './pages/AI';
function App() {
  return (
    <AuthProvider>
      <Router>
         
          <Routes>
            {/* Public Routes */}
            <Route path="/ai" element={<PartCard/>}/>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
          
            <Route path="/unauthorized" element={<div>Bạn không có quyền truy cập!</div>} />
            {/* === 3. CUSTOMER LAYOUT ROUTE === */}
            <Route path="/customer" element={<CustomerLayout />}>
              {/* Ánh xạ với link "Trang chủ" trong layout */}
              <Route index element={<CustomerDashboard />} />
              <Route path="home" element={<CustomerDashboard />} />
              
              {/* Ánh xạ với link "Lịch sử dịch vụ" */}
              <Route path="history" element={<PaymentPage />} />

              {/* Ánh xạ với link "Tài khoản" */}
              <Route path="account" element={<MyVehicles />} />

              {/* Các trang khác cũng dùng layout này */}
              <Route path="booking" element={<BookingPage />} />
              {/* Bạn có thể thêm /settings và /support ở đây khi tạo trang */}
            </Route>

            {/* === 4. REDIRECTS (Chuyển hướng đường dẫn cũ) === */}
            <Route path="/driver" element={<Navigate replace to="/customer/home" />} />
            <Route path="/my-vehicle" element={<Navigate replace to="/customer/account" />} />
            <Route path="/booking" element={<Navigate replace to="/customer/booking" />} />
            <Route path="/payment" element={<Navigate replace to="/customer/history" />} />

            
            <Route path="/admin" element={<AdminDashboard/>}>
              <Route path="users" element={<AdminUsers/>}/>
              <Route path="vehicles" element={<AdminVehicles/>}/>
              <Route path="orders" element={<AdminOrders/>}/>
              <Route path="bookings" element={<AdminAppointments/>}/>
              <Route path="stations" element={<AdminStations/>}/>
              <Route path="stations/:id" element={<AdminEditStation/>}/>
              <Route path="parts" element={<AdminParts/>}/>
                 <Route path="reports" element={<AdminFinancePage/>}/>      
            </Route>
            
            {/* === 6. STAFF LAYOUT (Đã sửa path) === */}
            <Route path="/staff" element={<StaffPage/>}>
              <Route path="customers" element={<StaffCustomers/>}/>
              <Route path="appointments" element={<StaffServiceAppointments/>}/>
              <Route path="maintenance" element={<TechnicianMaintenanceProcess/>}/>
              <Route path="parts" element={<StaffParts/>}/>
              <Route path="order/:id" element={<StaffServiceTicketDetail/>}/>
              <Route path="dashboard" element={<StaffDashboard/>}/>
              <Route path="payments/:id" element={<StaffPaymentPage/>}/>
            </Route>
            {/* === 7. TECHNICIAN LAYOUT === */}
            <Route path="/technician" element={<TechnicianPage />}>
              <Route path="dashboard" element={<TechnicianDashboard />} />
              <Route path="maintenance" element={<TechnicianMaintenanceProcess />} />
              <Route path="checklist/:id" element={<TechnicianChecklist />} />
            </Route>
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;