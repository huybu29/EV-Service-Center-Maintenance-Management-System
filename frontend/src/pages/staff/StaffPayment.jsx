import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; 
import { 
  HiOutlinePrinter, 
  HiOutlineMail, 
  HiOutlineDocumentText, 
  HiOutlineCreditCard, 
  HiOutlineCash, 
  HiOutlineCheckCircle,
  HiOutlineQrcode,
  HiUser,
  HiTruck,
  HiOutlineCalendar,
  HiArrowLeft
} from "react-icons/hi";

const StaffPaymentPage = () => {
  const { id: orderId } = useParams(); // Đây là Order ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // === STATE DỮ LIỆU ===
  const [orderData, setOrderData] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]); 
  const [paymentInfo, setPaymentInfo] = useState(null); // Thông tin từ Payment Service

  // === STATE UI THANH TOÁN ===
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(""); 
  const [nextServiceDate, setNextServiceDate] = useState("");

  // === 1. FETCH DATA ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Lấy thông tin Order
        const orderRes = await api.get(`/orders/${orderId}`, { headers });
        const currentOrder = orderRes.data;
        setOrderData(currentOrder);

        // 2. Gọi song song: Lấy Khách, Xe, Checklist và Payment
        const promises = [
            api.get(`/users/${currentOrder.customerId}`, { headers }),
            api.get(`/vehicles/${currentOrder.vehicleId}`, { headers }),
            api.get(`/orders/${orderId}/checklist`, { headers }),
            // Lấy payment dựa vào bookingID (appointmentId)
            api.get(`/payments/by-booking/${currentOrder.appointmentId}`, { headers })
               // Nếu chưa có payment thì trả về null, không throw lỗi
        ];

        const [userRes, vehicleRes, checklistRes, paymentRes] = await Promise.all(promises);

        setCustomer(userRes.data);
        setVehicle(vehicleRes.data);
        
        if (paymentRes.data) {
            setPaymentInfo(paymentRes.data);
            console.log(paymentRes.data)
            if (paymentRes.data.method) setPaymentMethod(paymentRes.data.method);
        }

        // 3. Xử lý danh sách Items (Service + Parts)
        const items = [];
        
        // a. Phí dịch vụ
        const servicePrices = {
            "MAINTENANCE": 500000,
            "BATTERY_REPLACEMENT": 2000000,
            "ENGINE_REPAIR": 1500000,
            "GENERAL_REPAIR": 300000
        };
        const basePrice = servicePrices[currentOrder.serviceType] || 200000;
        
        items.push({
            id: "base_service",
            name: `Phí dịch vụ: ${currentOrder.serviceType}`,
            type: "SERVICE",
            price: basePrice,
            quantity: 1,
            total: basePrice
        });

        // b. Phụ tùng
        if (checklistRes.data) {
            checklistRes.data.forEach(item => {
                if (item.parts && item.parts.length > 0) {
                    item.parts.forEach(part => {
                        items.push({
                            id: part.id,
                            name: part.partName,
                            type: "PART",
                            price: part.unitPrice,
                            quantity: part.quantity,
                            total: part.subTotal
                        });
                    });
                }
            });
        }
        setInvoiceItems(items);

        // 4. Gợi ý ngày bảo dưỡng tiếp theo
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 6);
        setNextServiceDate(nextDate.toISOString().split('T')[0]);

        setLoading(false);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        alert("Không thể tải thông tin đơn hàng.");
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // === 2. TÍNH TOÁN TIỀN ===
  // Ưu tiên lấy amount từ Payment đã tạo, nếu chưa có thì tính tổng từ items
  const totalAmount = paymentInfo ? paymentInfo.amount : invoiceItems.reduce((acc, item) => acc + item.total, 0);
  const finalAmount = totalAmount - appliedDiscount;
  
  const changeAmount = (parseFloat(receivedAmount) || 0) - finalAmount;

  // === 3. HÀM XỬ LÝ ===
  const handleApplyVoucher = () => {
    if (voucherCode.trim().toUpperCase() === "EV2025") {
      setAppliedDiscount(200000);
      alert("✅ Áp dụng mã giảm giá 200.000đ thành công!");
    } else {
      alert("❌ Mã giảm giá không hợp lệ.");
      setAppliedDiscount(0);
    }
  };

  const handleConfirmPayment = async () => {
    if (paymentMethod === "CASH" && changeAmount < 0) {
      alert("⚠️ Số tiền khách đưa chưa đủ!");
      return;
    }

    if (!window.confirm(`Xác nhận thanh toán ${finalAmount.toLocaleString()}đ?`)) return;

    try {
        const token = localStorage.getItem("accessToken");
        
        // Gọi API cập nhật trạng thái Payment thành COMPLETED
        // Giả sử bạn có endpoint PUT /payments/{id}
        if (paymentInfo) {
             await api.put(`/payments/${paymentInfo.paymentID}`, {
                status: "COMPLETED",
                method: paymentMethod
             }, {
                headers: { Authorization: `Bearer ${token}` }
             });
             
             // Cập nhật UI
             setPaymentInfo(prev => ({ ...prev, status: "COMPLETED" }));
             alert("🎉 Thanh toán thành công! Hóa đơn đã được cập nhật.");
        } else {
             // Trường hợp chưa có Payment (Backup), gọi tạo mới
             // ... logic tạo payment ...
        }

        navigate("/staff/appointments"); 

    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        alert("Thanh toán thất bại.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Đang tải thông tin thanh toán...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800 pb-24">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition"><HiArrowLeft size={24}/></button>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Thanh toán & Bàn giao xe</h1>
                <p className="text-gray-500 mt-1">Mã hóa đơn: <span className="font-bold text-gray-800">#{paymentInfo?.invoiceNumber || "---"}</span></p>
            </div>
        </div>
        <span className={`px-4 py-2 rounded-lg font-bold text-sm border 
            ${paymentInfo?.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
            {paymentInfo?.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chờ thanh toán'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === CỘT TRÁI: CHI TIẾT HÓA ĐƠN === */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Bảng chi tiết dịch vụ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Chi tiết dịch vụ</h2>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium">Hạng mục</th>
                            <th className="p-4 font-medium text-right">Đơn giá</th>
                            <th className="p-4 font-medium text-center">SL</th>
                            <th className="p-4 font-medium text-right">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {invoiceItems.map((item, index) => (
                            <tr key={index}>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-400 uppercase">{item.type === 'PART' ? 'Vật tư' : 'Dịch vụ'}</div>
                                </td>
                                <td className="p-4 text-right text-gray-600">{item.price.toLocaleString()}đ</td>
                                <td className="p-4 text-center text-gray-600">{item.quantity}</td>
                                <td className="p-4 text-right font-bold text-gray-900">{item.total.toLocaleString()}đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Tổng kết & Voucher */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        
                        {/* Voucher */}
                        <div className="w-full md:w-5/12">
                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Mã khuyến mãi</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Nhập mã voucher..." 
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    disabled={paymentInfo?.status === 'COMPLETED'}
                                />
                                <button 
                                    onClick={handleApplyVoucher}
                                    disabled={paymentInfo?.status === 'COMPLETED'}
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        {/* Tổng tiền */}
                        <div className="w-full md:w-6/12 space-y-2">
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Tạm tính</span>
                                <span>{totalAmount.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-green-600 text-sm font-medium">
                                <span>Giảm giá</span>
                                <span>-{appliedDiscount.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-gray-900 text-xl font-extrabold pt-3 border-t border-gray-200 mt-2">
                                <span>Tổng thanh toán</span>
                                <span className="text-blue-600">{finalAmount.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Phương thức thanh toán</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: "CASH", name: "Tiền mặt", icon: <HiOutlineCash size={24}/> },
                        { id: "QR", name: "VNPAY-QR", icon: <HiOutlineQrcode size={24}/> },
                        { id: "MOMO", name: "Momo", icon: <span className="font-bold text-lg">Mo</span> },
                        { id: "CARD", name: "Thẻ NH", icon: <HiOutlineCreditCard size={24}/> },
                    ].map(method => (
                        <button 
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            disabled={paymentInfo?.status === 'COMPLETED'}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                ${paymentMethod === method.id 
                                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" 
                                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"}
                            `}
                        >
                            {method.icon}
                            <span className="text-sm font-bold">{method.name}</span>
                        </button>
                    ))}
                </div>

                {paymentMethod === "CASH" && paymentInfo?.status !== 'COMPLETED' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Số tiền khách đưa</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-lg font-bold text-gray-900 outline-none focus:border-blue-500"
                                    placeholder="0"
                                    value={receivedAmount}
                                    onChange={(e) => setReceivedAmount(e.target.value)}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">đ</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Tiền thối lại</label>
                            <div className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-lg font-bold ${changeAmount < 0 ? "text-red-500" : "text-green-600"}`}>
                                {changeAmount > 0 ? changeAmount.toLocaleString() : "0"} đ
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* === CỘT PHẢI: THÔNG TIN & HÀNH ĐỘNG === */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Khách hàng & Xe</h3>
                <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><HiUser size={24} /></div>
                    <div>
                        <h4 className="font-bold text-gray-900">{customer?.fullName}</h4>
                        <p className="text-sm text-gray-500">{customer?.phone}</p>
                        <p className="text-xs text-gray-400 mt-1">{customer?.email}</p>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><HiTruck size={24} /></div>
                        <div>
                            <h4 className="font-bold text-gray-900">{vehicle?.licensePlate}</h4>
                            <p className="text-sm text-gray-500">{vehicle?.brand} {vehicle?.model}</p>
                            <div className="flex gap-2 mt-1 text-xs">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 border">ODO: {vehicle?.currentMileage?.toLocaleString()} km</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><HiOutlineCalendar className="text-blue-600"/> Lịch bảo dưỡng tiếp theo</h3>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none" value={nextServiceDate} onChange={(e) => setNextServiceDate(e.target.value)} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Thao tác khác</h3>
                <button className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition"><HiOutlinePrinter size={18}/> In hóa đơn</button>
                <button className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition"><HiOutlineDocumentText size={18}/> In phiếu ra cổng</button>
            </div>
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:px-8 shadow-lg flex justify-between md:justify-end items-center gap-6 z-50">
          <div className="text-right hidden md:block">
             <p className="text-xs text-gray-500 font-bold uppercase">Tổng thanh toán</p>
             <p className="text-2xl font-extrabold text-blue-600">{finalAmount.toLocaleString()} đ</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => navigate(-1)} className="flex-1 md:flex-none px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition">Thoát</button>
              {paymentInfo?.status !== 'COMPLETED' && (
                  <button onClick={handleConfirmPayment} className="flex-1 md:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                     <HiOutlineCheckCircle size={24} /> Xác nhận Thanh toán
                  </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default StaffPaymentPage;