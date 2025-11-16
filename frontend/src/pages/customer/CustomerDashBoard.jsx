// src/pages/CustomerDashboardModern.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
// Đã thêm icons
import {
  HiPlus,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineFire,
  HiOutlineCheckCircle,
} from "react-icons/hi";

// === DỮ LIỆU GIẢ (MOCK) ĐỂ DỰNG UI ===
// Do API của bạn không trả về dữ liệu này
const mockAppointment = {
  date: "THỨ SÁU, 26 THÁNG 7, 2024",
  time: "14:00",
  title: "Bảo dưỡng định kỳ 20,000 km",
  status: "Đã xác nhận",
};

const mockReminders = [
  {
    id: 1,
    title: "Kiểm tra hệ thống phanh",
    statusText: "Sắp tới hạn trong 500 km",
    currentKm: 19500,
    targetKm: 20000,
    urgency: "warning", // 'warning', 'danger', 'info'
    note: "Cần chú ý",
  },
  {
    id: 2,
    title: "Thay nước làm mát pin",
    statusText: "Đã quá 12 ngày",
    dueDate: "Đến hạn vào 12/07/2024",
    urgency: "danger",
    note: "Quá hạn",
  },
  {
    id: 3,
    title: "Kiểm tra lốp và đảo lốp",
    statusText: "Sẽ tới hạn trong 4,750 km",
    currentKm: 15250,
    targetKm: 20000,
    urgency: "info",
    note: "Sắp tới",
  },
];
// ======================================

// Component Thanh tiến trình (Progress Bar)
const ProgressBar = ({ value, max, colorClass = "bg-blue-600" }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
      <div
        className={`h-1.5 rounded-full ${colorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Component Thẻ Nhắc nhở
const ReminderCard = ({
  title,
  statusText,
  currentKm,
  targetKm,
  dueDate,
  urgency,
  note,
}) => {
  const navigate = useNavigate();

  // Xác định màu sắc dựa trên 'urgency'
  const colors = {
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      text: "text-yellow-600",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      progress: "bg-yellow-500",
      icon: <HiOutlineExclamation className="text-yellow-600" />,
    },
    danger: {
      bg: "bg-red-50",
      border: "border-red-400",
      text: "text-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white",
      progress: "bg-red-500",
      icon: <HiOutlineFire className="text-red-600" />,
    },
    info: {
      bg: "bg-white",
      border: "border-gray-200",
      text: "text-green-600",
      button: "bg-white hover:bg-gray-100 text-blue-600 border border-blue-300",
      progress: "bg-green-500",
      icon: <HiOutlineCheckCircle className="text-green-600" />,
    },
  };
  const theme = colors[urgency] || colors.info;

  return (
    <div
      className={`rounded-lg border ${theme.border} ${theme.bg} p-5 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        {/* Nội dung bên trái */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-base">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{statusText}</p>

          {/* Hiển thị thanh tiến trình theo km hoặc ngày */}
          {currentKm !== undefined && targetKm !== undefined ? (
            <>
              <ProgressBar
                value={currentKm}
                max={targetKm}
                colorClass={theme.progress}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                {currentKm.toLocaleString()} / {targetKm.toLocaleString()} km
              </p>
            </>
          ) : (
            <>
              <ProgressBar value={100} max={100} colorClass={theme.progress} />
              <p className="text-xs text-red-500 mt-1.5">{dueDate}</p>
            </>
          )}
        </div>

        {/* Nội dung bên phải (Nút và Trạng thái) */}
        <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 md:ml-4">
          <span
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${theme.bg} ${theme.text}`}
          >
            {theme.icon}
            {note}
          </span>
          <button
            onClick={() => navigate("/customer/booking")} // Đã cập nhật
            className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition ${theme.button}`}
          >
            {urgency === "danger" ? "Đặt lịch khẩn" : "Đặt lịch ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Thẻ Lịch hẹn
const AppointmentCard = ({ appointment }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-500">
          {appointment.date}
        </p>
      </div>
      <div className="p-5">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 text-blue-700 font-bold p-3 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{appointment.time}</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{appointment.title}</h4>
            <p className="text-sm text-green-600 font-medium flex items-center gap-1 mt-1">
              <HiOutlineCheckCircle />
              Trạng thái: {appointment.status}
            </p>
          </div>
        </div>
      </div>
      <div className="flex bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => navigate("/customer/booking")} // Cần cập nhật
          className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Dời lịch
        </button>
        <button
          onClick={() => navigate("/customer/history")} // Cần cập nhật
          className="flex-1 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-gray-100 transition border-l border-gray-200"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

// Component Thẻ Thông tin Xe
const VehicleInfoCard = ({ user, vehicle }) => {
  const battery = vehicle?.batteryPercentage || 82; // Dùng 82% làm mặc định

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Thông tin User */}
        <div className="flex items-center space-x-3">
          <img
            src="https://i.pravatar.cc/80" // Placeholder avatar
            alt="avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-bold text-gray-900">
              {user?.fullName || user?.username}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Hình ảnh xe (hiển thị trên desktop) */}
        <div className="hidden md:block">
          <img
            src={vehicle?.imageUrl || "https://i.imgur.com/gQxK30P.png"} // Placeholder
            alt={vehicle?.model || "Vinfast VF8"}
            className="w-48 h-auto object-cover rounded"
          />
        </div>
      </div>

      {/* Thông tin xe */}
      <div className="mt-5 pt-5 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800">
          {vehicle?.model || "Vinfast VF8"}
        </h4>
        <p className="text-sm text-gray-500 font-mono">
          VIN: {vehicle?.vin || "WF1234567890XYZ"}
        </p>

        {/* Tình trạng pin */}
        <div className="mt-4">
          <div className="flex justify-between items-baseline">
            <label className="text-sm font-medium text-gray-700">
              Tình trạng pin
            </label>
            <span className="text-lg font-bold text-blue-600">{battery}%</span>
          </div>
          <ProgressBar value={battery} max={100} colorClass="bg-blue-600" />
        </div>

        {/* Odometer */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            Odometer
          </label>
          <p className="text-2xl font-bold text-gray-900">
            {(vehicle?.odometer || 15250).toLocaleString()} km
          </p>
        </div>
      </div>
    </div>
  );
};

// Component Dashboard chính
const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  // const [centers, setCenters] = useState([]); // Không dùng trong UI mới
  // const [notifications, setNotifications] = useState([]); // Không dùng trong UI mới
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dùng dữ liệu giả
  const [reminders, setReminders] = useState(mockReminders);
  const [upcomingAppointment, setUpcomingAppointment] =
    useState(mockAppointment);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // Chỉ fetch dữ liệu xe, vì UI mới chỉ cần xe
        const vehicleRes = await api.get("/vehicles/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(vehicleRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600 animate-pulse">
        Đang tải dữ liệu...
      </div>
    );
  }

  const vehicle = vehicles[0]; // Lấy xe đầu tiên

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-600 mt-1">
            Chào mừng trở lại, {user?.fullName || user?.username}!
          </p>
        </div>
        <button
          onClick={() => navigate("/customer/booking")} // Đã cập nhật
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition mt-4 sm:mt-0"
        >
          <HiPlus className="w-5 h-5" />
          Đặt Lịch Dịch Vụ Mới
        </button>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Cột chính (bên trái) */}
        <div className="lg:col-span-3 space-y-6">
          <VehicleInfoCard user={user} vehicle={vehicle} />

          <h2 className="text-xl font-bold text-gray-900 pt-2">
            Nhắc nhở bảo dưỡng
          </h2>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <ReminderCard key={reminder.id} {...reminder} />
            ))}
          </div>
        </div>

        {/* Cột phụ (bên phải) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 lg:pt-2">
            Lịch hẹn sắp tới
          </h2>
          {upcomingAppointment ? (
            <AppointmentCard appointment={upcomingAppointment} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              Không có lịch hẹn nào sắp tới.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;