import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; 
import { 
  HiDotsHorizontal, 
  HiX, 
  HiUser, 
  HiPhone, 
  HiMail, 
  HiPlay, 
  HiPhotograph, 
  HiPlus, 
  HiCheckCircle, 
  HiClock,
  HiClipboardList 
} from "react-icons/hi";

const TechnicianMaintenanceProcess = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  
  const navigate = useNavigate(); 

  // === 1. FETCH API ===
  useEffect(() => {
    const fetchMyTasks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/orders/my-orders", { 
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const mappedTasks = res.data.map(order => ({
            id: order.id,
            plate: order.vehicle?.licensePlate || `Xe #${order.vehicleId}`, 
            model: order.vehicle ? `${order.vehicle.brand} ${order.vehicle.model}` : "---",
            service: order.serviceType,
            status: order.status.toLowerCase(), 
            customer: {
                name: order.customer?.fullName || "Khách hàng",
                phone: order.customer?.phone || "---", 
                email: order.customer?.email || "---"
            },
            request: order.notes || "Không có ghi chú yêu cầu.",
            specs: {
                vin: order.vehicle?.vin || "---",
                year: order.vehicle?.manufactureYear || "---",
                odo: order.vehicle?.currentMileage ? `${order.vehicle.currentMileage.toLocaleString()} km` : "---",
                battery: order.vehicle?.batteryType || "---",
                color: "---" 
            },
            checklist: order.checklistItems || [],
            images: [] 
        }));

        setTasks(mappedTasks);
        if (mappedTasks.length > 0) setSelectedTask(mappedTasks[0]);

      } catch (error) {
        console.error("Lỗi tải danh sách công việc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  // --- HÀM XỬ LÝ: BẮT ĐẦU CÔNG VIỆC ---
  const handleStartJob = async () => {
    if (!selectedTask) return;
    try {
      const token = localStorage.getItem("accessToken");
      await api.put(`/orders/${selectedTask.id}/status`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: "IN_PROGRESS" }
      });
      
      alert("🚀 Đã bắt đầu công việc!");
      
      const updatedTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, status: "in_progress" } : t);
      setTasks(updatedTasks);
      setSelectedTask({ ...selectedTask, status: "in_progress" });
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi cập nhật trạng thái.");
    }
  };

  // --- HÀM XỬ LÝ: CHUYỂN TRANG CHECKLIST ---
  const handleOpenChecklist = () => {
      navigate(`/technician/checklist/${selectedTask.id}`);
  };

  // === UI HELPER ===
  const TaskCard = ({ task }) => {
    const statusColors = {
      pending: "bg-gray-100 text-gray-600 border-gray-200",
      in_progress: "bg-blue-50 text-blue-700 border-blue-200",
      completed: "bg-green-50 text-green-700 border-green-200",
    };
    const isSelected = selectedTask?.id === task.id;

    return (
      <div onClick={() => setSelectedTask(task)} className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all mb-3 bg-white hover:shadow-md ${isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"}`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-gray-900 text-base">{task.plate}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${statusColors[task.status] || statusColors.pending}`}>{task.status}</span>
        </div>
        <p className="text-sm text-gray-500 font-medium mb-1">{task.model}</p>
        <p className="text-xs text-gray-400 uppercase">{task.service}</p>
      </div>
    );
  };

  const KanbanColumn = ({ title, status, count }) => (
    <div className="flex-1 min-w-[280px] flex flex-col">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
          <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
        </div>
        <HiDotsHorizontal className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>
      <div className="bg-gray-50 rounded-xl p-2 flex-1 overflow-y-auto min-h-[200px]">
        {tasks.filter(t => t.status === status).map(task => <TaskCard key={task.id} task={task} />)}
        {tasks.filter(t => t.status === status).length === 0 && <div className="text-center py-10 text-gray-400 text-xs italic">Trống</div>}
      </div>
    </div>
  );

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">Đang tải...</div>;

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Left Side */}
      <div className="flex-1 p-6 flex flex-col overflow-hidden bg-gray-50 border-r border-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Công Việc Của Tôi</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các xe được phân công.</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
          <KanbanColumn title="Chờ Xử Lý" status="pending" count={tasks.filter(t=>t.status==='pending').length} />
          <KanbanColumn title="Đang Thực Hiện" status="in_progress" count={tasks.filter(t=>t.status==='in_progress').length} />
          <KanbanColumn title="Hoàn Tất" status="completed" count={tasks.filter(t=>t.status==='completed').length} />
        </div>
      </div>

      {/* Right Side */}
      {selectedTask ? (
        <aside className="w-[450px] bg-white shadow-xl flex flex-col h-full z-10">
          <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                 {selectedTask.plate.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTask.plate}</h2>
                <p className="text-sm text-gray-500">{selectedTask.model}</p>
              </div>
            </div>
            <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-red-500"><HiX size={24} /></button>
          </div>

          <div className="px-6 border-b border-gray-100 flex gap-8 bg-white sticky top-0 z-10">
            <button onClick={() => setActiveTab("info")} className={`py-4 text-sm font-bold border-b-[3px] transition-colors ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>Thông tin chung</button>
            <button onClick={() => setActiveTab("checklist")} className={`py-4 text-sm font-bold border-b-[3px] transition-colors ${activeTab === 'checklist' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>Checklist ({selectedTask.checklist.length})</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeTab === 'info' ? (
                <div className="space-y-6 animate-fadeIn">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><HiUser /> Khách hàng</h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Họ tên:</span> <span className="font-medium">{selectedTask.customer.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">SĐT:</span> <span className="font-medium text-blue-600">{selectedTask.customer.phone}</span></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><HiPlay className="rotate-90" size={12}/> Thông số kỹ thuật</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100"><span className="block text-xs text-gray-400 mb-1">VIN</span><span className="font-mono font-bold text-gray-800 break-all">{selectedTask.specs.vin}</span></div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100"><span className="block text-xs text-gray-400 mb-1">Odometer</span><span className="font-bold text-blue-600">{selectedTask.specs.odo}</span></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ghi chú yêu cầu</h3>
                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-gray-700 italic">"{selectedTask.request}"</div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-fadeIn">
                    {selectedTask.checklist.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">Chưa có hạng mục kiểm tra.</div>
                    ) : (
                        selectedTask.checklist.map((item, idx) => (
                            <div key={idx} className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition bg-white">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.status === 'PASSED' ? 'border-green-500 bg-green-50 text-green-600' : item.status === 'FAILED' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300'}`}>
                                        {item.status === 'PASSED' && <HiCheckCircle size={14} />}
                                        {item.status === 'FAILED' && <HiX size={14} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-800">{item.description}</h4>
                                        <p className="text-xs text-gray-500 mt-1">Trạng thái: <span className="font-bold">{item.status}</span></p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
          </div>

          <div className="p-5 border-t border-gray-200 bg-white">
            {(selectedTask.status === 'pending' || selectedTask.status === 'confirmed') && (
                <button onClick={handleStartJob} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                    <HiPlay fill="currentColor" size={18} /> Bắt đầu thực hiện
                </button>
            )}
            {selectedTask.status === 'in_progress' && (
                <button 
                    onClick={handleOpenChecklist} 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95"
                >
                    <HiClipboardList size={20} /> Tiến hành Kiểm Tra
                </button>
            )}
          </div>
        </aside>
      ) : (
        <div className="hidden lg:flex flex-col items-center justify-center w-[450px] bg-white border-l border-gray-200 text-gray-400">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"><HiDotsHorizontal size={40} className="opacity-50" /></div>
            <p>Chọn một công việc để xem chi tiết</p>
        </div>
      )}
    </div>
  );
};

export default TechnicianMaintenanceProcess;