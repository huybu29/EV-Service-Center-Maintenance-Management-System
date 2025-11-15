import React from "react";
import { Link, Outlet } from "react-router-dom";

const StaffDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          👨‍🔧 Staff Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <Link
            to="/staff/customers"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            👥 Quản lý khách hàng 
          </Link>
<Link
            to="/staff/vehicles"
            className="p-3 rounded-xl hover:bg-blue-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            👥 Quản lý phương tiện
          </Link>
          



          <Link
            to="/staff/appointments"
            className="p-3 rounded-xl hover:bg-yellow-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            📅 Quản lý lịch hẹn dịch vụ
          </Link>

          <Link
            to="/staff/maintenance"
            className="p-3 rounded-xl hover:bg-green-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            🧰 Quản lý quy trình bảo dưỡng
          </Link>

          <Link
            to="/staff/parts"
            className="p-3 rounded-xl hover:bg-purple-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            ⚙️ Quản lý phụ tùng
          </Link>

          <Link
            to="/staff/invoices"
            className="p-3 rounded-xl hover:bg-pink-100 transition flex items-center gap-2 font-medium text-gray-700"
          >
            💳 Quản lý hóa đơn & thanh toán
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Xin chào, Nhân viên 👋
          </h1>
          <p className="text-gray-600">
            Bảng điều khiển công việc của nhân viên trung tâm bảo dưỡng xe điện.
          </p>
        </div>

        {/* Main Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          {/* Outlet để render các trang con như /staff/customers, /staff/appointments,... */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
