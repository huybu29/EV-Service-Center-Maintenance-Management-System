import React, { useContext, useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import {
  HiOutlineHome,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogout,
  HiOutlineChatAlt2, // Icon cho nút chat
  HiX // Icon đóng chat
} from "react-icons/hi";
import CustomerChatBox from "../pages/customer/CustomerChatBox"; // Đảm bảo đường dẫn đúng
import NotificationBell from "./NotificationBell";
// Component Link Sidebar (Giữ nguyên)
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className={`mr-3 text-xl ${isActive ? "text-blue-600" : "text-gray-400"}`}>
          {icon}
        </span>
        {label}
      </>
    )}
  </NavLink>
);

const CustomerLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // --- STATE MỚI: Quản lý bật/tắt chat ---
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-inter relative">
      
      {/* SIDEBAR (Giữ nguyên) */}
      <aside className="w-64 bg-white p-4 flex flex-col justify-between border-r border-gray-200 hidden md:flex">
        <div>
          
          <div className="flex items-center space-x-3 mb-8 px-2 py-4">
            <img
              src="https://i.pravatar.cc/80"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col overflow-hidden">
              
              <h2 className="text-sm font-semibold text-gray-900 truncate">
                {user?.fullName ? user.fullName : user?.username}
              </h2>
              <p className="text-xs text-gray-500 truncate">
                {user?.email ?? "Chưa có email"}
              </p>
            </div>
             {user && <NotificationBell currentUserId={user.id} />} 
          </div>

          {/* MENU */}
          <nav className="flex-1 flex flex-col">
            <div className="space-y-2">
              <SidebarLink to="/customer/home" icon={<HiOutlineHome />} label="Trang chủ" />
              <SidebarLink to="/customer/history" icon={<HiOutlineClock />} label="Lịch sử dịch vụ" />
              <SidebarLink to="/customer/booking" icon={<HiOutlineUser />} label="Đặt lịch" />
            </div>
            <div className="space-y-2 mt-8">
            
            </div>
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
        >
          <span className="mr-3 text-lg text-gray-500"><HiOutlineLogout /></span>
          Đăng xuất
        </button>
      </aside>

      {/* MAIN CONTENT */}
      
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto relative">
        <Outlet />
      </main>

      {/* === TÍCH HỢP NÚT CHAT === */}
      
      {/* 1. Nút tròn nổi (Floating Action Button) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-50 flex items-center justify-center
            ${isChatOpen ? "bg-red-500 rotate-90" : "bg-blue-600 animate-bounce-slow"}
        `}
      >
        {isChatOpen ? (
            <HiX className="w-8 h-8 text-white" /> 
        ) : (
            <HiOutlineChatAlt2 className="w-8 h-8 text-white" />
        )}
      </button>

      {/* 2. Hộp thoại Chat Box */}
      {/* Chỉ render khi có user để đảm bảo có ID kết nối */}
      {user && (
          <CustomerChatBox 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)}
              customerId={user.id}        
              customerName={user.fullName || user.username}
          />
      )}

    </div>
  );
};

export default CustomerLayout;