// src/pages/customer/BookingPage.jsx
import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../services/AuthContext";
// 1. Thêm icons mới
import {
  HiOutlineChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineLocationMarker,
  HiOutlineCog,
  HiOutlineCalendar,
} from "react-icons/hi";

// === DỮ LIỆU CẤU HÌNH (Mới) ===
// (Dữ liệu này nên được fetch từ API trong tương lai)
const serviceTypes = [
  { key: "BATTERY_CHECK", name: "Kiểm tra pin", cost: 500000 },
  { key: "MAINTENANCE", name: "Bảo dưỡng định kỳ", cost: 1500000 },
  { key: "BATTERY_REPLACEMENT", name: "Thay pin", cost: 120000000 },
  { key: "GENERAL_REPAIR", name: "Sửa chữa chung", cost: 750000 },
];

const timeSlots = [
  "09:00", "10:00", "11:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
];
// =============================

// === COMPONENT CON (Mới) ===

// 2. Component Lịch
const Calendar = ({ currentMonth, onMonthChange, selectedDate, onDateClick }) => {
  const [days, setDays] = useState([]);
  const [monthYear, setMonthYear] = useState("");

  useEffect(() => {
    const renderCalendar = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      setMonthYear(
        currentMonth.toLocaleDateString("vi-VN", {
          month: "long",
          year: "numeric",
        })
      );

      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();

      let calendarDays = [];

      // Ngày tháng trước
      for (let i = firstDayOfMonth; i > 0; i--) {
        calendarDays.push({
          day: daysInPrevMonth - i + 1,
          isCurrentMonth: false,
          date: new Date(year, month - 1, daysInPrevMonth - i + 1),
        });
      }

      // Ngày tháng này
      for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({
          day: i,
          isCurrentMonth: true,
          date: new Date(year, month, i),
        });
      }

      // Ngày tháng sau (để lấp đầy 6 tuần)
      const remaining = 42 - calendarDays.length;
      for (let i = 1; i <= remaining; i++) {
        calendarDays.push({
          day: i,
          isCurrentMonth: false,
          date: new Date(year, month + 1, i),
        });
      }
      setDays(calendarDays);
    };
    renderCalendar();
  }, [currentMonth]);

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div>
      {/* Header Lịch */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onMonthChange(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <HiChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-semibold text-gray-800 capitalize">{monthYear}</h3>
        <button
          onClick={() => onMonthChange(1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <HiChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Grid Lịch */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {days.map((d, index) => (
          <button
            key={index}
            onClick={() => d.isCurrentMonth && onDateClick(d.date)}
            disabled={!d.isCurrentMonth}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition
              ${
                d.isCurrentMonth
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300"
              }
              ${
                isSameDay(d.date, selectedDate)
                  ? "!bg-teal-500 !text-white"
                  : ""
              }
              ${
                isSameDay(d.date, new Date()) && !isSameDay(d.date, selectedDate)
                  ? "border border-teal-500"
                  : ""
              }
            `}
          >
            {d.day}
          </button>
        ))}
      </div>
    </div>
  );
};

// 3. Component Chọn Giờ
const TimeSlots = ({ selectedTime, onTimeClick }) => (
  <div className="mt-6">
    <h4 className="text-sm font-medium text-gray-700 mb-3">Chọn giờ hẹn</h4>
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {timeSlots.map((time) => (
        <button
          key={time}
          onClick={() => onTimeClick(time)}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            selectedTime === time
              ? "bg-teal-500 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  </div>
);

// 4. Component Select tùy chỉnh
const CustomSelect = ({ label, options, value, onChange, placeholder }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <HiOutlineChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 mt-2.5 pointer-events-none" />
  </div>
);

// === COMPONENT CHÍNH ===
const BookingPage = () => {
  const { user } = useContext(AuthContext); // Lấy user từ AuthContext
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  // 5. State mới cho form đa bước
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedService, setSelectedService] = useState(serviceTypes[0]?.key || "");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Sẽ là một đối tượng Date
  const [selectedTime, setSelectedTime] = useState("");

  const userId = localStorage.getItem("userId");

  // 6. Cập nhật fetchData
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vehiclesRes, stationsRes] = await Promise.all([
          api.get(`/vehicles/me`),
          api.get(`/stations`),
        ]);
        setVehicles(vehiclesRes.data);
        setStations(stationsRes.data);
        // Tự động chọn trạm đầu tiên
        if (stationsRes.data.length > 0) {
          setSelectedStation(stationsRes.data[0].id);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 7. Cập nhật handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStation || !selectedService || !selectedDate || !selectedTime) {
      alert("Vui lòng chọn đầy đủ thông tin: Trung tâm, Dịch vụ, Ngày và Giờ.");
      return;
    }
    
    // Giả định: Lấy xe đầu tiên của người dùng vì UI không có bước chọn xe
    const vehicleId = vehicles[0]?.id;
    if (!vehicleId) {
        alert("Lỗi: Không tìm thấy thông tin xe của bạn.");
        return;
    }
    
    setLoading(true);
    
    // Kết hợp ngày và giờ
    const [hours, minutes] = selectedTime.split(':');
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    try {
      const payload = {
        vehicleId: vehicleId,
        serviceCenterId: selectedStation,
        appointmentDate: appointmentDateTime.toISOString(), // Gửi đi dạng ISO
        serviceType: selectedService,
        notes: "", // Không có trường note trong UI mới
        customerId: userId, // Lấy từ localStorage hoặc context
        status: "PENDING",
      };

      await api.post(`/appointments`, payload);
      alert("✅ Đặt lịch thành công!");

      // Reset form
      setSelectedDate(null);
      setSelectedTime("");
      
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi đặt lịch. Vui lòng thử lại.");
    } finally {
        setLoading(false);
    }
  };

  // === Dữ liệu cho Selects ===
  const stationOptions = stations.map((s) => ({
    value: s.id,
    label: `${s.name} - ${s.address}`,
  }));

  const serviceOptions = serviceTypes.map((s) => ({
    value: s.key,
    label: s.name,
  }));

  // === Dữ liệu cho Tóm tắt ===
  const summary = {
    station: stations.find(s => s.id === selectedStation)?.name || "Chưa chọn",
    service: serviceTypes.find(s => s.key === selectedService)?.name || "Chưa chọn",
    time: selectedDate 
      ? `${selectedTime}, ${selectedDate.toLocaleDateString("vi-VN", {
          weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
        })}`
      : "Chưa chọn",
    cost: serviceTypes.find(s => s.key === selectedService)?.cost || 0,
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Đặt Lịch Dịch Vụ Cho Xe Điện Của Bạn
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Chỉ với vài bước đơn giản, bạn có thể đặt lịch hẹn bảo dưỡng, sửa
            chữa nhanh chóng và tiện lợi.
          </p>
        </div>

        {/* Layout 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          
          {/* Cột trái: Các bước */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bước 1: Chọn Trung tâm & Dịch vụ */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-sm">1</span>
                <h2 className="text-xl font-semibold text-gray-800">Chọn Trung Tâm & Dịch Vụ</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomSelect
                  label="Trung tâm dịch vụ"
                  options={stationOptions}
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  placeholder="-- Chọn trung tâm --"
                />
                <CustomSelect
                  label="Loại dịch vụ"
                  options={serviceOptions}
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  placeholder="-- Chọn dịch vụ --"
                />
              </div>
            </div>

            {/* Bước 2: Chọn Thời Gian */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-sm">2</span>
                <h2 className="text-xl font-semibold text-gray-800">Chọn Thời Gian</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lịch */}
                <Calendar
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  onDateClick={(date) => setSelectedDate(date)}
                  onMonthChange={(monthOffset) =>
                    setCurrentMonth(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() + monthOffset, 1)
                    )
                  }
                />
                {/* Khung giờ */}
                <TimeSlots
                  selectedTime={selectedTime}
                  onTimeClick={(time) => setSelectedTime(time)}
                />
              </div>
            </div>

          </div>
          
          {/* Cột phải: Tóm tắt */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
                Tóm tắt lịch hẹn
              </h2>
              <div className="space-y-4">
                {/* Trung tâm */}
                <div className="flex items-start">
                  <HiOutlineLocationMarker className="w-5 h-5 text-teal-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Trung tâm</p>
                    <p className="font-medium text-gray-800">{summary.station}</p>
                  </div>
                </div>
                {/* Dịch vụ */}
                 <div className="flex items-start">
                  <HiOutlineCog className="w-5 h-5 text-teal-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Dịch vụ</p>
                    <p className="font-medium text-gray-800">{summary.service}</p>
                  </div>
                </div>
                {/* Thời gian */}
                <div className="flex items-start">
                  <HiOutlineCalendar className="w-5 h-5 text-teal-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Thời gian</p>
                    <p className="font-medium text-gray-800 capitalize">{summary.time}</p>
                  </div>
                </div>
              </div>
              
              {/* Chi phí */}
              <div className="flex justify-between items-center mt-5 pt-4 border-t">
                  <p className="text-gray-600">Chi phí ước tính:</p>
                  <p className="font-bold text-xl text-gray-900">{summary.cost.toLocaleString()}đ</p>
              </div>
              <p className="text-xs text-gray-500 text-right">Chi phí cuối cùng có thể thay đổi.</p>
              
              {/* Nút xác nhận */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-teal-700 transition disabled:bg-teal-300"
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;