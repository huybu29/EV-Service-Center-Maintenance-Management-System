import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  HiOutlinePrinter,
  HiOutlineSave,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineTruck,
  HiCurrencyDollar,
  HiOutlineExclamation,
  HiOutlineIdentification,
  HiOutlineUserAdd
} from "react-icons/hi";

const StaffServiceTicketDetail = () => {
  const { id: appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);

  // --- STATE DỮ LIỆU ---
  const [orderData, setOrderData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);

  // State Form check-in (nếu cần sửa)
  const [checkInData, setCheckInData] = useState({ soc: "", odometer: "" });
  const [items, setItems] = useState([]); 
  const [newItemInput, setNewItemInput] = useState("");

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        // BƯỚC 1: Lấy Order
        const orderRes = await api.get(`/orders/by-appointment/${appointmentId}`, { headers });
        const order = orderRes.data;
        setOrderData(order);

        // BƯỚC 2: Gọi song song
        const promises = [
           api.get(`/vehicles/${order.vehicleId}`, { headers }),
           api.get(`/users/${order.customerId}`, { headers }),
           api.get(`/appointments/${appointmentId}`, { headers }),
           api.get(`/users/role/ROLE_TECHNICIAN`, { headers })
        ];

        // Nếu đã có technicianId, gọi thêm API lấy thông tin thợ đã gán
        if (order.technicianId) {
            promises.push(api.get(`/users/${order.technicianId}`, { headers }));
        }

        const results = await Promise.all(promises);
        
        setVehicleData(results[0].data);
        setCustomerData(results[1].data);
        setAppointmentData(results[2].data);
        setTechnicians(results[3].data || []);
        
        if (order.technicianId) setTechnician(results[4].data);

        // Fill odometer
        if (results[0].data?.currentMileage) {
            setCheckInData(prev => ({ ...prev, odometer: results[0].data.currentMileage }));
        }

        setLoading(false);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        if (error.response?.status === 404) {
             alert("Chưa tìm thấy phiếu dịch vụ. Vui lòng tạo mới.");
             navigate("/staff/appointments");
        }
      }
    };

    if (appointmentId) fetchOrderDetails();
  }, [appointmentId]);

  // --- CÁC HÀM XỬ LÝ ---
  const handleGoToPayment = () => navigate(`/staff/payments/${orderData.id}`);
  
  const handleAddItem = (e) => {
      if (e.key === "Enter" && newItemInput.trim() !== "") {
          setItems([...items, newItemInput.trim()]);
          setNewItemInput(""); 
      }
  };
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleAssignTech = async () => {
      if(!selectedTech) return alert("Vui lòng chọn nhân viên!");
      try {
          const token = localStorage.getItem("accessToken");
          await api.put(`/orders/${orderData.id}/assign`, null, {
              headers: { Authorization: `Bearer ${token}` },
              params: { technicianId: selectedTech.id }
          });
          alert(`✅ Đã phân công KTV ${selectedTech.fullName} thành công!`);
          setTechnician(selectedTech); // Cập nhật hiển thị
          setActiveTab(3); 
      } catch (err) {
          console.error(err);
          alert("Lỗi khi phân công kỹ thuật viên.");
      }
  };

  const calculateTotalPartsCost = () => {
      if (!orderData?.checklistItems) return 0;
      let total = 0;
      orderData.checklistItems.forEach(item => {
          if (item.parts) item.parts.forEach(p => total += p.subTotal);
      });
      return total;
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
          case 'CANCELED': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Đang tải dữ liệu...</div>;
  if (!orderData) return <div className="h-screen flex items-center justify-center text-red-500">Không tìm thấy dữ liệu.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition"><HiOutlineArrowLeft size={24}/></button>
            <h1 className="text-2xl font-bold text-gray-900">Phiếu Dịch Vụ #{orderData.id}</h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(orderData.status)}`}>{orderData.status}</span>
          </div>
          <p className="text-gray-500 text-sm mt-2 ml-9 flex items-center gap-3">
             <span className="flex items-center gap-1"><HiOutlineClipboardList className="text-gray-400"/> {orderData.serviceType}</span>
             <span className="text-gray-300">|</span>
             <span className="flex items-center gap-1"><HiOutlineCalendar className="text-gray-400"/> {new Date(orderData.startDate || appointmentData.appointmentDate).toLocaleString('vi-VN')}</span>
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition">
            <HiOutlinePrinter size={18}/> In Phiếu
          </button>
          
          {orderData.status === 'COMPLETED' ? (
              <button onClick={handleGoToPayment} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-md flex items-center gap-2 transition transform active:scale-95 animate-pulse">
                  <HiCurrencyDollar size={20} /> Thanh toán & Bàn giao
              </button>
          ) : (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2 transition">
                  <HiOutlineSave size={18}/> Lưu cập nhật
              </button>
          )}
        </div>
      </header>

      {/* TABS */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {["1. Thông tin tiếp nhận", "2. Chỉ định nhân sự", "3. Chi tiết & Tiến độ"].map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index + 1)}
                className={`pb-3 text-sm font-bold border-b-[3px] transition-colors ${
                  activeTab === index + 1 ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
          ))}
        </nav>
      </div>

      {/* CONTENT */}
      <div className="space-y-6">
        
        {/* TAB 1: THÔNG TIN CHUNG */}
        {activeTab === 1 && (
            <div className="animate-fadeIn space-y-6">
                {/* Thông tin hồ sơ */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full block"></span> Hồ sơ tiếp nhận
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                        
                        {/* Xe */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-600 uppercase border-b border-dashed pb-1">Thông tin Xe</h4>
                            <div><label className="block text-xs text-gray-400 mb-0.5">Biển số</label><div className="font-bold text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{vehicleData?.licensePlate}</div></div>
                            <div><label className="block text-xs text-gray-400 mb-0.5">Dòng xe</label><div className="text-sm text-gray-700">{vehicleData?.brand} {vehicleData?.model}</div></div>
                        </div>

                        {/* Khách */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-600 uppercase border-b border-dashed pb-1">Khách hàng</h4>
                            <div><label className="block text-xs text-gray-400 mb-0.5">Họ và tên</label><div className="font-bold text-gray-900">{customerData?.fullName}</div></div>
                            <div><label className="block text-xs text-gray-400 mb-0.5">Liên hệ</label><div className="text-sm text-gray-700">{customerData?.phone}</div></div>
                        </div>

                        {/* Ghi chú */}
                        <div className="lg:col-span-1 md:col-span-2 space-y-4">
                             <h4 className="text-sm font-bold text-gray-600 uppercase border-b border-dashed pb-1">Yêu cầu dịch vụ</h4>
                             <textarea value={orderData.notes || appointmentData.notes || "Không có ghi chú"} readOnly className="w-full h-24 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none resize-none"/>
                        </div>
                    </div>
                </div>

                {/* Check-in Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-2">
                        <span className="w-1 h-5 bg-orange-500 rounded-full block"></span> Tình trạng tiếp nhận
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">SOC (%)</label>
                            <div className="relative">
                                <input type="number" value={checkInData.soc} onChange={(e) => setCheckInData({...checkInData, soc: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 outline-none font-medium" placeholder="VD: 85"/>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Odometer (km)</label>
                            <div className="relative">
                                <input type="number" value={checkInData.odometer} onChange={(e) => setCheckInData({...checkInData, odometer: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 outline-none font-medium"/>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">km</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Tài sản khách để lại</label>
                        <div className="border border-gray-300 rounded-lg px-3 py-3 bg-white flex flex-wrap items-center gap-2 min-h-[50px]">
                            {items.map((item, index) => (
                                <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center gap-1 border border-gray-200">{item} <button onClick={() => handleRemoveItem(index)} className="text-gray-400 hover:text-red-500 font-bold">&times;</button></span>
                            ))}
                            <input type="text" value={newItemInput} onChange={(e) => setNewItemInput(e.target.value)} onKeyDown={handleAddItem} placeholder="+ Thêm..." className="flex-1 min-w-[150px] outline-none text-sm py-1 bg-transparent placeholder-gray-400"/>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB 2: CHỈ ĐỊNH NHÂN SỰ */}
        {activeTab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                {/* List Thợ */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-b pb-2">
                        <span className="w-1 h-5 bg-purple-500 rounded-full block"></span> Chọn Kỹ Thuật Viên
                    </h3>
                    {technicians.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">Không tìm thấy nhân viên kỹ thuật nào.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {technicians.map((tech) => (
                                <div key={tech.id} onClick={() => setSelectedTech(tech)} className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 ${selectedTech?.id === tech.id || technician?.id === tech.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}>
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg uppercase border border-gray-300">{tech.fullName ? tech.fullName.charAt(0) : "K"}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 truncate">{tech.fullName}</h4>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tech.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{tech.status}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 truncate">{tech.email}</p>
                                        <p className="text-xs text-blue-600 mt-1 font-medium">SĐT: {tech.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Panel Assign */}
                <div className="lg:col-span-1">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Xác nhận phân công</h3>
                        {selectedTech || technician ? (
                            <div className="text-center py-4">
                                <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500 font-bold text-3xl border-4 border-white shadow-md uppercase">
                                    {(selectedTech || technician).fullName.charAt(0)}
                                </div>
                                <h4 className="font-bold text-lg mt-3">{(selectedTech || technician).fullName}</h4>
                                <p className="text-gray-500 text-sm">{(selectedTech || technician).email}</p>
                                
                                {technician && <div className="mt-3 text-xs font-bold text-green-600 bg-green-50 py-1 rounded">Đang phụ trách</div>}
                                
                                <button onClick={handleAssignTech} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95">
                                    <HiOutlineUserAdd size={20} /> {technician ? "Thay đổi KTV" : "Giao việc ngay"}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg bg-gray-50">
                                <HiOutlineIdentification size={32} className="mx-auto mb-2 opacity-50"/>
                                <p>Vui lòng chọn KTV từ danh sách</p>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        )}

        {/* TAB 3: CHI TIẾT KỸ THUẬT & TIẾN ĐỘ */}
        {activeTab === 3 && (
            <div className="animate-fadeIn space-y-6">
                {/* Bảng Checklist & Vật tư */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Kết quả kiểm tra & Sửa chữa</h3>
                        <span className="text-sm text-gray-500">KTV phụ trách: <span className="font-bold text-blue-600">{technician?.fullName || "Chưa gán"}</span></span>
                    </div>

                    {(!orderData.checklistItems || orderData.checklistItems.length === 0) ? (
                        <div className="p-8 text-center text-gray-400 italic">Chưa có hạng mục kiểm tra nào.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {orderData.checklistItems.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            {item.status === 'PASSED' ? <HiOutlineCheckCircle className="text-green-500 w-6 h-6"/> : 
                                             item.status === 'FAILED' ? <HiOutlineExclamation className="text-red-500 w-6 h-6"/> : 
                                             <span className="w-6 h-6 rounded-full border-2 border-gray-300 block"></span>}
                                            <div>
                                                <p className="font-bold text-gray-900">{item.description}</p>
                                                {item.notes && <p className="text-xs text-gray-500 italic mt-0.5">Ghi chú: "{item.notes}"</p>}
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.status === 'PASSED' ? 'bg-green-50 text-green-700 border-green-200' : item.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-100 text-gray-500'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    {item.parts && item.parts.length > 0 && (
                                        <div className="ml-9 mt-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                            <p className="text-xs font-bold text-blue-800 uppercase mb-2">Vật tư thay thế</p>
                                            <ul className="space-y-1">
                                                {item.parts.map(part => (
                                                    <li key={part.id} className="flex justify-between text-sm text-blue-900 border-b border-blue-100 last:border-0 pb-1 last:pb-0">
                                                        <span>• {part.partName} <span className="text-blue-400 text-xs">({part.partCode})</span></span>
                                                        <span className="font-mono font-bold">x{part.quantity} = {part.subTotal.toLocaleString()}đ</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-4">
                        <span className="text-gray-500 text-sm uppercase font-bold">Tổng chi phí ước tính:</span>
                        <span className="text-2xl font-extrabold text-blue-600">{orderData.totalCost?.toLocaleString()} đ</span>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <h3 className="text-base font-bold text-gray-800 mb-4 border-b pb-2">Timeline Trạng thái</h3>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Đã tạo: <strong>{new Date(orderData.startDate || appointmentData.appointmentDate).toLocaleString()}</strong></span>
                        </div>
                        {orderData.endDate ? (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-gray-600">Hoàn tất: <strong>{new Date(orderData.endDate).toLocaleString()}</strong></span>
                            </div>
                        ) : (
                             <div className="flex items-center gap-3 text-sm opacity-50">
                                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                <span className="text-gray-500">Chưa hoàn tất</span>
                            </div>
                        )}
                     </div>
                     <div className="mt-8 p-4 bg-gray-50 rounded text-center text-gray-500 text-sm italic">
                        Trạng thái hiện tại: <strong className="text-gray-800 uppercase">{orderData.status}</strong>
                     </div>
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default StaffServiceTicketDetail;