import React, { useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineExclamation,
} from "react-icons/hi";

// === DỮ LIỆU GIẢ (MOCK DATA) ===
const mockStats = {
  today: 12,
  inProgress: 8,
  completed: 5,
  overdue: 1,
};

const mockAppointments = [
  {
    id: 1,
    time: "09:00 AM",
    customer: "Trần Thị B",
    licensePlate: "51K-123.45",
    service: "Bảo dưỡng định kỳ",
    status: "Đã xác nhận",
  },
  {
    id: 2,
    time: "10:30 AM",
    customer: "Lê Văn C",
    licensePlate: "29A-678.90",
    service: "Kiểm tra hệ thống phanh",
    status: "Chờ xác nhận",
  },
  {
    id: 3,
    time: "02:00 PM",
    customer: "Phạm Thị D",
    licensePlate: "92G-112.23",
    service: "Thay lốp",
    status: "Đã xác nhận",
  },
];

const mockTasks = [
  {
    id: 1,
    title: "Kiểm tra pin xe",
    priority: "cao",
    description: "Kiểm tra toàn diện hệ thống pin và báo cáo tình trạng cho xe Vinfast VF8.",
    licensePlate: "51K-123.45",
    avatars: ["/avatar1.png", "/avatar2.png"],
    dueDate: "Hôm nay",
  },
  {
    id: 2,
    title: "Thay dầu phanh",
    priority: "trung bình",
    description: "Thực hiện thay dầu phanh theo quy trình tiêu chuẩn cho xe Tesla Model 3.",
    licensePlate: "30A-987.65",
    avatars: ["/avatar3.png"],
    dueDate: "2 ngày",
  },
  {
    id: 3,
    title: "Cập nhật phần mềm",
    priority: "thấp",
    description: "Cài đặt phiên bản phần mềm mới nhất cho hệ thống điều khiển của xe Porsche Taycan.",
    licensePlate: "92G-112.23",
    avatars: ["/avatar1.png", "/avatar4.png"],
    dueDate: "3 ngày",
  },
];
// =============================

// --- COMPONENT CON ---

// Thẻ Thống kê
const StatCard = ({ title, value, bgColor = "bg-white" }) => (
  <div
    className={`p-5 rounded-lg shadow-sm border border-gray-200 ${bgColor}`}
  >
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

// Thẻ Trạng thái Lịch hẹn
const StatusTag = ({ status }) => {
  const isConfirmed = status === "Đã xác nhận";
  const color = isConfirmed
    ? "text-blue-700 bg-blue-100"
    : "text-yellow-700 bg-yellow-100";
  const dotColor = isConfirmed ? "bg-blue-500" : "bg-yellow-500";

  return (
    <span
      className={`flex items-center gap-1.5 text-sm font-medium ${color} px-2.5 py-0.5 rounded-full w-fit`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor} inline-block`}></span>
      {status}
    </span>
  );
};

// Thẻ Ưu tiên Công việc
const PriorityTag = ({ priority }) => {
  let color;
  let text;
  switch (priority) {
    case "cao":
      color = "bg-red-100 text-red-700";
      text = "Ưu tiên cao";
      break;
    case "trung bình":
      color = "bg-yellow-100 text-yellow-700";
      text = "Ưu tiên trung bình";
      break;
    case "thấp":
      color = "bg-green-100 text-green-700";
      text = "Ưu tiên thấp";
      break;
    default:
      color = "bg-gray-100 text-gray-700";
      text = "Không";
  }
  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color}`}
    >
      {text}
    </span>
  );
};

// Thẻ Công việc
const TaskCard = ({ task }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800">{task.title}</h3>
        <PriorityTag priority={task.priority} />
      </div>
      <p className="text-sm text-gray-600 mb-4">{task.description}</p>
      <p className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md w-fit">
        Xe: {task.licensePlate}
      </p>
    </div>
    <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
      {/* (Placeholder cho Avatars) */}
      <div className="flex -space-x-2">
        <span className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium">
          A
        </span>
        <span className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white flex items-center justify-center text-xs font-medium">
          B
        </span>
      </div>
      <span className="flex items-center text-sm text-gray-500">
        <HiOutlineClock className="w-4 h-4 mr-1" />
        Hạn: {task.dueDate}
      </span>
    </div>
  </div>
);

// Tabs Lịch hẹn
const AppointmentTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Tất cả", "Chờ xác nhận", "Đã xác nhận"];
  return (
    <div className="flex items-center border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// --- COMPONENT CHÍNH ---

const StaffDashboardContent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tất cả");

  // Lọc lịch hẹn dựa trên tab
  const filteredAppointments = mockAppointments.filter((app) => {
    if (activeTab === "Tất cả") return true;
    return app.status === activeTab;
  });

  return (
    // Bỏ qua header (Search, Nút Tạo mới) vì nó thuộc về Layout
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Lời chào */}
      <h1 className="text-3xl font-bold text-gray-900">
        Chào buổi sáng, {user?.fullName || "Nguyễn Văn A"}!
      </h1>
      <p className="text-gray-600 mt-1">
        Đây là tổng quan công việc của bạn hôm nay.
      </p>

      {/* Thẻ Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard title="Lịch hẹn hôm nay" value={mockStats.today} />
        <StatCard title="Xe đang bảo dưỡng" value={mockStats.inProgress} />
        <StatCard title="Đã hoàn thành" value={mockStats.completed} />
        <StatCard
          title="Công việc trễ hạn"
          value={mockStats.overdue}
          bgColor="bg-yellow-100 border-yellow-300"
        />
      </div>

      {/* Lịch hẹn */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Lịch hẹn chờ xử lý
        </h2>
        <AppointmentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto mt-4">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 font-medium">Khách hàng</th>
                <th className="p-4 font-medium">Biển số xe</th>
                <th className="p-4 font-medium">Dịch vụ</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((app) => (
                <tr key={app.id}>
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {app.time}
                  </td>
                  <td className="p-4 text-sm text-gray-700">{app.customer}</td>
                  <td className="p-4 text-sm text-gray-700 font-mono">
                    {app.licensePlate}
                  </td>
                  <td className="p-4 text-sm text-gray-700">{app.service}</td>
                  <td className="p-4">
                    <StatusTag status={app.status} />
                  </td>
                  <td className="p-4 text-sm font-medium text-blue-600">
                    <button
                      onClick={() => navigate(`/staff/appointments/${app.id}`)}
                      className="hover:underline"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Công việc được giao */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Công việc được giao cho bạn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardContent;