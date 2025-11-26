// src/pages/admin/AdminDashboardModern.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import  { AuthContext } from "../../services/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const { user , logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-grey mb-8">
          ⚙️ Admin Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <Link
            to="/admin/users"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            Quản lý người dùng
          </Link>
          <Link
            to="/admin/stations"
            className="p-3 rounded-xl hover:bg-green-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Quản lý trạm
          </Link>
          <Link
            to="/admin/bookings"
            className="p-3 rounded-xl hover:bg-yellow-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Quản lý đặt lịch
          </Link>
          <Link
            to="/admin/vehicles"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Quản lý phương tiện
          </Link>
          <Link
            to="/admin/parts"
            className="p-3 rounded-xl hover:bg-green-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Quản lý phụ tùng
          </Link>
          <Link
            to="/admin/orders"
            className="p-3 rounded-xl hover:bg-purple-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            Quản lý Order
          </Link>
          <Link
            to="/admin/reports"
            className="p-3 rounded-xl hover:bg-red-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Báo cáo & thống kê
          </Link>
          <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <span className="mr-3 text-lg text-gray-500">
                     
                    </span>
                    Đăng xuất
                  </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
     

      

        {/* Main Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {/* Outlet sẽ render các trang con như /admin/users, /admin/stations,... */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
