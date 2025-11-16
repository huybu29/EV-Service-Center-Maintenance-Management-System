import React, { useState } from "react";
import api from "../../services/api";
// 1. Thêm icons để khớp với thiết kế
import {
  HiOutlineChevronDown,
  HiChevronDown,
  HiCreditCard,
  HiDocumentDownload,
} from "react-icons/hi";

// === DỮ LIỆU GIẢ (MOCK DATA) ===
// Vì API /payments/me cũ không cung cấp đủ thông tin (chi tiết xe, list dịch vụ)
const mockVehicle = {
  model: "VinFast VF8",
  licensePlate: "51K-123.45",
};

const mockStats = {
  totalCost2024: 15200000,
  totalServices: 4,
};

// Dùng paymentID làm "Mã Dịch Vụ"
const mockHistoryData = [
  {
    paymentID: "EV-84512",
    bookingID: 1, // Cần cho hàm thanh toán
    amount: 3500000,
    createdAt: "2024-07-15T09:00:00Z",
    status: "PENDING",
    services: [
      "Kiểm tra hệ thống pin và làm mát",
      "Cập nhật phần mềm điều khiển",
      "Kiểm tra áp suất lốp",
    ],
  },
  {
    paymentID: "EV-81234",
    bookingID: 2,
    amount: 5700000,
    createdAt: "2024-04-02T14:30:00Z",
    status: "COMPLETED",
    services: [
      "Bảo dưỡng định kỳ 40,000 km",
      "Thay dầu phanh",
      "Đảo lốp",
    ],
  },
  {
    paymentID: "EV-79856",
    bookingID: 3,
    amount: 6000000,
    createdAt: "2024-01-12T10:15:00Z",
    status: "COMPLETED",
    services: ["Thay pin", "Kiểm tra hệ thống điện"],
  },
];
// ===================================

// Component Card Lịch sử (Mới)
const HistoryItemCard = ({ item, onPayNowClick }) => {
  // Thẻ PENDING luôn mở, thẻ COMPLETED mặc định đóng
  const [isExpanded, setIsExpanded] = useState(item.status === "PENDING");

  const isPending = item.status === "PENDING";
  const statusColor = isPending
    ? "text-orange-600 bg-orange-100"
    : "text-green-600 bg-green-100";
  const statusDot = isPending ? "bg-orange-500" : "bg-green-500";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header của Card */}
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Ngày bảo dưỡng
          </p>
          <p className="font-bold text-gray-800">
            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Mã dịch vụ
          </p>
          <p className="font-bold text-gray-800 font-mono">#{item.paymentID}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Tổng cộng
          </p>
          <p className="font-bold text-gray-800">
            {item.amount.toLocaleString()}đ
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Trạng thái
          </p>
          <span
            className={`flex items-center gap-1.5 text-sm font-medium ${statusColor} px-2 py-0.5 rounded-full w-fit`}
          >
            <span
              className={`w-2 h-2 rounded-full ${statusDot} inline-block`}
            ></span>
            {isPending ? "Chờ thanh toán" : "Đã thanh toán"}
          </span>
        </div>
      </div>

      {/* Nút 'Xem chi tiết' cho thẻ Đã thanh toán */}
      {!isPending && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left bg-gray-50 border-t border-gray-200 px-5 py-3 text-sm font-medium text-blue-600 hover:bg-gray-100 flex items-center justify-between"
        >
          {isExpanded ? "Thu gọn" : "Xem chi tiết"}
          <HiChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Nội dung chi tiết (khi mở rộng) */}
      {isExpanded && (
        <div className="p-5 border-t border-gray-200 bg-gray-50/50">
          <h4 className="font-semibold text-gray-800 mb-3">Chi tiết dịch vụ</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            {item.services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>

          {/* Nút hành động */}
          <div className="flex items-center gap-4 mt-5">
            {isPending && (
              <button
                onClick={() => onPayNowClick(item)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
              >
                <HiCreditCard className="w-5 h-5" />
                Thanh toán ngay
              </button>
            )}
            <button className="flex items-center gap-2 text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition">
              <HiDocumentDownload className="w-5 h-5" />
              Tải hóa đơn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Component Dropdown lọc (Mới)
const FilterDropdown = ({ label, options }) => (
  <div className="relative">
    <select className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option>{label}</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
    <HiOutlineChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

// === COMPONENT CHÍNH ===
const PaymentPage = () => {
  // 2. State từ code cũ, dùng cho Modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [note, setNote] = useState("");

  // 3. State mới, dùng dữ liệu giả
  const [loading, setLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState(mockHistoryData);
  const vehicle = mockVehicle;
  const stats = mockStats;

  // 4. Mở form (Giữ nguyên từ code cũ)
  const openPaymentForm = (payment) => {
    setSelectedPayment(payment);
    setPaymentMethod("CASH");
    setNote("");
  };

  // 5. Xử lý thanh toán (Giữ nguyên logic, CẬP NHẬT state)
  const confirmPayment = async () => {
    if (!selectedPayment) return;
    if (
      !window.confirm(
        `Xác nhận thanh toán đơn #${selectedPayment.paymentID}?`
      )
    )
      return;

    try {
      // Logic API của bạn giữ nguyên
      await api.put(
        `/payments/${selectedPayment.paymentID}`,
        { status: "COMPLETED", method: paymentMethod, note },
        { headers: { "X-User-Role": "CUSTOMER" } }
      );

      alert("✅ Thanh toán thành công!");
      
      // Cập nhật state (thay vì fetch)
      setHistoryItems((prevItems) =>
        prevItems.map((item) =>
          item.paymentID === selectedPayment.paymentID
            ? { ...item, status: "COMPLETED" }
            : item
        )
      );
      setSelectedPayment(null);

    } catch (err) {
      console.error("Lỗi khi thanh toán:", err);
      alert("❌ Thanh toán thất bại");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">
        Lịch sử bảo dưỡng & Thanh toán
      </h1>
      <p className="text-gray-600 mt-1">
        Xe của bạn:{" "}
        <span className="font-medium text-gray-800">{vehicle.model}</span> -
        Biển số:{" "}
        <span className="font-medium text-gray-800">
          {vehicle.licensePlate}
        </span>
      </p>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Tổng chi phí năm 2024</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.totalCost2024.toLocaleString()}đ
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Tổng số lần bảo dưỡng</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {stats.totalServices}
          </p>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-col md:flex-row gap-3 my-6">
        <FilterDropdown label="Lọc theo năm" options={["2024", "2023"]} />
        <FilterDropdown
          label="Sắp xếp theo chi phí"
          options={["Cao đến thấp", "Thấp đến cao"]}
        />
        <FilterDropdown
          label="Sắp xếp theo ngày"
          options={["Mới nhất", "Cũ nhất"]}
        />
      </div>

      {/* Danh sách lịch sử */}
      <div className="space-y-4">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : historyItems.length === 0 ? (
          <p>Không có lịch sử bảo dưỡng nào.</p>
        ) : (
          historyItems.map((item) => (
            <HistoryItemCard
              key={item.paymentID}
              item={item}
              onPayNowClick={openPaymentForm} // Truyền hàm xử lý click
            />
          ))
        )}
      </div>

      {/* 6. Modal thanh toán (Giữ nguyên từ code cũ) */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              💰 Xác nhận thanh toán #{selectedPayment.paymentID}
            </h2>

            <p className="mb-2">
              <strong>Số tiền:</strong>{" "}
              {selectedPayment.amount.toLocaleString()} đ
            </p>

            <label className="block mt-3 text-gray-700 font-medium">
              Phương thức thanh toán:
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CASH">Tiền mặt</option>
              <option value="CREDIT_CARD">Thẻ tín dụng</option>
              <option value="BANK_TRANSFER">Chuyển khoản</option>
            </select>

            <label className="block mt-3 text-gray-700 font-medium">
              Ghi chú:
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập ghi chú (nếu có)..."
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;