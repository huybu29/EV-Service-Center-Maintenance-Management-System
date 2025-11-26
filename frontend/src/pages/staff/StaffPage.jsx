import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import { useNavigate } from "react-router-dom";
const StaffPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          👨‍🔧 Staff Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <Link
            to="/staff/dashboard"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            Dashboard
          </Link>
          <Link
            to="/staff/customers"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Quản lý khách hàng 
          </Link>

          



          <Link
            to="/staff/appointments"
            className="p-3 rounded-xl hover:bg-yellow-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Quản lý lịch hẹn dịch vụ
          </Link>

          

          
          <Link
            to="/staff/payments"
            className="p-3 rounded-xl hover:bg-pink-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
             Quản lý hóa đơn & thanh toán
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
          {/* Outlet để render các trang con như /staff/customers, /staff/appointments,... */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffPage;
