import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
// Sử dụng bộ icon Feather cho đồng bộ với Dashboard trước đó
import { 
  FiHome, 
  FiTool, 
  FiBox, 
  FiLogOut, 
  FiCheckSquare 
} from "react-icons/fi";

const TechnicianPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🔧 Tech Portal
          </h2>
          <p className="text-xs text-gray-500 mt-1">Hệ thống dành cho Kỹ thuật viên</p>
        </div>

        <nav className="flex-1 flex flex-col gap-2 p-4">
          <Link
            to="/technician/dashboard"
            className="p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition flex items-center gap-3 font-medium"
          >
            <FiHome size={20} />
            Dashboard
          </Link>

          <Link
            to="/technician/maintenance"
            className="p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition flex items-center gap-3 font-medium"
          >
            <FiTool size={20} />
            Công việc của tôi
          </Link>

        
          <Link
            to="/technician/parts"
            className="p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition flex items-center gap-3 font-medium"
          >
            <FiBox size={20} />
            Tra cứu & Yêu cầu Phụ tùng
          </Link>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100">
            <div className="mb-4 px-2">
                <p className="text-sm font-bold text-gray-700 truncate">{user?.fullName || "Kỹ thuật viên"}</p>
                <p className="text-xs text-gray-500">Mã: {user?.id || "TECH-001"}</p>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition gap-3"
            >
                <FiLogOut size={18} />
                Đăng xuất
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
       

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
           {/* Outlet render các trang con: Dashboard, Tasks, Parts... */}
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TechnicianPage;