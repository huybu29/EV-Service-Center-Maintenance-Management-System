import React, { useEffect, useState } from "react";
import { Search, Filter, Grid, List, MoreHorizontal, ChevronDown } from "lucide-react";
import api from "../../services/api"; // Đảm bảo đường dẫn đúng

const StaffParts = () => {
  // === STATE ===
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' hoặc 'list'

  // Dữ liệu Mockup để test giao diện nếu chưa có API thực
  const mockParts = [
    {
      partId: 1,
      partCode: "BRK-EVC-001",
      partName: "Má phanh hiệu suất cao",
      image: "https://images.unsplash.com/photo-1628551747965-832188a56700?w=500&q=80", // Ảnh minh họa
      quantity: 25,
      minQuantity: 10,
      price: 2800000,
    },
    {
      partId: 2,
      partCode: "BAT-MOD-75KWH",
      partName: "Module Pin 75kWh",
      image: "https://images.unsplash.com/photo-1620210779380-62a105103434?w=500&q=80",
      quantity: 3,
      minQuantity: 5,
      price: 85000000,
    },
    {
      partId: 3,
      partCode: "BUM-F-MDLX",
      partName: "Cản trước Model X",
      image: "https://images.unsplash.com/photo-1586288295521-910e264d6c41?w=500&q=80",
      quantity: 0,
      minQuantity: 2,
      price: 12500000,
    },
    {
      partId: 4,
      partCode: "WHL-19-AERO",
      partName: "Vành hợp kim 19\" Aero",
      image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500&q=80",
      quantity: 8,
      minQuantity: 10,
      price: 7200000,
    },
  ];

  // === CALL API ===
  const fetchParts = async () => {
    try {
      // Bỏ comment dòng dưới khi chạy với Backend thật
      // const res = await api.get("/parts", { headers: { "X-User-Role": "ROLE_STAFF" } });
      // setParts(res.data);
      // setFilteredParts(res.data);
      
      // Dùng mock data để hiển thị giao diện ngay lập tức
      setParts(mockParts);
      setFilteredParts(mockParts);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách phụ tùng:", err);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // === FILTER LOGIC ===
  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredParts(
      parts.filter(
        (p) =>
          (p.partCode || "").toLowerCase().includes(term) ||
          (p.partName || "").toLowerCase().includes(term)
      )
    );
  }, [search, parts]);

  // === HELPER: Xử lý trạng thái Badge ===
  const getStatusBadge = (quantity, minQuantity) => {
    if (quantity === 0) {
      return <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">Hết hàng</span>;
    }
    if (quantity <= minQuantity) {
      return <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-md">Sắp hết</span>;
    }
    return <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Còn hàng</span>;
  };

  // === RENDER ===
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* 1. Header & Tiêu đề */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tra Cứu Kho Phụ Tùng</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tìm kiếm, xem thông tin tồn kho và đặt giữ phụ tùng cho xe đang đến.
        </p>
      </div>

      {/* 2. Toolbar: Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã phụ tùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {["Loại xe", "Danh mục", "Trạng thái"].map((label, idx) => (
                <button key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap">
                    {label} <ChevronDown size={16} />
                </button>
            ))}
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                <Grid size={20} />
            </button>
            <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                <List size={20} />
            </button>
        </div>
      </div>

      {/* 3. Grid Phụ tùng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredParts.map((part) => (
          <div key={part.partId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
            
            {/* Image Container */}
            <div className="relative h-48 w-full bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                {/* Badge nằm đè lên ảnh */}
                <div className="absolute top-2 right-2 z-10">
                    {getStatusBadge(part.quantity, part.minQuantity)}
                </div>
                <img 
                    src={part.image} 
                    alt={part.partName} 
                    className="h-full w-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Info */}
            <div className="flex-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">SKU: {part.partCode}</p>
                <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">{part.partName}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500">Tồn kho:</span>
                    <span className={`text-sm font-bold ${part.quantity === 0 ? "text-red-600" : "text-gray-800"}`}>
                        {part.quantity}
                    </span>
                </div>

                <p className="text-xl font-extrabold text-gray-900 mb-4">
                    {part.price.toLocaleString("vi-VN")} VNĐ
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center">
                    Đặt giữ hàng
                </button>
                <button className="px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>

          </div>
        ))}
      </div>

      {filteredParts.length === 0 && (
        <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy phụ tùng nào phù hợp.</p>
        </div>
      )}

    </div>
  );
};

export default StaffParts;