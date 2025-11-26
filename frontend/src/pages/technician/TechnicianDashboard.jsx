import React from "react";
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiTruck, // Dùng biểu tượng xe tải/xe
  FiMoreHorizontal 
} from "react-icons/fi";

const TechnicianDashboard = () => {
  // === 1. DỮ LIỆU GIẢ (MOCK DATA) ===
  
  const stats = [
    { title: "Lịch hẹn hôm nay", value: "12", bg: "bg-white border-gray-100", text: "text-gray-900" },
    { title: "Xe đang bảo dưỡng", value: "8", bg: "bg-white border-gray-100", text: "text-gray-900" },
    { title: "Đã hoàn thành", value: "5", bg: "bg-white border-gray-100", text: "text-gray-900" },
    { title: "Công việc trễ hạn", value: "1", bg: "bg-orange-50 border-orange-200", text: "text-orange-600" },
  ];

  const tasks = [
    {
      id: 1,
      title: "Kiểm tra pin xe Vinfast VF8",
      plate: "51K-123.45",
      deadline: "Hôm nay",
      priority: "Ưu tiên cao",
      priorityClass: "bg-red-100 text-red-600",
      members: [
        "https://i.pravatar.cc/150?u=1",
        "https://i.pravatar.cc/150?u=2"
      ]
    },
    {
      id: 2,
      title: "Thay dầu phanh Tesla Model 3",
      plate: "30A-987.65",
      deadline: "Ngày mai",
      priority: "Ưu tiên TB",
      priorityClass: "bg-yellow-100 text-yellow-700",
      members: [
        "https://i.pravatar.cc/150?u=3"
      ]
    }
  ];

  const schedule = [
    { time: "09:00", ampm: "AM", customer: "Trần Thị B", service: "Bảo dưỡng định kỳ", status: "Đã xác nhận", statusClass: "bg-blue-100 text-blue-600" },
    { time: "10:30", ampm: "AM", customer: "Lê Văn C", service: "Kiểm tra phanh", status: "Chờ xử lý", statusClass: "bg-yellow-100 text-yellow-700" },
    { time: "02:00", ampm: "PM", customer: "Phạm Thị D", service: "Thay lốp", status: "Đã xác nhận", statusClass: "bg-blue-100 text-blue-600" },
    { time: "03:30", ampm: "PM", customer: "Vũ Minh E", service: "Sửa chữa nhỏ", status: "Check-in", statusClass: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* === HEADER === */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Chào buổi sáng, Nguyễn Văn A!</h1>
        <p className="text-gray-500 mt-1">Đây là tổng quan công việc của bạn hôm nay.</p>
      </div>

      {/* === STATS CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-sm border ${stat.bg}`}>
            <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
            <h3 className={`text-3xl font-bold ${stat.text}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* === MAIN CONTENT LAYOUT (2 COLUMNS) === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: CÔNG VIỆC ĐƯỢC GIAO (Chiếm 2 phần) --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Công việc được giao cho bạn</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">Xem tất cả</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                {/* Header Card */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-bold text-gray-800 text-base leading-tight">{task.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${task.priorityClass}`}>
                    {task.priority}
                  </span>
                </div>

                {/* Info */}
                <div className="text-sm text-gray-500 space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <FiTruck className="text-gray-400" />
                    <span>{task.plate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    <span>Hạn: {task.deadline}</span>
                  </div>
                </div>

                {/* Footer Card: Avatars + Button */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                  <div className="flex -space-x-2">
                    {task.members.map((avatar, idx) => (
                      <img 
                        key={idx} 
                        src={avatar} 
                        alt="Member" 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                      />
                    ))}
                  </div>
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-800">
                    Cập nhật
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CỘT PHẢI: LỊCH HẸN HÔM NAY (Chiếm 1 phần) --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Lịch hẹn hôm nay</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">Xem tất cả</button>
          </div>

          <div className="space-y-6">
            {schedule.map((item, index) => (
              <div key={index} className="flex gap-4 items-start group">
                {/* Time Box */}
                <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 rounded-lg w-14 h-14 flex-shrink-0">
                  <span className="text-sm font-bold">{item.time}</span>
                  <span className="text-[10px] font-medium uppercase">{item.ampm}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900">{item.customer}</h4>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.statusClass}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TechnicianDashboard;