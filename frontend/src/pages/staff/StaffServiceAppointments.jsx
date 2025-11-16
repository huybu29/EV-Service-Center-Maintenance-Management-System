import React, { useState, useEffect } from "react";

// === DỮ LIỆU GIẢ (MOCK DATA) ===
const mockData = {
  pending: [
    {
      id: 1,
      model: "VinFast VF8",
      plate: "75A-123.45",
      customer: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/80?u=1",
      service: "Bảo dưỡng định kỳ",
    },
    {
      id: 2,
      model: "Kia EV6",
      plate: "29B-678.90",
      customer: "Trần Thị B",
      avatar: "https://i.pravatar.cc/80?u=2",
      service: "Kiểm tra pin",
    },
    {
      id: 3,
      model: "Hyundai Ioniq 5",
      plate: "51F-112.21",
      customer: "Lê Văn C",
      avatar: "https://i.pravatar.cc/80?u=3",
      service: "Cập nhật phần mềm",
    },
  ],
  inProgress: [
    {
      id: 4,
      model: "VinFast VF9",
      plate: "30K-555.88",
      customer: "Phạm Thị D",
      avatar: "https://i.pravatar.cc/80?u=4",
      service: "Sửa chữa hệ thống treo",
    },
  ],
  waitingForParts: [
    {
      id: 5,
      model: "Tesla Model 3",
      plate: "92A-444.11",
      customer: "Võ Văn E",
      avatar: "https://i.pravatar.cc/80?u=5",
      service: "Đợi cảm biến ABS",
    },
  ],
  completed: [
    {
      id: 6,
      model: "Porsche Taycan",
      plate: "43A-987.65",
      customer: "Hoàng Thị F",
      avatar: "https://i.pravatar.cc/80?u=6",
      service: "Đã hoàn thành bảo dưỡng",
    },
  ],
};

// --- COMPONENT CON ---

// Component Thẻ Lịch hẹn (Đã xóa icon)
const AppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        {/* Thông tin xe */}
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {appointment.model}
          </p>
          <p className="text-base font-bold text-gray-900 my-1">
            {appointment.plate}
          </p>
          <p className="text-sm text-gray-600">{appointment.customer}</p>
        </div>
        {/* Avatar */}
        <img
          src={appointment.avatar}
          alt={appointment.customer}
          className="w-10 h-10 rounded-full"
        />
      </div>
      {/* Thông tin dịch vụ (Đã xóa icon) */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-700">{appointment.service}</span>
      </div>
    </div>
  );
};

// Component Cột Kanban
const KanbanColumn = ({ title, count, bgColor, children }) => {
  return (
    <div className={`flex flex-col ${bgColor} rounded-lg p-4`}>
      {/* Header cột */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className="bg-white text-gray-700 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full border border-gray-200">
          {count}
        </span>
      </div>
      {/* Thẻ */}
      <div className="space-y-4 overflow-y-auto">{children}</div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---

const StaffServiceAppointments = () => {
  const [appointments, setAppointments] = useState({
    pending: [],
    inProgress: [],
    waitingForParts: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAppointments(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Đang tải lịch hẹn...</div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cột 1: Chờ Tiếp Nhận */}
        <KanbanColumn
          title="Chờ Tiếp Nhận"
          count={appointments.pending.length}
          bgColor="bg-gray-100"
        >
          {appointments.pending.map((app) => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </KanbanColumn>

        {/* Cột 2: Đang Thực Hiện */}
        <KanbanColumn
          title="Đang Thực Hiện"
          count={appointments.inProgress.length}
          bgColor="bg-yellow-100"
        >
          {appointments.inProgress.map((app) => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </KanbanColumn>

        {/* Cột 3: Chờ Phụ Tùng */}
        <KanbanColumn
          title="Chờ Phụ Tùng"
          count={appointments.waitingForParts.length}
          bgColor="bg-orange-100"
        >
          {appointments.waitingForParts.map((app) => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </KanbanColumn>

        {/* Cột 4: Hoàn Tất */}
        <KanbanColumn
          title="Hoàn Tất"
          count={appointments.completed.length}
          bgColor="bg-green-100"
        >
          {appointments.completed.map((app) => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </KanbanColumn>
      </div>
    </div>
  );
};

export default StaffServiceAppointments;