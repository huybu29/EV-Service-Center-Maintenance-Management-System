import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import {
  HiOutlineChevronDown,
  HiCreditCard,
  HiDocumentDownload,
  HiOutlineCash,
  HiOutlineExclamation
} from "react-icons/hi";

// === HELPER: Màu sắc trạng thái ===
const getStatusStyle = (status) => {
  switch (status) {
    case "PENDING":
      return { text: "text-orange-700", bg: "bg-orange-100", dot: "bg-orange-500", label: "Chờ thanh toán" };
    case "COMPLETED":
      return { text: "text-green-700", bg: "bg-green-100", dot: "bg-green-500", label: "Đã thanh toán" };
    case "FAILED":
      return { text: "text-red-700", bg: "bg-red-100", dot: "bg-red-500", label: "Thất bại" };
    case "REFUNDED":
      return { text: "text-gray-700", bg: "bg-gray-100", dot: "bg-gray-500", label: "Hoàn tiền" };
    default:
      return { text: "text-gray-700", bg: "bg-gray-100", dot: "bg-gray-500", label: status };
  }
};

// === COMPONENT: Card Lịch sử ===
const HistoryItemCard = ({ item, onPayNowClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = getStatusStyle(item.status);
  const isPending = item.status === "PENDING";
  
  const formattedDate = item.createdAt 
    ? new Date(item.createdAt).toLocaleDateString("vi-VN") 
    : "---";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition hover:shadow-md">
      {/* Header Card */}
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ngày tạo</p>
          <p className="font-bold text-gray-800">{formattedDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Mã hóa đơn</p>
          <p className="font-bold text-gray-800 font-mono text-sm truncate" title={item.invoiceNumber}>
             #{item.invoiceNumber || item.paymentID}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Số tiền</p>
          <p className="font-bold text-blue-600 text-lg">{(item.amount || 0).toLocaleString()} ₫</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Trạng thái</p>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
            {style.label}
          </span>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-200 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition"
      >
        {isExpanded ? "Thu gọn chi tiết" : "Xem chi tiết dịch vụ"}
        <HiOutlineChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 border-t border-gray-200 bg-gray-50/50 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
             <div><span className="text-gray-500">Phương thức: </span><span className="font-medium">{item.method || "Chưa chọn"}</span></div>
             <div><span className="text-gray-500">Mã Booking: </span><span className="font-medium">#{item.bookingID}</span></div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3 mt-5">
            {isPending && (
              <button onClick={() => onPayNowClick(item)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-md transition transform active:scale-95">
                <HiCreditCard className="w-5 h-5" /> Thanh toán ngay
              </button>
            )}
            {!isPending && (
               <button className="flex items-center gap-2 text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition">
                  <HiDocumentDownload className="w-5 h-5" /> Xuất hóa đơn
               </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// === COMPONENT CHÍNH ===
const PaymentPage = () => {
  // State Data
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCost: 0, totalServices: 0 });

  // State Filter
  const [filterYear, setFilterYear] = useState("ALL");
  const [sortCost, setSortCost] = useState("DEFAULT");
  const [sortDate, setSortDate] = useState("NEWEST");

  // State Modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [note, setNote] = useState("");

  // 1. Fetch Data API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        const res = await api.get("/payments/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // 2. Tính toán Thống kê (Real-time)
  useEffect(() => {
    const completedPayments = payments.filter(p => p.status === 'COMPLETED');
    const total = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    setStats({
      totalCost: total,
      totalServices: completedPayments.length 
    });
  }, [payments]);

  // Logic Lọc và Sắp xếp (Client-side)
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Lọc theo năm
    if (filterYear !== "ALL") {
      result = result.filter(p => p.createdAt && new Date(p.createdAt).getFullYear().toString() === filterYear);
    }

    // Sắp xếp giá
    if (sortCost === "HIGH_LOW") result.sort((a, b) => b.amount - a.amount);
    else if (sortCost === "LOW_HIGH") result.sort((a, b) => a.amount - b.amount);

    // Sắp xếp ngày (Mặc định)
    if (sortCost === "DEFAULT") {
       if (sortDate === "NEWEST") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
       else if (sortDate === "OLDEST") result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return result;
  }, [payments, filterYear, sortCost, sortDate]);

  // 3. Xử lý Thanh toán
  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;
    try {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        
        // Gọi API cập nhật trạng thái Payment
        await api.put(`/payments/${selectedPayment.paymentID}`, {
            status: "COMPLETED",
            method: paymentMethod,
            amount: selectedPayment.amount // Gửi lại amount để confirm (hoặc backend tự check)
        }, { headers: { Authorization: `Bearer ${token}` } });

        alert("✅ Thanh toán thành công!");
        
        // Cập nhật UI Local ngay lập tức
        setPayments(prev => prev.map(p => 
            p.paymentID === selectedPayment.paymentID ? { ...p, status: "COMPLETED", method: paymentMethod } : p
        ));
        setSelectedPayment(null);
    } catch (err) {
        console.error("Lỗi thanh toán:", err);
        alert("❌ Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  // Lấy danh sách năm có trong dữ liệu
  const availableYears = [...new Set(payments.map(p => p.createdAt ? new Date(p.createdAt).getFullYear() : null).filter(y => y))].sort((a,b) => b - a);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lịch sử Thanh toán</h1>
        <p className="text-gray-500 mt-1">Quản lý chi phí bảo dưỡng xe của bạn.</p>
      </div>

      {/* Cards Thống Kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
           <div className="flex justify-between items-start">
               <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Tổng chi phí</p>
               <HiOutlineCash className="text-gray-300 w-6 h-6"/>
           </div>
           <p className="text-3xl font-extrabold text-blue-600 mt-2">{stats.totalCost.toLocaleString()} ₫</p>
           <p className="text-xs text-gray-400 mt-1">Đã thanh toán thành công</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
           <div className="flex justify-between items-start">
               <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Số lần giao dịch</p>
               <HiCreditCard className="text-gray-300 w-6 h-6"/>
           </div>
           <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totalServices} <span className="text-base font-normal text-gray-400">lần</span></p>
           <p className="text-xs text-gray-400 mt-1">Bảo dưỡng & Sửa chữa</p>
        </div>
      </div>

      {/* Bộ Lọc (Filters) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
         <div className="relative flex-1">
            <select 
               value={filterYear} 
               onChange={(e) => setFilterYear(e.target.value)}
               className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-2.5 px-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-white transition"
            >
               <option value="ALL">Tất cả các năm</option>
               {availableYears.map(year => <option key={year} value={year}>Năm {year}</option>)}
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
         </div>

         <div className="relative flex-1">
            <select 
               value={sortCost} 
               onChange={(e) => setSortCost(e.target.value)}
               className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-2.5 px-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-white transition"
            >
               <option value="DEFAULT">Sắp xếp chi phí (Mặc định)</option>
               <option value="HIGH_LOW">Cao đến Thấp</option>
               <option value="LOW_HIGH">Thấp đến Cao</option>
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
         </div>

         <div className="relative flex-1">
            <select 
               value={sortDate} 
               onChange={(e) => setSortDate(e.target.value)}
               className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-2.5 px-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-white transition"
            >
               <option value="NEWEST">Mới nhất trước</option>
               <option value="OLDEST">Cũ nhất trước</option>
            </select>
            <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
         </div>
      </div>

      {/* Danh sách Payment */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
             <HiOutlineExclamation className="w-10 h-10 text-gray-300 mx-auto mb-3"/>
             <p className="text-gray-500">Không tìm thấy lịch sử thanh toán nào phù hợp.</p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <HistoryItemCard 
               key={payment.paymentID} 
               item={payment} 
               onPayNowClick={(p) => { setSelectedPayment(p); setPaymentMethod("CASH"); setNote(""); }} 
            />
          ))
        )}
      </div>

      {/* Modal Thanh Toán */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fadeIn">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                 <h3 className="text-lg font-bold flex items-center gap-2">
                    <HiCreditCard className="w-6 h-6 opacity-80"/> Xác nhận thanh toán
                 </h3>
                 <p className="text-blue-100 text-xs mt-1">Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.</p>
              </div>
              
              <div className="p-6 space-y-5">
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Số tiền cần thanh toán</p>
                    <p className="text-3xl font-extrabold text-blue-600 tracking-tight">{selectedPayment.amount.toLocaleString()} ₫</p>
                 </div>
                 
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Chọn phương thức</label>
                     <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium"
                     >
                       
                        <option value="BANK_TRANSFER">Chuyển khoản Ngân hàng</option>
                        
                     </select>
                 </div>

                 {paymentMethod === 'BANK_TRANSFER' && (
                    <div className="p-4 bg-blue-50 text-blue-900 text-sm rounded-xl border border-blue-100">
                       <p className="font-bold mb-1">Thông tin chuyển khoản:</p>
                       <p>Ngân hàng: <span className="font-mono font-bold">Vietcombank</span></p>
                       <p>Số TK: <span className="font-mono font-bold">0071000XXXXXX</span></p>
                       <p>Chủ TK: <span className="font-bold">EV CENTER</span></p>
                       <p className="mt-2 pt-2 border-t border-blue-200">Nội dung CK: <span className="font-mono font-bold bg-white px-1 rounded text-blue-600">PAY {selectedPayment.paymentID}</span></p>
                    </div>
                 )}

                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú (Tùy chọn)</label>
                    <textarea 
                       value={note}
                       onChange={(e) => setNote(e.target.value)}
                       rows={2}
                       placeholder="Nhập ghi chú nếu cần..."
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                    />
                 </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                 <button onClick={() => setSelectedPayment(null)} className="px-5 py-2.5 rounded-lg text-gray-600 font-bold hover:bg-gray-200 transition text-sm">Hủy bỏ</button>
                 <button onClick={handleConfirmPayment} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg transition transform active:scale-95 text-sm">Xác nhận Thanh toán</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;