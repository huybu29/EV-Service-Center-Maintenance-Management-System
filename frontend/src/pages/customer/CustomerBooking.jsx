// src/pages/customer/BookingPage.jsx
import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../services/AuthContext";
import {
  HiOutlineChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineLocationMarker,
  HiOutlineCog,
  HiOutlineCalendar,
  HiOutlineAnnotation, // Icon mới cho ghi chú
} from "react-icons/hi";

// === 1. CẤU HÌNH DỊCH VỤ (KHỚP VỚI ENUM JAVA) ===
// src/pages/customer/BookingPage.jsx

// === CẤU HÌNH DỊCH VỤ (Đồng bộ với Java OrderService) ===
const serviceTypes = [
  { 
    key: "MAINTENANCE", 
    name: "Bảo dưỡng định kỳ", 
    cost: 1500000,
    desc: "Kiểm tra đèn, lốp, lọc gió, gạt mưa, nước làm mát..."
  },
 
  { 
    key: "BRAKE_SYSTEM_REPAIR", 
    name: "Sửa chữa hệ thống Phanh", 
    cost: 2500000,
    desc: "Kiểm tra má phanh, đĩa phanh, dầu phanh"
  },
  { 
    key: "GENERAL_REPAIR", 
    name: "Sửa chữa chung", 
    cost: 750000,
    desc: "Chẩn đoán OBD, gầm xe, điều hòa"
  }
  
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
];

// === CÁC COMPONENT CON ===

// Component Lịch (Giữ nguyên logic)
const Calendar = ({ currentMonth, onMonthChange, selectedDate, onDateClick }) => {
  const [days, setDays] = useState([]);
  const [monthYear, setMonthYear] = useState("");

  useEffect(() => {
    const renderCalendar = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      setMonthYear(
        currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
      );

      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();

      let calendarDays = [];
      // Logic render lịch giữ nguyên như cũ
      for (let i = firstDayOfMonth; i > 0; i--) {
        calendarDays.push({ day: daysInPrevMonth - i + 1, isCurrentMonth: false, date: new Date(year, month - 1, daysInPrevMonth - i + 1) });
      }
      for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
      }
      const remaining = 42 - calendarDays.length;
      for (let i = 1; i <= remaining; i++) {
        calendarDays.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
      }
      setDays(calendarDays);
    };
    renderCalendar();
  }, [currentMonth]);

  const isSameDay = (d1, d2) => d1 && d2 && d1.toDateString() === d2.toDateString();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onMonthChange(-1)} className="p-2 rounded-full hover:bg-gray-100"><HiChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <h3 className="font-semibold text-gray-800 capitalize">{monthYear}</h3>
        <button onClick={() => onMonthChange(1)} className="p-2 rounded-full hover:bg-gray-100"><HiChevronRight className="w-5 h-5 text-gray-600" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => <div key={d} className="text-xs font-medium text-gray-500 py-2">{d}</div>)}
        {days.map((d, idx) => (
          <button
            key={idx}
            onClick={() => d.isCurrentMonth && onDateClick(d.date)}
            disabled={!d.isCurrentMonth}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition
              ${d.isCurrentMonth ? "text-gray-700 hover:bg-gray-100" : "text-gray-300"}
              ${isSameDay(d.date, selectedDate) ? "!bg-teal-500 !text-white" : ""}
            `}
          >
            {d.day}
          </button>
        ))}
      </div>
    </div>
  );
};

// Component Chọn Giờ
const TimeSlots = ({ selectedTime, onTimeClick }) => (
  <div className="mt-6">
    <h4 className="text-sm font-medium text-gray-700 mb-3">Chọn giờ hẹn</h4>
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {timeSlots.map((time) => (
        <button
          key={time}
          onClick={() => onTimeClick(time)}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition border
            ${selectedTime === time ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
        >
          {time}
        </button>
      ))}
    </div>
  </div>
);

// Component Select
const CustomSelect = ({ label, options, value, onChange, placeholder }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select value={value} onChange={onChange} className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 pr-10 text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none">
      <option value="">{placeholder}</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    <HiOutlineChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-[38px] pointer-events-none" />
  </div>
);

// === COMPONENT CHÍNH: BookingPage ===
const BookingPage = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Form Data
  const [selectedVehicle, setSelectedVehicle] = useState(""); // Thêm chọn xe
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedService, setSelectedService] = useState(serviceTypes[0]?.key || "");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState(""); // Thêm state cho ghi chú

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [vehiclesRes, stationsRes] = await Promise.all([
          api.get(`/vehicles/me`, { headers }),
          api.get(`/stations`, { headers }), // Đảm bảo API này trả về danh sách Service Center
        ]);

        setVehicles(vehiclesRes.data || []);
        setStations(stationsRes.data || []);

        // Auto-select first item
        if (vehiclesRes.data?.length > 0) setSelectedVehicle(vehiclesRes.data[0].id);
        if (stationsRes.data?.length > 0) setSelectedStation(stationsRes.data[0].id);

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xử lý Submit
  const handleSubmit = async () => {
    if (!selectedStation || !selectedService || !selectedDate || !selectedTime || !selectedVehicle) {
      alert("Vui lòng chọn đầy đủ thông tin (Xe, Trạm, Dịch vụ, Ngày giờ).");
      return;
    }

    setLoading(true);
 
    // 1. Xử lý Ngày Giờ -> LocalDateTime ISO format
    const [hours, minutes] = selectedTime.split(':');
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const GMT7_OFFSET = 14 * 60 * 60 * 1000; 
    
 
    const compensatedDate = new Date(appointmentDateTime.getTime() + GMT7_OFFSET);
    
   
    const finalPayloadDate = compensatedDate.toISOString().slice(0, 19);
    // 2. Tạo Payload khớp Model Java
    const payload = {
      appointmentDate: finalPayloadDate,
      serviceType: selectedService,   // Enum String: MAINTENANCE, ...
      status: "PENDING",              // Enum String: PENDING
      notes: notes,                   // String ghi chú
      customerId: user?.id,           // Long
      vehicleId: selectedVehicle,     // Long
      serviceCenterId: selectedStation // Long
      // technicianId để null, staff sẽ assign sau
    };
    console.log("Payload gửi đặt lịch:", payload);
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(`/appointments`, payload, {
         headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("✅ Đặt lịch thành công! Vui lòng chờ xác nhận.");
      
      // Reset Form
      setSelectedDate(null);
      setSelectedTime("");
      setNotes("");

    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi đặt lịch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare Options
  const vehicleOptions = vehicles.map(v => ({ value: v.id, label: `${v.model} ` }));
  const stationOptions = stations.map(s => ({ value: s.id, label: s.name }));
  const serviceOptions = serviceTypes.map(s => ({ value: s.key, label: s.name }));

  // Calculate Summary
  const summary = {
    vehicle: vehicles.find(v => v.id == selectedVehicle)?.model || "Chưa chọn", // Dùng == để so sánh lỏng nếu ID string/number
    station: stations.find(s => s.id == selectedStation)?.name || "Chưa chọn",
    service: serviceTypes.find(s => s.key === selectedService)?.name || "Chưa chọn",
    cost: serviceTypes.find(s => s.key === selectedService)?.cost || 0,
    time: selectedDate 
      ? `${selectedTime}, ${selectedDate.toLocaleDateString("vi-VN", { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}`
      : "Chưa chọn",
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Đặt Lịch Dịch Vụ</h1>
          <p className="text-gray-500 mt-2">Chọn thời gian và địa điểm thuận tiện nhất cho chiếc xe điện của bạn.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          
          {/* Cột Trái: Form Nhập Liệu */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bước 1: Thông tin chung */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6 border-b pb-4 border-gray-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm shadow-sm">1</span>
                <h2 className="text-xl font-semibold text-gray-800">Thông tin Dịch vụ</h2>
              </div>
              
              <div className="space-y-4">
                 <CustomSelect 
                    label="Chọn xe của bạn" 
                    options={vehicleOptions} 
                    value={selectedVehicle} 
                    onChange={(e) => setSelectedVehicle(e.target.value)} 
                    placeholder="-- Chọn xe --" 
                 />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect 
                        label="Trung tâm dịch vụ" 
                        options={stationOptions} 
                        value={selectedStation} 
                        onChange={(e) => setSelectedStation(e.target.value)} 
                        placeholder="-- Chọn trạm --" 
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
            </div>

            {/* Bước 2: Thời gian */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6 border-b pb-4 border-gray-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm shadow-sm">2</span>
                <h2 className="text-xl font-semibold text-gray-800">Chọn Thời gian</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Calendar 
                   currentMonth={currentMonth} 
                   onMonthChange={(offset) => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1))} 
                   selectedDate={selectedDate} 
                   onDateClick={setSelectedDate} 
                />
                <TimeSlots selectedTime={selectedTime} onTimeClick={setSelectedTime} />
              </div>
            </div>

            {/* Bước 3: Ghi chú (Mới) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm shadow-sm">3</span>
                  <h2 className="text-xl font-semibold text-gray-800">Ghi chú thêm</h2>
               </div>
               <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                  rows={3}
                  placeholder="Ví dụ: Xe có tiếng kêu lạ ở gầm, cần kiểm tra kỹ phanh..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
               ></textarea>
            </div>

          </div>

          {/* Cột Phải: Tóm tắt (Sticky) */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-5">Tóm tắt lịch hẹn</h2>
              
              <div className="space-y-4 text-sm">
                 <div className="flex gap-3">
                    <HiOutlineLocationMarker className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <div>
                       <p className="text-gray-500 text-xs uppercase font-bold">Trung tâm</p>
                       <p className="font-medium text-gray-800">{summary.station}</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-3">
                    <HiOutlineCog className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <div>
                       <p className="text-gray-500 text-xs uppercase font-bold">Dịch vụ</p>
                       <p className="font-medium text-gray-800">{summary.service}</p>
                       <p className="text-xs text-gray-500">Xe: {summary.vehicle}</p>
                    </div>
                 </div>

                 <div className="flex gap-3">
                    <HiOutlineCalendar className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <div>
                       <p className="text-gray-500 text-xs uppercase font-bold">Thời gian</p>
                       <p className="font-medium text-gray-800 capitalize">{summary.time}</p>
                    </div>
                 </div>

                 {notes && (
                    <div className="flex gap-3">
                       <HiOutlineAnnotation className="w-5 h-5 text-teal-600 flex-shrink-0" />
                       <div>
                          <p className="text-gray-500 text-xs uppercase font-bold">Ghi chú</p>
                          <p className="font-medium text-gray-800 italic">"{notes}"</p>
                       </div>
                    </div>
                 )}
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
                 <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Ước tính:</span>
                    <span className="text-2xl font-bold text-teal-600">{summary.cost.toLocaleString()} ₫</span>
                 </div>
                 <p className="text-xs text-gray-400 text-right mt-1">*Chi phí thực tế có thể thay đổi sau khi kiểm tra.</p>
              </div>

              <button
                 onClick={handleSubmit}
                 disabled={loading}
                 className={`w-full py-3.5 rounded-lg text-white font-bold text-lg mt-6 shadow-md transition transform active:scale-95
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
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