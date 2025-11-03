import React, { useEffect, useState } from "react";
import api from "../../services/api";

const StaffMaintenanceProcess = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // 🔹 Lấy danh sách đơn bảo dưỡng
  const fetchOrders = async () => {
    try {
      const res = await api.get("/service-orders", {
        headers: { "X-User-Role": "ROLE_STAFF" },
      });
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách đơn bảo dưỡng:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Lọc theo từ khóa tìm kiếm
  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (order) =>
          String(order.id).includes(search) ||
          (order.serviceType || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (order.status || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, orders]);

  // 🔹 Cập nhật trạng thái (gửi PUT /service-orders/{id})
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const order = orders.find((o) => o.id === id);
      if (!order) return alert("Không tìm thấy đơn dịch vụ!");

      await api.put(
        `/service-orders/${id}`,
        { ...order, status: newStatus },
        {
          headers: {
            "X-User-Id": order.technicianId || 1, // ID tạm, có thể thay bằng ID đăng nhập thực tế
            "X-User-Role": "ROLE_STAFF",
          },
        }
      );

      alert("✅ Cập nhật trạng thái thành công!");
      fetchOrders();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        🧰 Quản lý Quy trình Bảo dưỡng
      </h2>
      <p className="text-gray-600 mb-4">
        Nhân viên có thể xem, tìm kiếm và cập nhật tiến độ bảo dưỡng cho từng
        đơn hàng.
      </p>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="🔍 Tìm theo ID, loại dịch vụ hoặc trạng thái..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
      </div>

      {/* Bảng danh sách đơn */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Loại dịch vụ</th>
              <th className="px-4 py-2 text-left">Mô tả</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Chi phí tạm tính</th>
              <th className="px-4 py-2 text-left">Ngày đặt</th>
              <th className="px-4 py-2 text-center">Cập nhật trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{order.serviceType || "-"}</td>
                  <td className="px-4 py-2">{order.description || "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        order.status === "COMPLETED"
                          ? "bg-green-200 text-green-700"
                          : order.status === "IN_PROGRESS"
                          ? "bg-yellow-200 text-yellow-700"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-200 text-blue-700"
                          : order.status === "CANCELLED"
                          ? "bg-red-200 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {order.estimatedCost
                      ? `${order.estimatedCost.toLocaleString()} ₫`
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {order.bookingDate
                      ? new Date(order.bookingDate).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="CREATED">CREATED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Không có đơn bảo dưỡng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffMaintenanceProcess;
