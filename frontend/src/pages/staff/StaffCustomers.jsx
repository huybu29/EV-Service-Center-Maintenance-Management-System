import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../../services/api";
import { db, collection, query, onSnapshot, orderBy, addDoc, serverTimestamp , where} from "../../services/firebase"; 
import { AuthContext } from "../../services/AuthContext";
import {
  HiOutlineSearch,
  HiPlus,
  HiOutlinePencil,
  HiOutlineDotsVertical,
  HiOutlinePaperAirplane,
  HiUser,
  HiTruck,
  HiOutlineChatAlt,
  HiExclamation,
  HiOutlineClock
} from "react-icons/hi";

// ==================== COMPONENT HELPER ====================
const InfoItem = ({ label, value, mono = false }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className={`font-medium ${mono ? "font-mono text-xs" : ""}`}>{value || "---"}</p>
  </div>
);

// ==================== Customer List ====================
const CustomerList = ({ customers, selectedId, onSelect, searchTerm, onSearch, loading }) => (
  <div className="w-full md:w-1/4 lg:w-1/5 bg-white border-r border-gray-200 flex flex-col h-full">
    <div className="p-4 border-b border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <HiUser className="text-blue-600"/> Danh sách Khách hàng
      </h2>
      <div className="relative">
        <HiOutlineSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm kiếm tên, email..."
          value={searchTerm}
          onChange={onSearch}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {loading ? (
         <div className="flex justify-center items-center h-20 text-gray-400 text-sm">Loading...</div>
      ) : customers.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
            <HiExclamation size={24} className="mb-2 opacity-50"/>
            Không tìm thấy khách hàng
         </div>
      ) : (
       customers.map((customer) => (
        <button
          key={customer.id}
          onClick={() => onSelect(customer)}
          className={`w-full flex items-center p-3 rounded-lg text-left transition group ${
            selectedId === customer.id ? "bg-blue-50 shadow-sm border-blue-100 border" : "hover:bg-gray-50 border border-transparent"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase transition ${
             selectedId === customer.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
          }`}>
             {customer.fullName ? customer.fullName.charAt(0) : "U"}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <h3 className={`font-semibold text-sm truncate ${selectedId === customer.id ? "text-blue-800" : "text-gray-800"}`}>{customer.fullName}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p className="text-xs text-gray-500 truncate">Online</p>
            </div>
          </div>
        </button>
      )))}
    </div>
    <div className="p-4 border-t border-gray-200">
      <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition transform active:scale-95">
        <HiPlus className="w-5 h-5" /> Thêm Khách hàng
      </button>
    </div>
  </div>
);

// ==================== Customer Details ====================
const CustomerDetails = ({ customer, vehicles, loadingDetails }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!customer) return (
    <div className="w-full md:w-1/2 lg:w-2/5 bg-gray-50 h-full flex flex-col items-center justify-center text-gray-400 border-r border-gray-200">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-300">
          <HiUser size={40}/>
      </div>
      <p>Chọn một khách hàng để xem chi tiết.</p>
    </div>
  );

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 bg-white h-full overflow-y-auto flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl uppercase shadow-inner">
                 {customer.fullName ? customer.fullName.charAt(0) : "U"}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{customer.fullName}</h2>
                <p className="text-sm text-gray-600">{customer.email}</p>
                <p className="text-sm text-blue-600 font-medium">{customer.phone}</p>
              </div>
            </div>
            <button className="p-2 text-gray-500 bg-white border border-gray-200 rounded-full hover:bg-gray-100 hover:text-blue-600 transition shadow-sm">
              <HiOutlinePencil className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            <button onClick={() => setActiveTab("info")} className={`pb-2 text-sm font-medium transition border-b-2 ${activeTab === "info" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Thông tin Xe ({vehicles.length})</button>
            <button onClick={() => setActiveTab("history")} className={`pb-2 text-sm font-medium transition border-b-2 ${activeTab === "history" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Lịch sử Dịch vụ</button>
          </div>
      </div>

      {/* Nội dung Tab */}
      <div className="p-6 flex-1 bg-gray-50 overflow-y-auto">
          {activeTab === "info" && (
            <div className="space-y-4">
               {loadingDetails ? <div className="text-center py-10 text-gray-400 text-sm">Đang tải thông tin xe...</div> : 
                vehicles.length === 0 ? <div className="text-center py-10 text-gray-400 italic border-2 border-dashed rounded-xl text-sm">Khách hàng chưa có xe nào.</div> :
                vehicles.map(vehicle => (
                    <div key={vehicle.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><HiTruck size={20}/></div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{vehicle.licensePlate}</h3>
                                    <p className="text-xs text-gray-500 uppercase font-bold">{vehicle.brand}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{vehicle.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                            <InfoItem label="Model" value={vehicle.model} />
                            <InfoItem label="Năm SX" value={vehicle.manufactureYear} />
                            <InfoItem label="Odometer" value={`${vehicle.currentMileage?.toLocaleString()} km`} />
                            <InfoItem label="Pin" value={vehicle.batteryType} />
                            <InfoItem label="VIN" value={vehicle.licensePlate} mono />
                        </div>
                    </div>
                ))
               }
            </div>
          )}
          
          {activeTab === "history" && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <HiOutlineClock size={40} className="mb-2 opacity-50"/>
                <p>Lịch sử dịch vụ đang được cập nhật.</p>
            </div>
          )}
      </div>
    </div>
  );
};

// ==================== Chat Window ====================
const ChatWindow = ({ customer, currentStaff }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Room chung cho tất cả Staff + Customer
  const chatRoomId = customer ? `chat_customer_${customer.id}` : null;

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  // Lắng nghe realtime
  useEffect(() => {
    if (!customer || !chatRoomId) {
        setMessages([]);
        return;
    }
    const q = query(
        collection(db, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, snapshot => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        scrollToBottom();
    }, console.error);
    return () => unsubscribe();
  }, [customer, chatRoomId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !chatRoomId) return;

    const msg = {
      chatRoomId,
      senderId: currentStaff.id,
      senderName: currentStaff.fullName,
      senderRole: "STAFF",
      content: newMessage,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "messages"), msg);
      setNewMessage("");
    } catch (e) {
      console.error("Lỗi gửi tin nhắn", e);
    }
  };

  if (!customer) return (
    <div className="w-full md:w-1/4 lg:w-2/5 bg-gray-50 h-full flex flex-col items-center justify-center text-gray-400 border-l border-gray-200">
      <div className="bg-white p-6 rounded-full shadow-sm mb-4"><HiOutlineChatAlt size={40} className="text-blue-200"/></div>
      <p>Chọn khách hàng để chat.</p>
    </div>
  );

  return (
    <div className="w-full md:w-1/4 lg:w-2/5 bg-white border-l border-gray-200 h-full flex flex-col shadow-xl z-10">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm z-10">
        <div>
          <h2 className="font-bold text-gray-900">{customer.fullName}</h2>
          <p className="text-xs text-green-600 flex items-center font-medium"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span> Online</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600"><HiOutlineDotsVertical className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm italic"><p>Chưa có tin nhắn.</p></div>}

        {messages.map((msg, index) => {
             const isMe = msg.senderId === currentStaff.id;
             return (
                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
                        {!isMe && <p className="text-[10px] font-bold text-gray-500 mb-1">{msg.senderName || `Staff ID ${msg.senderId}`}</p>}
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}></p>
                    </div>
                </div>
             );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center bg-gray-100 border border-transparent rounded-full px-2 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-3 text-sm outline-none bg-transparent"
          />
          <button onClick={handleSend} disabled={!newMessage.trim()} className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition">
            <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const StaffCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { user } = useContext(AuthContext);

  const currentStaff = user;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await api.get("/users/role/ROLE_CUSTOMER", { headers: { Authorization: `Bearer ${token}` } });
        setCustomers(res.data);
        setFilteredCustomers(res.data);
        setLoading(false);
        if (res.data.length > 0 && !selectedCustomer) handleSelectCustomer(res.data[0]);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const result = customers.filter(c =>
      c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(result);
  }, [searchTerm, customers]);

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingDetails(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await api.get(`/vehicles/customer/${customer.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedVehicles(res.data);
    } catch (e) {
      console.error(e);
      setSelectedVehicles([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ maxHeight: 'calc(100vh - 64px)' }}>
      <CustomerList
        customers={filteredCustomers}
        selectedId={selectedCustomer?.id}
        onSelect={handleSelectCustomer}
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
        loading={loading}
      />
      <CustomerDetails
        customer={selectedCustomer}
        vehicles={selectedVehicles}
        loadingDetails={loadingDetails}
      />
      <ChatWindow
        customer={selectedCustomer}
        currentStaff={currentStaff}
      />
    </div>
  );
};

export default StaffCustomers;
