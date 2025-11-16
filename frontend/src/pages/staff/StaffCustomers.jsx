import React, { useState } from "react";
import {
  HiOutlineSearch,
  HiPlus,
  HiOutlinePencil,
  HiOutlineDotsVertical,
  HiOutlinePaperAirplane,
} from "react-icons/hi";

// === DỮ LIỆU GIẢ (MOCK DATA) ===
const mockCustomers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    vehicle: "VinFast VF8",
    avatar: "https://i.pravatar.cc/80?u=1",
    email: "nguyenvana@email.com",
    unread: 1,
  },
  {
    id: 2,
    name: "Trần Thị B",
    vehicle: "Tesla Model 3",
    avatar: "https://i.pravatar.cc/80?u=2",
    email: "tranthib@email.com",
    unread: 0,
  },
  {
    id: 3,
    name: "Lê Văn C",
    vehicle: "Kia EV6",
    avatar: "https://i.pravatar.cc/80?u=3",
    email: "levanc@email.com",
    unread: 0,
  },
];

const mockCustomerDetails = {
  1: {
    vin: "VF8ABC123XYZ456",
    model: "VinFast VF8",
    color: "Xanh Dương",
    year: "2023",
    battery: 92,
    odometer: 15430,
    lastService: "25/04/2024",
  },
  2: {
    vin: "TSL456DEF789GHI",
    model: "Tesla Model 3",
    color: "Trắng",
    year: "2022",
    battery: 85,
    odometer: 22100,
    lastService: "15/03/2024",
  },
  3: {
    vin: "KIA789JKL012MNO",
    model: "Kia EV6",
    color: "Đỏ",
    year: "2023",
    battery: 95,
    odometer: 12500,
    lastService: "10/05/2024",
  },
};

const mockMessages = {
  1: [
    { id: 1, sender: "customer", text: "Chào bạn, xe của tôi có vẻ có báo lỗi pin, nhờ trung tâm kiểm tra giúp.", time: "10:30 AM" },
    { id: 2, sender: "staff", text: "Chào anh, EV Service đã nhận được thông tin. Anh vui lòng mang xe đến trung tâm để kỹ thuật viên kiểm tra chi tiết nhé.", time: "10:32 AM" },
    { id: 3, sender: "customer", text: "Ok, tôi sẽ đến vào chiều nay.", time: "10:35 AM" },
  ],
  2: [
    { id: 1, sender: "customer", text: "Tôi muốn đặt lịch bảo dưỡng.", time: "Hôm qua" },
  ],
  3: [
    { id: 1, sender: "staff", text: "Chào anh C, xe của anh đã sẵn sàng.", time: "09:00 AM" },
  ],
};
// =============================

// --- COMPONENT CON ---

// Cột 1: Danh sách Khách hàng
const CustomerList = ({ customers, selectedId, onSelect, searchTerm, onSearch }) => (
  <div className="w-full md:w-1/4 lg:w-1/5 bg-white border-r border-gray-200 flex flex-col h-full">
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách Khách hàng</h2>
      <div className="relative">
        <HiOutlineSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={onSearch}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto space-y-1 p-2">
      {customers.map((customer) => (
        <button
          key={customer.id}
          onClick={() => onSelect(customer.id)}
          className={`w-full flex items-center p-3 rounded-lg text-left transition ${
            selectedId === customer.id ? "bg-blue-50" : "hover:bg-gray-100"
          }`}
        >
          <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full" />
          <div className="ml-3 flex-1">
            <h3 className={`font-semibold text-sm ${
              selectedId === customer.id ? "text-blue-700" : "text-gray-800"
            }`}>
              {customer.name}
            </h3>
            <p className="text-xs text-gray-500">{customer.vehicle}</p>
          </div>
          {customer.unread > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {customer.unread}
            </span>
          )}
        </button>
      ))}
    </div>
    <div className="p-4 border-t border-gray-200">
      <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
        <HiPlus className="w-5 h-5" />
        Thêm Khách hàng
      </button>
    </div>
  </div>
);

// Cột 2: Chi tiết Khách hàng
const CustomerDetails = ({ customer, details }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!customer || !details) return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      Chọn một khách hàng để xem chi tiết.
    </div>
  );

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 bg-gray-50 h-full overflow-y-auto p-6">
      {/* Header Chi tiết */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={customer.avatar} alt={customer.name} className="w-14 h-14 rounded-full" />
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-sm text-gray-600">{customer.email}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100">
          <HiOutlinePencil className="w-4 h-4" />
          Chỉnh sửa
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="flex -mb-px space-x-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-2 px-1 text-sm font-medium ${
              activeTab === "info"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thông tin Xe
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-2 px-1 text-sm font-medium ${
              activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Lịch sử Dịch vụ
          </button>
        </nav>
      </div>

      {/* Nội dung Tab */}
      {activeTab === "info" && (
        <div className="mt-6 space-y-5">
          {/* Card Chi tiết xe */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Chi tiết xe</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <InfoItem label="Model" value={details.model} />
              <InfoItem label="Số VIN" value={details.vin} mono />
              <InfoItem label="Màu sắc" value={details.color} />
              <InfoItem label="Năm sản xuất" value={details.year} />
            </div>
          </div>
          {/* Card Tình trạng */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Tình trạng</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <InfoItem label="Tình trạng pin" value={`${details.battery}% (Tốt)`} color="text-green-600" />
              <InfoItem label="Số km đã đi" value={`${details.odometer.toLocaleString()} km`} />
              <InfoItem label="Bảo dưỡng gần nhất" value={details.lastService} />
            </div>
          </div>
        </div>
      )}
      {activeTab === "history" && (
        <div className="mt-6 text-center text-gray-500">
          <p>Lịch sử dịch vụ sẽ hiển thị ở đây.</p>
        </div>
      )}
    </div>
  );
};

// Cột 3: Chat
const ChatWindow = ({ customer, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  if (!customer) return (
    <div className="w-full md:w-1/4 lg:w-2/5 bg-white border-l border-gray-200 h-full flex flex-col items-center justify-center text-gray-500">
      <p>Chọn một khách hàng để bắt đầu chat.</p>
    </div>
  );
  
  const handleSend = () => {
    if(newMessage.trim()) {
        onSendMessage(newMessage);
        setNewMessage("");
    }
  }

  return (
    <div className="w-full md:w-1/4 lg:w-2/5 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header Chat */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="font-semibold text-gray-900">Chat với {customer.name}</h2>
          <p className="text-xs text-green-600 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            Đang hoạt động
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <HiOutlineDotsVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-center text-xs text-gray-400">Hôm nay</p>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender === 'staff'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'staff' ? 'text-blue-200' : 'text-gray-500'
              } text-right`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Chat */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2.5 text-sm focus:outline-none rounded-l-lg"
          />
          <button
            onClick={handleSend}
            className="p-3 text-blue-600 hover:text-blue-700"
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Item thông tin trong Card
const InfoItem = ({ label, value, color = "text-gray-800", mono = false }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-sm font-medium ${color} ${mono ? "font-mono" : ""}`}>
      {value}
    </p>
  </div>
);

// --- COMPONENT CHÍNH ---

const StaffCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(mockCustomers[0]?.id || null);
  const [messages, setMessages] = useState(mockMessages[selectedId] || []);

  const handleSelectCustomer = (id) => {
    setSelectedId(id);
    setMessages(mockMessages[id] || []);
  };

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCustomer = mockCustomers.find((c) => c.id === selectedId);
  const selectedDetails = mockCustomerDetails[selectedId];

  const handleSendMessage = (text) => {
    const newMessage = {
        id: messages.length + 1,
        sender: "staff",
        text: text,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    // Cần cập nhật lại mockMessages[selectedId] nếu muốn nó "persist" khi đổi tab
  }

  return (
    // Layout 3 cột, cố định chiều cao màn hình
    <div className="flex h-screen bg-gray-50" style={{maxHeight: 'calc(100vh - 64px)'}}> 
      {/* Giả sử header cao 64px */}
      
      <CustomerList
        customers={filteredCustomers}
        selectedId={selectedId}
        onSelect={handleSelectCustomer}
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
      />

      <CustomerDetails
        customer={selectedCustomer}
        details={selectedDetails}
      />

      <ChatWindow
        customer={selectedCustomer}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default StaffCustomers;