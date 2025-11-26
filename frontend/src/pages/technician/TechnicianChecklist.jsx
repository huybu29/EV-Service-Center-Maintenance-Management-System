import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; 
import { 
  HiChevronDown, HiChevronUp, HiCheckCircle, HiXCircle, 
  HiPhotograph, HiPlus, HiSave, HiArrowLeft, HiCheck,
  HiSearch, HiX, HiShoppingCart, HiLightningBolt 
} from "react-icons/hi";

// --- COMPONENT 1: MODAL GỢI Ý TỰ ĐỘNG (AUTO SUGGEST) ---
const QuickAddPartModal = ({ isOpen, onClose, part, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !part) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                        <HiLightningBolt size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Phát hiện lỗi & Đề xuất vật tư</h3>
                        <p className="text-xs text-gray-500">Hệ thống tự động gợi ý phụ tùng phù hợp</p>
                    </div>
                </div>
                
                <div className="p-6 space-y-5">
                    {/* Thông tin phụ tùng */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex gap-4">
                         <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 font-bold border">IMG</div>
                         <div className="flex-1">
                            <h4 className="font-bold text-gray-900 leading-tight">{part.partName}</h4>
                            <p className="text-xs text-gray-500 mt-1">Mã: <span className="font-mono">{part.partCode}</span></p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium">Tồn: {part.quantity} {part.unit}</span>
                                <span className="font-bold text-blue-600">{part.price.toLocaleString()} đ</span>
                            </div>
                         </div>
                    </div>

                    {/* Chỉnh số lượng */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 text-center">Số lượng cần thay thế:</label>
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-xl hover:bg-gray-100 transition">-</button>
                            <input 
                                type="number" 
                                value={quantity} 
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="w-20 h-12 text-center border-2 border-blue-100 rounded-xl font-bold text-xl focus:border-blue-500 outline-none text-blue-600"
                            />
                            <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-xl hover:bg-gray-100 transition">+</button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition text-sm">Bỏ qua</button>
                    <button 
                        onClick={() => onConfirm(part, quantity)}
                        className="flex-[2] py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition transform active:scale-95 text-sm flex items-center justify-center gap-2"
                    >
                        <HiPlus /> Xác nhận Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT 2: MODAL TÌM THỦ CÔNG (Fallback) ---
const ManualSearchModal = ({ isOpen, onClose, onSelectPart }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const handleSearch = async () => {
        if(!searchTerm) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const res = await api.get(`/parts?search=${searchTerm}`, { headers: { Authorization: `Bearer ${token}` } });
            setSearchResults(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg h-[70vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Tìm Phụ Tùng Thủ Công</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500"><HiX size={24}/></button>
                </div>
                <div className="p-4 border-b bg-white flex gap-2">
                    <input 
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Gõ tên phụ tùng..." 
                        value={searchTerm} 
                        onChange={e=>setSearchTerm(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"><HiSearch /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                    {loading ? <div className="text-center text-gray-500 py-4">Đang tìm kiếm...</div> : 
                     searchResults.length === 0 ? <div className="text-center text-gray-400 py-4 italic">Không tìm thấy kết quả</div> :
                     searchResults.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm cursor-pointer transition" onClick={() => onSelectPart(p)}>
                            <div>
                                <div className="font-bold text-gray-800">{p.partName}</div>
                                <div className="text-xs text-gray-500">Mã: {p.partCode} | Tồn: {p.quantity}</div>
                            </div>
                            <div className="font-bold text-blue-600">{p.price.toLocaleString()} đ</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- COMPONENT CHÍNH ---
const TechnicianChecklist = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  
  const [checklist, setChecklist] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);
  const [tempNotes, setTempNotes] = useState({});

  // State quản lý Modal
  const [suggestedPart, setSuggestedPart] = useState(null);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [currentChecklistItemId, setCurrentChecklistItemId] = useState(null);

  // 1. Fetch Data (Giữ nguyên)
  const fetchData = async () => {
    try {
         const token = localStorage.getItem("accessToken");
         const headers = { Authorization: `Bearer ${token}` };
         const [orderRes, listRes] = await Promise.all([
            api.get(`/orders/${orderId}`, { headers }),
            api.get(`/orders/${orderId}/checklist`, { headers })
         ]);
         const vehicleRes = await api.get(`/vehicles/${orderRes.data.vehicleId}`, { headers });
         setOrderInfo({...orderRes.data, licensePlate: vehicleRes.data.licensePlate, model: `${vehicleRes.data.brand} ${vehicleRes.data.model}`});
         setChecklist(listRes.data);
         
         if (!expandedSection) {
            const firstPending = listRes.data.find(i => i.status === 'PENDING' || i.status === 'IN_PROGRESS');
            if (firstPending) setExpandedSection(firstPending.id);
         }
         setLoading(false);
    } catch(e) { console.error(e); setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, [orderId]);

  // 2. Logic Update Status & Auto Suggest
  const handleUpdateStatus = async (item, newStatus) => {
      try {
          const token = localStorage.getItem("accessToken");
          await api.put(`/orders/${orderId}/checklist/${item.id}`, null, {
              headers: { Authorization: `Bearer ${token}` },
              params: { status: newStatus }
          });
          
          setChecklist(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i));

          // LOGIC TỰ ĐỘNG GỢI Ý KHI FAILED
          if (newStatus === 'FAILED') {
              setCurrentChecklistItemId(item.id);
              try {
                  const res = await api.get(`/parts/suggest`, {
                      headers: { Authorization: `Bearer ${token}` },
                      params: { taskName: item.description }
                  });
                  if (res.data) {
                      setSuggestedPart(res.data);
                      setIsAutoModalOpen(true);
                  }
              } catch (err) {}
          } else if (newStatus === 'PASSED') {
              const currIdx = checklist.findIndex(i => i.id === item.id);
              if (currIdx < checklist.length - 1) setExpandedSection(checklist[currIdx + 1].id);
          }
      } catch (error) {
          alert("Cập nhật thất bại");
      }
  };

  // 3. Logic Thêm Phụ tùng (Dùng chung)
  const handleAddPartToOrder = async (part, quantity = 1) => {
      try {
          const token = localStorage.getItem("accessToken");
          await api.post(`/orders/${orderId}/parts`, { 
              partId: part.partId,
              quantity: parseInt(quantity),
              checklistItemId: currentChecklistItemId
          }, { headers: { Authorization: `Bearer ${token}` } });
          
          alert(`✅ Đã thêm "${part.partName}" (x${quantity}) vào đơn hàng!`);
          setIsAutoModalOpen(false);
          setIsManualModalOpen(false);
          
          fetchData(); // Reload để hiện list phụ tùng

      } catch (error) {
          const msg = error.response?.data?.message || "Lỗi server";
          alert(`Thêm thất bại: ${msg}`);
      }
  };

  const toggleSection = (id) => setExpandedSection(expandedSection === id ? null : id);
  
  const handleSaveNote = async (itemId) => {
      const noteToSave = tempNotes[itemId];
      if (noteToSave === undefined) return;
      try {
        const token = localStorage.getItem("accessToken");
        const currentItem = checklist.find(i => i.id === itemId);
        await api.put(`/orders/${orderId}/checklist/${itemId}`, null, {
            headers: { Authorization: `Bearer ${token}` },
            params: { status: currentItem.status, notes: noteToSave }
        });
        setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, notes: noteToSave } : item));
        alert("Đã lưu ghi chú!");
      } catch (error) { alert("Lưu ghi chú thất bại"); }
  };

  // 4. Logic Hoàn Tất (Đã sửa lỗi)
  const handleFinishChecklist = async () => {
      const pendingItems = checklist.filter(i => i.status === 'PENDING' || i.status === 'IN_PROGRESS');
      
      if (pendingItems.length > 0) {
          if(!window.confirm(`CẢNH BÁO: Còn ${pendingItems.length} mục chưa kiểm tra.\nBạn có chắc chắn muốn kết thúc và báo cáo hoàn thành không?`)) {
              return; 
          }
      } else {
           if(!window.confirm("Xác nhận hoàn thành toàn bộ công việc kiểm tra?")) {
              return;
          }
      }

      try {
          const token = localStorage.getItem("accessToken");
          await api.put(`/orders/${orderId}/status`, null, {
              headers: { Authorization: `Bearer ${token}` },
              params: { status: "COMPLETED" }
          });

          alert("✅ Đã báo cáo hoàn thành!");
          navigate("/technician/maintenance");

      } catch (error) {
          console.error("Lỗi hoàn thành:", error);
          alert("Lỗi khi gửi báo cáo hoàn thành.");
      }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Đang tải checklist...</div>;

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-6 font-sans text-gray-800">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"><HiArrowLeft size={20} /></button>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Lệnh sửa chữa #{orderId}</p>
                <h1 className="text-xl font-bold text-gray-900">{orderInfo?.licensePlate} - {orderInfo?.model}</h1>
            </div>
        </div>
        <button onClick={handleFinishChecklist} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md flex items-center gap-2 transition-all active:scale-95">
            <HiCheck /> Xong Kiểm tra
        </button>
      </header>

      {/* Checklist Items */}
      <div className="space-y-4 max-w-4xl mx-auto pb-20">
        {checklist.map((item, index) => {
          const isOpen = expandedSection === item.id;
          let statusColor = "bg-gray-100 text-gray-500";
          let statusIcon = null;
          if (item.status === 'PASSED') { statusColor = "bg-green-100 text-green-700 border-green-200"; statusIcon = <HiCheckCircle />; }
          else if (item.status === 'FAILED') { statusColor = "bg-red-100 text-red-700 border-red-200"; statusIcon = <HiXCircle />; }

          return (
            <div key={item.id} className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-blue-400 shadow-lg' : 'border-gray-200'}`}>
               <div onClick={() => toggleSection(item.id)} className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${item.status === 'FAILED' ? 'bg-red-50/30' : ''}`}>
                  <div className="flex gap-4 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.status === 'PENDING' ? 'bg-gray-200 text-gray-600' : item.status === 'PASSED' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{index + 1}</div>
                    <div>
                      <h3 className={`text-base font-bold ${isOpen ? 'text-blue-800' : 'text-gray-800'}`}>{item.description}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.notes ? <span className="italic text-gray-600">"{item.notes}"</span> : "Chưa có ghi chú"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                      {!isOpen && <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 border ${statusColor}`}>{statusIcon} {item.status}</span>}
                      <div className="text-gray-400">{isOpen ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}</div>
                  </div>
               </div>

               {isOpen && (
                <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-gray-50/30 animate-fadeIn">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
                    <span className="text-sm font-bold text-gray-600 uppercase">Kết quả:</span>
                    <div className="flex gap-3 flex-1 sm:justify-end">
                      <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item, 'FAILED'); }} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all border flex items-center justify-center gap-2 ${item.status === 'FAILED' ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105' : 'bg-white text-gray-500 border-gray-300 hover:border-red-300 hover:text-red-500'}`}><HiXCircle size={18} /> Không Đạt</button>
                      <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item, 'PASSED'); }} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all border flex items-center justify-center gap-2 ${item.status === 'PASSED' ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105' : 'bg-white text-gray-500 border-gray-300 hover:border-green-300 hover:text-green-500'}`}><HiCheckCircle size={18} /> Đạt</button>
                    </div>
                  </div>

                  {item.status === 'FAILED' && (
                      <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 animate-fadeIn">
                          <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-bold text-red-700 flex items-center gap-2"><HiShoppingCart /> Đề xuất thay thế phụ tùng</h4>
                              <button onClick={() => { setCurrentChecklistItemId(item.id); setIsManualModalOpen(true); }} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><HiPlus /> Tìm kiếm thủ công</button>
                          </div>
                          
                          {/* LIST VẬT TƯ ĐÃ THÊM */}
                          {item.parts && item.parts.length > 0 ? (
                              <div className="bg-white rounded-lg border border-red-100 overflow-hidden">
                                  {item.parts.map(p => (
                                      <div key={p.id} className="flex justify-between items-center p-3 border-b border-red-50 last:border-0">
                                          <div className="text-sm font-medium text-gray-800">{p.partName} <span className="text-gray-500 font-normal text-xs">({p.partCode})</span></div>
                                          <div className="text-sm font-bold text-red-600">x{p.quantity}</div>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <button onClick={() => { setCurrentChecklistItemId(item.id); setIsManualModalOpen(true); }} className="w-full py-3 border-2 border-dashed border-red-300 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition flex items-center justify-center gap-2 bg-white">
                                  <HiPlus /> Thêm phụ tùng ngay
                              </button>
                          )}
                      </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Ghi chú kỹ thuật</label>
                        <div className="relative">
                            <textarea rows={3} placeholder="Mô tả chi tiết hư hỏng..." value={tempNotes[item.id] !== undefined ? tempNotes[item.id] : (item.notes || "")} onChange={(e) => setTempNotes({...tempNotes, [item.id]: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white shadow-sm"></textarea>
                            {(tempNotes[item.id] !== undefined && tempNotes[item.id] !== item.notes) && (<button onClick={() => handleSaveNote(item.id)} className="absolute bottom-2 right-2 bg-blue-100 text-blue-600 hover:bg-blue-200 p-1.5 rounded-md transition text-xs font-bold flex items-center gap-1"><HiSave /> Lưu</button>)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Hình ảnh thực tế</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button onClick={() => alert("Tính năng upload ảnh đang phát triển!")} className="aspect-square rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 flex flex-col items-center justify-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer group"><div className="p-1.5 bg-white rounded-full text-blue-500 shadow-sm group-hover:scale-110 transition-transform"><HiPlus size={16} /></div><span className="text-[10px] font-bold text-blue-600">Upload</span></button>
                          <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-xs">Trống</div>
                        </div>
                      </div>
                  </div>
                </div>
               )}
            </div>
          );
        })}
      </div>

      {/* MODAL 1: AUTO SUGGEST */}
      <QuickAddPartModal isOpen={isAutoModalOpen} part={suggestedPart} onClose={() => setIsAutoModalOpen(false)} onConfirm={handleAddPartToOrder} />
      {/* MODAL 2: MANUAL SEARCH */}
      <ManualSearchModal isOpen={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} onSelectPart={(part) => { const qty = prompt(`Nhập số lượng cho "${part.partName}":`, "1"); if(qty) handleAddPartToOrder(part, qty); }} />
    </div>
  );
};

export default TechnicianChecklist;