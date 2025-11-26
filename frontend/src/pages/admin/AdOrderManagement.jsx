// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: "",
    serviceType: "",
    description: "",
    status: "",
    estimatedCost: "",
    finalCost: "",
    technicianId: "",
    customerId: "",
    centerId: "",
  });
  const navigate = useNavigate();

  // Lấy danh sách đơn
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Lọc tìm kiếm
  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (o) =>
          (o.serviceType || "").toLowerCase().includes(search.toLowerCase()) ||
          (o.vehicleVin || "").toLowerCase().includes(search.toLowerCase()) ||
          (o.centerName || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, orders]);

  // Xóa đơn
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn này?")) return;
    try {
      await api.delete(`/service-orders/${id}`);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  // Khi nhấn "Sửa"
  const handleEdit = (o) => {
    setForm({
      id: o.id,
      serviceType: o.serviceType,
      description: o.description || "",
      status: o.status,
      estimatedCost: o.estimatedCost || "",
      finalCost: o.finalCost || "",
      technicianId: o.technicianId || "",
      customerId: o.customerId || "",
      centerId: o.centerId || "",
    });
    setShowModal(true);
  };

  // Cập nhật đơn
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/service-orders/${form.id}`, form);
      const updatedOrder = res.data;

      // ✅ Nếu đơn được cập nhật sang COMPLETED → tạo payment
      if (updatedOrder.status === "COMPLETED") {
        try {
          await api.post("/payments/", {
            userID: updatedOrder.customerId,
            bookingID: updatedOrder.id,
            amount: updatedOrder.finalCost || updatedOrder.estimatedCost || 0,
            status: "PENDING",
            method: "CASH",
            createdAt: new Date().toISOString(),
          });
          alert("✅ Đơn đã hoàn tất và tạo thanh toán mới thành công!");
        } catch (payErr) {
          console.error("❌ Lỗi khi tạo Payment:", payErr);
          alert("⚠️ Cập nhật đơn thành công nhưng lỗi khi tạo thanh toán!");
        }
      }

      setShowModal(false);
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn:", error);
      alert("❌ Lỗi khi cập nhật đơn!");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🧾 Quản lý đơn dịch vụ</h2>
      <p className="text-gray-600 mb-4">Danh sách các đơn bảo dưỡng / sửa chữa.</p>

      {/* Tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm theo Vehicle, Center, hoặc Dịch vụ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Bảng danh sách */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Vehicle</th>
              <th className="px-4 py-2 text-left">Technician</th>
              <th className="px-4 py-2 text-left">Trung tâm</th>
              <th className="px-4 py-2 text-left">Dịch vụ</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Chi phí</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o, idx) => (
                <tr key={o.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{o.vehicleId}</td>
                  <td className="px-4 py-2">{o.technicianId || "-"}</td>
                  <td className="px-4 py-2">{o.centerId}</td>
                  <td className="px-4 py-2">{o.serviceType}</td>
                  <td className="px-4 py-2 capitalize">{o.status}</td>
                  <td className="px-4 py-2">
                    {o.totalCost }
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(o)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded transition"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Không có đơn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chỉnh sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">✏️ Cập nhật đơn dịch vụ</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="CREATED">CREATED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Chi phí ước tính</label>
                <input
                  type="number"
                  value={form.estimatedCost}
                  onChange={(e) =>
                    setForm({ ...form, estimatedCost: parseFloat(e.target.value) })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Chi phí cuối</label>
                <input
                  type="number"
                  value={form.finalCost}
                  onChange={(e) =>
                    setForm({ ...form, finalCost: parseFloat(e.target.value) })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
