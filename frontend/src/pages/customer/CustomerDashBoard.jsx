// src/pages/CustomerDashboardModern.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  HiPlus,
  HiOutlineExclamation,
  HiOutlineFire,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineAnnotation
} from "react-icons/hi";

// === DỮ LIỆU GIẢ (MOCK) CHO REMINDERS ===
const mockReminders = [
  {
    id: 1,
    title: "Kiểm tra hệ thống phanh",
    statusText: "Sắp tới hạn trong 500 km",
    currentKm: 19500,
    targetKm: 20000,
    urgency: "warning",
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
];

// Component Thanh tiến trình
const ProgressBar = ({ value, max, colorClass = "bg-blue-600" }) => {
  const percentage = Math.min((value / max) * 100, 100);
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
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-base">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{statusText}</p>
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
              <p className="text-xs text-red-500 mt-1.5 font-semibold">
                {dueDate}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 md:ml-4">
          <span
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${theme.bg} ${theme.text}`}
          >
            {theme.icon}
            {note}
          </span>
          <button
            onClick={() => navigate("/customer/booking")}
            className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition ${theme.button}`}
          >
            {urgency === "danger" ? "Đặt lịch khẩn" : "Đặt lịch ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

// === COMPONENT LỊCH HẸN (ĐÃ CẬP NHẬT LOGIC MỚI) ===
const AppointmentCard = ({ appointment, stationsMap }) => {
  const navigate = useNavigate();

  // Format Date: "Thứ Hai, 20/11/2025"
  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };
const stationName = stationsMap?.[appointment.serviceCenterId] || `Trạm ID: ${appointment.serviceCenterId}`;
  // Format Time: "13:04"
  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    
    const date = new Date(dateString);
    const compensatedDate = new Date(date.getTime() - (7 * 60 * 60 * 1000));
    return compensatedDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper màu sắc trạng thái
  const getStatusStyle = (status) => {
      switch(status) {
          case 'PENDING': return 'text-yellow-600 bg-yellow-100';
          case 'CONFIRMED': return 'text-green-600 bg-green-100';
          case 'CANCELLED': return 'text-red-600 bg-red-100';
          default: return 'text-gray-600 bg-gray-100';
      }
  };

  const getStatusLabel = (status) => {
      switch(status) {
          case 'PENDING': return 'Chờ xác nhận';
          case 'CONFIRMED': return 'Đã xác nhận';
          case 'CANCELLED': return 'Đã hủy';
          case 'COMPLETED': return 'Hoàn thành';
          default: return status;
      }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition hover:shadow-md">
      {/* Header Ngày */}
      <div className="p-4 border-b border-gray-200 bg-blue-50 flex justify-between items-center">
        <p className="text-sm font-bold text-blue-800 flex items-center gap-2 capitalize">
          <HiOutlineCalendar className="w-5 h-5" />
          {formatDate(appointment.appointmentDate)}
        </p>
        <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusStyle(appointment.status)}`}>
            {getStatusLabel(appointment.status)}
        </span>
      </div>

      {/* Body Giờ & Dịch vụ */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Cột Giờ */}
          <div className="bg-blue-600 text-white font-bold p-3 rounded-lg flex flex-col items-center justify-center shadow-sm min-w-[80px]">
            <HiOutlineClock className="w-5 h-5 mb-1 opacity-80" />
            <span className="text-lg">{formatTime(appointment.appointmentDate)}</span>
          </div>

          {/* Cột Thông tin */}
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg mb-1">
              {appointment.serviceType === 'MAINTENANCE' ? 'Bảo dưỡng định kỳ' : 
               appointment.serviceType === 'GENERAL_REPAIR' ? 'Sửa chữa' : appointment.serviceType}
            </h4>
            <p className="text-sm text-blue-600 font-medium mb-2 flex items-center gap-1">
               Trạm {stationName}
            </p>
            {/* Ghi chú nếu có */}
            {appointment.notes && (
                <p className="text-sm text-gray-500 flex items-start gap-1.5 bg-gray-50 p-2 rounded mt-2">
                    <HiOutlineAnnotation className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="italic">"{appointment.notes}"</span>
                </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex bg-gray-50 border-t border-gray-200">
        
      </div>
    </div>
  );
};

// Component Thẻ Thông tin Xe (GIỮ NGUYÊN)
const VehicleInfoCard = ({ user, vehicle }) => {
  if (!vehicle) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">Chưa có thông tin xe.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 md:p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://i.pravatar.cc/80"
            alt="avatar"
            className="w-12 h-12 rounded-full border-2 border-gray-100"
          />
          <div>
            <h3 className="font-bold text-gray-900">
              {user?.fullName || user?.username}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {vehicle.status || "Active"}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-800">
              {vehicle.brand} {vehicle.model}
            </h4>
            <div className="flex items-center gap-2 mt-1">
               <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm font-mono font-bold border border-gray-200">
                  {vehicle.licensePlate}
               </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
               <p className="text-xs text-gray-500 uppercase font-semibold">Odometer</p>
               <p className="text-lg font-bold text-blue-600">
                 {(vehicle.currentMileage || 0).toLocaleString()} km
               </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
               <p className="text-xs text-gray-500 uppercase font-semibold">Năm SX</p>
               <p className="text-lg font-bold text-gray-800">
                 {vehicle.manufactureYear || "N/A"}
               </p>
            </div>
            <div className="col-span-2 bg-gray-50 p-3 rounded-lg flex items-center gap-2">
               <HiOutlineTag className="text-gray-400" />
               <div>
                 <p className="text-xs text-gray-500 uppercase font-semibold">Loại Pin</p>
                 <p className="text-sm font-medium text-gray-800">
                   {vehicle.batteryType || "Không xác định"}
                 </p>
               </div>
            </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-400 text-right">
           Ngày thêm: {new Date(vehicle.created_at).toLocaleDateString('vi-VN')}
        </div>
      </div>
    </div>
  );
};

// Component Dashboard chính
const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [stationsMap, setStationsMap] = useState({});
  // Đổi tên state để rõ nghĩa hơn: lưu danh sách thay vì 1 object
  const [appointmentsList, setAppointmentsList] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [reminders] = useState(mockReminders);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [vehicleRes, appointmentRes, stationRes] = await Promise.all([
          api.get("/vehicles/me", { headers }),
          api.get("/appointments/me", { headers }),
          api.get("/stations", { headers })
        ]);

        setVehicles(vehicleRes.data || []);
        const sMap = {};
        if (stationRes.data) {
            stationRes.data.forEach(s => {
                sMap[s.id] = s.name;
            });
        }
        setStationsMap(sMap);
        // Sắp xếp lịch hẹn: Mới nhất lên đầu hoặc Sắp tới lên đầu
        const sortedAppointments = (appointmentRes.data || []).sort((a, b) => 
            new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        
        setAppointmentsList(sortedAppointments);

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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-gray-600 font-medium animate-pulse">Đang tải dữ liệu...</div>
      </div>
    );
  }

  const vehicle = vehicles.length > 0 ? vehicles[0] : null;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-600 mt-1">Chào mừng trở lại, {user?.fullName || user?.username}!</p>
        </div>
        <button
          onClick={() => navigate("/customer/booking")}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition mt-4 sm:mt-0"
        >
          <HiPlus className="w-5 h-5" /> Đặt Lịch Dịch Vụ Mới
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        
        {/* CỘT TRÁI (Thông tin xe & Nhắc nhở) */}
        <div className="lg:col-span-3 space-y-6">
          <VehicleInfoCard user={user} vehicle={vehicle} />
          
          <h2 className="text-xl font-bold text-gray-900 pt-2">Nhắc nhở bảo dưỡng</h2>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <ReminderCard key={reminder.id} {...reminder} />
            ))}
          </div>
        </div>

        {/* CỘT PHẢI (Danh sách Lịch hẹn) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pt-2">
              <h2 className="text-xl font-bold text-gray-900">Lịch sử đặt hẹn</h2>
              <button onClick={() => navigate("/customer/history")} className="text-sm text-blue-600 hover:underline font-medium">Xem tất cả</button>
          </div>
          
          {/* Danh sách cuộn dọc */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {appointmentsList.length > 0 ? (
              appointmentsList.map((app) => (
                <AppointmentCard 
                    key={app.id} 
                    appointment={app} 
                    stationsMap={stationsMap} 
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
                <div className="inline-block p-3 rounded-full bg-gray-100 mb-3">
                  <HiOutlineCalendar className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Chưa có lịch hẹn nào.</p>
                <button 
                  onClick={() => navigate("/customer/booking")}
                  className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
                >
                  Đặt lịch ngay &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;