import React, { useContext } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import {
  HiOutlineHome,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogout,
} from "react-icons/hi";

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
        <span
          className={`mr-3 text-xl ${
            isActive ? "text-blue-600" : "text-gray-400"
          }`}
        >
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

  return (
    <div className="flex h-screen bg-gray-50 font-inter">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white p-4 flex flex-col justify-between border-r border-gray-200">
        <div>
          {/* USER INFO */}
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
          </div>

          {/* MENU */}
          <nav className="flex-1 flex flex-col">
            <div className="space-y-2">
              <SidebarLink
                to="/customer/home"
                icon={<HiOutlineHome />}
                label="Trang chủ"
              />
              <SidebarLink
                to="/customer/history"
                icon={<HiOutlineClock />}
                label="Lịch sử dịch vụ"
              />
              <SidebarLink
                to="/customer/booking"
                icon={<HiOutlineUser />}
                label="Đặt lịch"
              />
            </div>
            <div className="space-y-2 mt-8">
              <SidebarLink
                to="/customer/settings"
                icon={<HiOutlineCog />}
                label="Cài đặt"
              />
              <SidebarLink
                to="/customer/support"
                Click
                icon={<HiOutlineQuestionMarkCircle />}
                label="Hỗ trợ"
              />
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
          <span className="mr-3 text-lg text-gray-500">
            <HiOutlineLogout />
          </span>
          Đăng xuất
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;