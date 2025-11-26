import React from "react";
// Thay đổi import từ lucide-react sang react-icons/fi
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiInfo 
} from "react-icons/fi";

const StaffDashboard = () => {
  // === 1. DỮ LIỆU GIẢ (MOCK DATA) ===
  const stats = [
    { title: "Tổng số lịch hẹn", value: "25", trend: "+5%", isPositive: true },
    { title: "Xe đang chờ", value: "8", trend: "+2%", isPositive: true },
    { title: "Xe đang sửa chữa", value: "12", trend: "-3%", isPositive: false },
    { title: "Doanh thu tạm tính", value: "150M", trend: "+8%", isPositive: true },
  ];

  const queueData = [
    {
      plate: "51K-123.45",
      customer: "Trần Thị B",
      time: "09:30 AM",
      status: "Đang sửa chữa",
      advisor: "Lê Văn C",
    },
    {
      plate: "30H-678.90",
      customer: "Phạm Minh D",
      time: "10:00 AM",
      status: "Chờ phụ tùng",
      advisor: "Nguyễn Văn A",
    },
    {
      plate: "60A-112.23",
      customer: "Võ Hoàng E",
      time: "10:15 AM",
      status: "Hoàn thành",
      advisor: "Lê Văn C",
    },
    {
      plate: "29C-555.88",
      customer: "Đặng Thu F",
      time: "11:00 AM",
      status: "Đang chờ",
      advisor: "Nguyễn Văn A",
    },
  ];

  const notifications = [
    {
      type: "error", // Đỏ
      title: "Tiến độ sửa chữa trễ",
      desc: "Xe 51K-123.45 đã trễ 30 phút so với dự kiến.",
      time: "Now",
    },
    {
      type: "warning", // Vàng
      title: "Lịch hẹn sắp tới",
      desc: "Lịch hẹn của Đặng Thu F sẽ bắt đầu trong 15 phút.",
      time: "15m",
    },
    {
      type: "info", // Xanh dương
      title: "Phụ tùng đã về",
      desc: "Phụ tùng cho xe 30H-678.90 đã có tại kho.",
      time: "1h",
    },
  ];

  // === 2. HELPER FUNCTION: Màu sắc cho trạng thái ===
  const getStatusStyle = (status) => {
    switch (status) {
      case "Đang sửa chữa":
        return "bg-blue-100 text-blue-700";
      case "Chờ phụ tùng":
        return "bg-orange-100 text-orange-700";
      case "Hoàn thành":
        return "bg-green-100 text-green-700";
      case "Đang chờ":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* === SECTION 1: CARDS THỐNG KÊ === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">{item.title}</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">{item.value}</span>
              <span className={`flex items-center text-sm font-bold mb-1 ${item.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {/* Sử dụng Icon từ react-icons */}
                {item.isPositive ? <FiTrendingUp size={18} className="mr-1" /> : <FiTrendingDown size={18} className="mr-1" />}
                {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* === SECTION 2: LAYOUT CHÍNH (2 Cột) === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: Bảng Hàng chờ Dịch vụ (Chiếm 2 phần) */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hàng chờ Dịch vụ Hôm nay</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Biển số xe</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên khách hàng</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian hẹn</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cố vấn phụ trách</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {queueData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-700">{row.plate}</td>
                      <td className="p-4 text-gray-600">{row.customer}</td>
                      <td className="p-4 text-gray-500">{row.time}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">{row.advisor}</td>
                      <td className="p-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-bold">Chi tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Cảnh báo & Thông báo (Chiếm 1 phần) */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cảnh báo & Thông báo</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <div className="divide-y divide-gray-100">
              {notifications.map((noti, idx) => (
                <div key={idx} className="p-4 flex gap-4 items-start hover:bg-gray-50 rounded-lg transition-colors">
                  {/* Render Icon dựa trên Type */}
                  <div className="flex-shrink-0 mt-1">
                    {noti.type === 'error' && <FiAlertCircle className="text-red-500" size={24} />}
                    {noti.type === 'warning' && <FiAlertTriangle className="text-orange-500" size={24} />}
                    {noti.type === 'info' && <FiInfo className="text-blue-500" size={24} />}
                  </div>
                  
                  {/* Nội dung text */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{noti.title}</h4>
                    <p className="text-sm text-gray-500 leading-snug">
                      {noti.desc.split(/( \d{1,2}[A-Z]-\d{3}\.\d{2} )/).map((part, i) => 
                        part.match(/\d{1,2}[A-Z]-\d{3}\.\d{2}/) ? <span key={i} className="font-bold text-gray-800">{part}</span> : part
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 text-center border-t border-gray-100 mt-2">
                <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">Xem tất cả thông báo</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;