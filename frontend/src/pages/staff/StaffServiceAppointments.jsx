import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; 

// Import Icons
import { 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight, 
  HiPlus, 
  HiX, 
  HiCheck, 
  HiTrash, 
  HiClipboardList,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineAnnotation,
  HiLocationMarker
} from "react-icons/hi";

// === CẤU HÌNH KHUNG GIỜ (7:00 - 18:00) ===
const START_HOUR = 7;
const END_HOUR = 18;
// Chiều cao mỗi slot 1 giờ (px) - Khớp với h-20 của Tailwind (80px)
const HOUR_HEIGHT = 80; 

const timeSlots = [];
for (let i = START_HOUR; i <= END_HOUR; i++) {
  timeSlots.push(i < 10 ? `0${i}:00` : `${i}:00`);
}

// === COMPONENT CON: HEADER ===
const CalendarHeader = ({ onCreate }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Quản Lý Lịch Hẹn</h1>
      <p className="text-gray-500 text-sm mt-1">Theo dõi và xử lý các yêu cầu đặt lịch tại trạm.</p>
    </div>
    <button 
      onClick={onCreate}
      className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
    >
      <HiPlus className="w-5 h-5" /> Tạo Lịch Mới
    </button>
  </div>
);

// === COMPONENT CON: TOOLBAR ===
const CalendarToolbar = ({ currentWeekStart, onPrevWeek, onNextWeek, onToday }) => {
  const monthYear = currentWeekStart.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
        <button onClick={onPrevWeek} className="p-2 hover:bg-white rounded-md text-gray-600 transition-all"><HiOutlineChevronLeft /></button>
        <button onClick={onNextWeek} className="p-2 hover:bg-white rounded-md text-gray-600 transition-all"><HiOutlineChevronRight /></button>
        <span className="px-4 text-sm font-bold text-gray-800 capitalize min-w-[160px] text-center border-l border-r border-gray-200 mx-1">
            {monthYear}
        </span>
        <button onClick={onToday} className="bg-white px-3 py-1.5 rounded-md text-xs font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 ml-1">
            Hôm nay
        </button>
      </div>
      
      <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Bảo dưỡng</div>
         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span> Sửa chữa</div>
         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> Thay pin</div>
      </div>
    </div>
  );
};

// === COMPONENT CON: THẺ SỰ KIỆN (Event Block) ===
const EventBlock = ({ event, onClick }) => {
  const getColor = (type) => {
    switch (type) {
        case 'MAINTENANCE': return { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-800" };
        case 'BATTERY_REPLACEMENT': return { bg: "bg-red-100", border: "border-red-500", text: "text-red-800" };
        case 'ENGINE_REPAIR': 
        case 'GENERAL_REPAIR': return { bg: "bg-orange-100", border: "border-orange-500", text: "text-orange-800" };
        default: return { bg: "bg-gray-100", border: "border-gray-500", text: "text-gray-800" };
    }
  };

  const style = getColor(event.serviceType);
  
  // Tính toán vị trí top: (Giờ bắt đầu - Giờ mở cửa) * Chiều cao 1 slot
  const topPosition = (event.startHour - START_HOUR) * HOUR_HEIGHT; 
  const height = event.duration * HOUR_HEIGHT;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(event); }}
      className={`absolute left-1 right-1 rounded px-2 py-1 text-xs border-l-[3px] shadow-sm cursor-pointer hover:brightness-95 transition-all overflow-hidden z-10 ${style.bg} ${style.border}`}
      style={{ top: `${topPosition}px`, height: `${height - 2}px` }}
    >
      <div className={`font-bold ${style.text} truncate`}>
         {event.customerName || `Khách #${event.customerId}`}
      </div>
      <div className="text-gray-600 mt-0.5 truncate text-[10px] flex items-center gap-1">
         <HiOutlineTruck className="w-3 h-3" /> {event.licensePlate || `Xe #${event.vehicleId}`}
      </div>
      
      {/* Badge trạng thái */}
      <div className="absolute top-1 right-1">
         {event.status === 'PENDING' && <span className="w-2 h-2 bg-yellow-500 rounded-full block ring-2 ring-white" title="Chờ duyệt"></span>}
         {event.status === 'CONFIRMED' && <span className="w-2 h-2 bg-green-500 rounded-full block ring-2 ring-white" title="Đã duyệt"></span>}
      </div>
    </div>
  );
};

// === COMPONENT CON: MODAL CHI TIẾT ===
const AppointmentDetailModal = ({ appointment, onClose, onAccept, onCancel, stationsMap }) => {
    if (!appointment) return null;
    const navigate = useNavigate();  
    
    // Xử lý hiển thị thời gian (Trừ 7 tiếng nếu cần)
    const formatDate = (dateInput) => {
        if (!dateInput) return "---";
        const date = new Date(dateInput);
        const compensatedDate = new Date(date.getTime() - (7 * 60 * 60 * 1000)); // Bật dòng này nếu server trả về lệch giờ
        
        return compensatedDate.toLocaleString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusLabel = (status) => {
        const map = { 
            'PENDING': { text: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
            'CONFIRMED': { text: 'Đã xác nhận', color: 'text-green-600 bg-green-50 border-green-200' },
            'IN_PROGRESS': { text: 'Đang thực hiện', color: 'text-blue-600 bg-blue-50 border-blue-200' },
            'COMPLETED': { text: 'Hoàn thành', color: 'text-gray-600 bg-gray-50 border-gray-200' },
            'CANCELED': { text: 'Đã hủy', color: 'text-red-600 bg-red-50 border-red-200' }
        };
        return map[status] || { text: status, color: 'text-gray-600' };
    };

    const statusStyle = getStatusLabel(appointment.status);
    const stationName = stationsMap[appointment.serviceCenterId] || `Trạm ID: ${appointment.serviceCenterId}`;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4 transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-fadeInUp">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Chi tiết Lịch hẹn #{appointment.id}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"><HiX size={20}/></button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center border border-teal-100">
                            <HiOutlineUser size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">{appointment.customerName || `Khách hàng #${appointment.customerId}`}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <HiOutlineTruck /> 
                                <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700 border">
                                    {appointment.licensePlate || `Xe #${appointment.vehicleId}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div className="col-span-2">
                            <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Thời gian</span>
                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                <HiOutlineCalendar className="text-teal-500" /> {formatDate(appointment.appointmentDate)}
                            </div>
                        </div>
                         <div className="col-span-2">
                            <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Địa điểm</span>
                            <div className="flex items-center gap-2 font-medium text-blue-600">
                                <HiLocationMarker /> {stationName}
                            </div>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Loại dịch vụ</span>
                            <span className="font-semibold text-gray-800">{appointment.serviceType}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Trạng thái</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${statusStyle.color}`}>
                                {statusStyle.text}
                            </span>
                        </div>
                        {appointment.notes && (
                            <div className="col-span-2 pt-2 border-t border-gray-200 mt-2">
                                <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Ghi chú</span>
                                <p className="text-gray-600 italic bg-white p-2 rounded border border-gray-200">"{appointment.notes}"</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                    {appointment.status === 'PENDING' && (
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => onAccept(appointment.id)} className="bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition">
                                <HiCheck size={18} /> Tiếp nhận
                            </button>
                            <button onClick={() => onCancel(appointment.id)} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition">
                                <HiTrash size={18} /> Từ chối
                            </button>
                        </div>
                    )}
                    {(appointment.status === 'CONFIRMED' || appointment.status === 'IN_PROGRESS') && (
                        <button onClick={() => navigate(`/staff/order/${appointment.id}`)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-[0.98]">
                            <HiClipboardList size={20} /> Mở phiếu dịch vụ (Order)
                        </button>
                    )}
                    {(appointment.status === 'COMPLETED' || appointment.status === 'CANCELED') && (
                        <button onClick={onClose} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-bold text-sm transition">Đóng</button>
                    )}
                </div>
            </div>
        </div>
    );
}

// === COMPONENT CHÍNH: STAFF BOOKING CALENDAR ===
const StaffBookingCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [stationsMap, setStationsMap] = useState({}); // Lưu tên trạm
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const navigate = useNavigate();

  // Helper: Lấy ngày đầu tuần (Thứ 2)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };
  const currentWeekStart = getStartOfWeek(new Date(currentDate));

  // 1. HÀM FETCH DỮ LIỆU
  const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        
        // Gọi API song song: Lấy lịch hẹn & Danh sách trạm
        const [resAppt, resStation] = await Promise.all([
            api.get("/appointments/service-center/my-station", { headers: { Authorization: `Bearer ${token}` } }),
            api.get("/stations", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        // Xử lý Map trạm
        const sMap = {};
        if (resStation.data) {
            resStation.data.forEach(s => sMap[s.id] = s.name);
        }
        setStationsMap(sMap);

        // Xử lý Lịch hẹn
        const processedData = (resAppt.data || []).map(app => {
            // Xử lý Timezone nếu cần (Giả sử server trả về UTC)
            const dateObj = new Date(new Date(app.appointmentDate).getTime() - 7 * 3600 * 1000); 
           

            // Tính giờ bắt đầu (Decimal Hour: 9h30 -> 9.5)
            const startHour = dateObj.getHours() + dateObj.getMinutes() / 60;
            
            return {
                ...app,
                appointmentDate: dateObj,
                startHour: startHour,
                duration: 1.5, // Default duration
            };
        });
        setAppointments(processedData);

      } catch (error) {
        console.error("Lỗi tải lịch:", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 2. HÀM XỬ LÝ: DUYỆT LỊCH
  const handleAcceptAppointment = async (id) => {
      try {
          const token = localStorage.getItem("accessToken");
          await api.put(`/appointments/${id}/accept`, {}, { 
              headers: { Authorization: `Bearer ${token}` }
          });
          alert(`✅ Đã tiếp nhận lịch hẹn #${id}`);
          setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'CONFIRMED' } : app));
          setSelectedAppointment(null); 
      } catch (error) {
          alert("Không thể duyệt lịch hẹn.");
      }
  };

  // 3. HÀM XỬ LÝ: HỦY LỊCH
  const handleCancelAppointment = async (id) => {
      if(!window.confirm("Bạn chắc chắn muốn hủy/từ chối lịch hẹn này?")) return;
      try {
          const token = localStorage.getItem("accessToken");
          await api.put(`/appointments/${id}/status`, null, {
              headers: { Authorization: `Bearer ${token}` },
              params: { status: 'CANCELED' }
          });
          alert("Đã hủy lịch hẹn.");
          setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'CANCELED' } : app));
          setSelectedAppointment(null);
      } catch (error) {
          alert("Hủy thất bại");
      }
  };

  const daysOfWeek = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(currentWeekStart);
    day.setDate(day.getDate() + index);
    return {
        name: day.toLocaleDateString("vi-VN", { weekday: "short" }),
        dateStr: day.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        fullDate: day
    };
  });

  const getAppointmentsForDay = (dayDate) => {
    return appointments.filter(app => 
        app.appointmentDate.getDate() === dayDate.getDate() &&
        app.appointmentDate.getMonth() === dayDate.getMonth() &&
        app.appointmentDate.getFullYear() === dayDate.getFullYear() &&
        app.status !== 'CANCELED' 
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <CalendarHeader onCreate={() => alert("Chức năng tạo lịch nhanh đang phát triển...")} />
      
      <CalendarToolbar 
        currentWeekStart={currentWeekStart}
        onPrevWeek={() => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); }}
        onNextWeek={() => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); }}
        onToday={() => setCurrentDate(new Date())}
      />

      {loading ? (
         <div className="h-96 flex items-center justify-center text-gray-400 bg-white rounded-xl border"><p>Đang tải...</p></div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm relative">
            {/* Header Ngày */}
            <div className="grid grid-cols-8 divide-x divide-gray-200 bg-gray-50 border-b border-gray-200">
                <div className="py-3 text-center text-xs font-bold text-gray-400 pt-4 bg-gray-50/50">GMT+7</div> 
                {daysOfWeek.map((day, index) => {
                    const isToday = day.fullDate.toDateString() === new Date().toDateString();
                    return (
                        <div key={index} className={`py-3 text-center ${isToday ? 'bg-teal-50' : ''}`}>
                            <span className={`text-xs font-bold uppercase block ${isToday ? 'text-teal-600' : 'text-gray-500'}`}>{day.name}</span>
                            <span className={`text-sm font-bold block ${isToday ? 'text-teal-700' : 'text-gray-800'}`}>{day.dateStr}</span>
                        </div>
                    );
                })}
            </div>

            {/* Body Lịch */}
            <div className="grid grid-cols-8 divide-x divide-gray-200 relative overflow-y-auto h-[650px] scrollbar-thin">
                
                {/* Cột Giờ (Fixed CSS) */}
                <div className="bg-white sticky left-0 z-20 border-r border-gray-100 relative" style={{ marginTop: "-10px" }}>
                    {timeSlots.map((time, index) => (
                        <div key={index} className="h-20 text-right pr-3 relative">
                            <span className="text-xs text-gray-400 font-medium absolute top-0 right-3 -translate-y-1/2 bg-white px-1 z-10">
                                {time}
                            </span>
                            {/* Dòng kẻ ngang mờ bên trong cột giờ để dễ nhìn */}
                            <div className="absolute top-0 right-0 w-2 border-t border-gray-100"></div>
                        </div>
                    ))}
                </div>

                {/* 7 Cột Ngày */}
                {daysOfWeek.map((day, dIndex) => (
                    <div key={dIndex} className={`relative group hover:bg-gray-50 transition-colors ${dIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        {timeSlots.map((_, tIndex) => (
                            <div key={tIndex} className="h-20 border-b border-gray-100 border-dashed"></div>
                        ))}
                        
                        {getAppointmentsForDay(day.fullDate).map((appt) => (
                            <EventBlock 
                                key={appt.id} 
                                event={appt} 
                                onClick={(clickedAppt) => setSelectedAppointment(clickedAppt)} 
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
      )}

      <AppointmentDetailModal 
         appointment={selectedAppointment}
         stationsMap={stationsMap} // Truyền map trạm vào Modal
         onClose={() => setSelectedAppointment(null)}
         onAccept={handleAcceptAppointment}
         onCancel={handleCancelAppointment}
      />
    </div>
  );
};

export default StaffBookingCalendar;