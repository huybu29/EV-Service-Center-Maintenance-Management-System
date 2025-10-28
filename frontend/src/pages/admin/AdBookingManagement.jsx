import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    serviceType: "MAINTENANCE",
    status: "PENDING",
    notes: "",
    customerId: "",
    vehicleId: "",
    serviceCenterId: "",
  });

  // Lấy danh sách lịch hẹn
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data);
      setFilteredAppointments(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lịch hẹn:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter tìm kiếm
  useEffect(() => {
    setFilteredAppointments(
      appointments.filter(
        (a) =>
          (a.notes || "").toLowerCase().includes(search.toLowerCase()) ||
          (a.serviceType || "").toLowerCase().includes(search.toLowerCase()) ||
          (a.status || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, appointments]);

  // Xóa lịch hẹn
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments(appointments.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa lịch hẹn:", error);
    }
  };

  // Thêm hoặc sửa lịch hẹn
  // Thêm hoặc sửa lịch hẹn
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let response;

    // Nếu có ID thì cập nhật lịch hẹn
    if (formData.id) {
      response = await api.put(`/appointments/${formData.id}`, formData);
    } else {
      response = await api.post("/appointments", formData);
    }

    const appointment = response.data;

    // ✅ Nếu trạng thái là CONFIRMED → tạo Order tương ứng
    if (appointment.status === "CONFIRMED") {
      try {
        await api.post("/service-orders", {
          appointmentId: appointment.id,
          vehicleId: appointment.vehicleId,
          customerId: appointment.customerId,
          centerId: appointment.serviceCenterId,
          serviceType: appointment.serviceType,
          description: appointment.notes || "Tạo đơn từ lịch hẹn đã xác nhận",
          status: "CREATED",
          bookingDate: appointment.appointmentDate,
          createdAt: new Date().toISOString(),
          estimatedCost: 0.0,
          finalCost: 0.0,
          paymentStatus: "PENDING",
        });
        console.log("✅ Đã tạo order cho lịch hẹn CONFIRMED:", appointment.id);
      } catch (orderError) {
        console.error("❌ Lỗi khi tạo order:", orderError);
      }
    }

    setShowModal(false);
    fetchAppointments();

    // Reset form
    setFormData({
      appointmentDate: "",
      serviceType: "MAINTENANCE",
      status: "PENDING",
      notes: "",
      customerId: "",
      vehicleId: "",
      serviceCenterId: "",
    });

  } catch (error) {
    console.error("Lỗi khi lưu lịch hẹn:", error);
  }
};
  const handleEdit = (a) => {
    setFormData({
      ...a,
      appointmentDate: a.appointmentDate
        ? new Date(a.appointmentDate).toISOString().slice(0, 16)
        : "",
    });
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">📅 Quản lý lịch hẹn</h2>
      <p className="text-gray-600 mb-4">Danh sách các lịch hẹn bảo dưỡng và sửa chữa.</p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo dịch vụ, trạng thái, ghi chú..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          ➕ Thêm lịch hẹn
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Ngày hẹn</th>
              <th className="px-4 py-2">Dịch vụ</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Ghi chú</th>
              <th className="px-4 py-2">Khách hàng</th>
              <th className="px-4 py-2">Xe</th>
              <th className="px-4 py-2">Trung tâm</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a, idx) => (
                <tr key={a.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">
                    {new Date(a.appointmentDate).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-2">{a.serviceType}</td>
                  <td className="px-4 py-2">{a.status}</td>
                  <td className="px-4 py-2">{a.notes || "-"}</td>
                  <td className="px-4 py-2">{a.customerId}</td>
                  <td className="px-4 py-2">{a.vehicleId}</td>
                  <td className="px-4 py-2">{a.serviceCenterId}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded transition"
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  Không có lịch hẹn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa lịch hẹn */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-2/3">
            <h3 className="text-xl font-bold mb-4">
              {formData.id ? "Sửa lịch hẹn" : "Thêm lịch hẹn"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="datetime-local"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
                className="border px-3 py-2 rounded"
                required
              />

              <select
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value })
                }
                className="border px-3 py-2 rounded"
              >
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="BATTERY_REPLACEMENT">BATTERY_REPLACEMENT</option>
                <option value="ENGINE_REPAIR">ENGINE_REPAIR</option>
                <option value="GENERAL_REPAIR">GENERAL_REPAIR</option>
              </select>

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELED">CANCELED</option>
              </select>

              <input
                type="text"
                placeholder="Ghi chú"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border px-3 py-2 rounded"
              />

              <input
                type="number"
                placeholder="Customer ID"
                value={formData.customerId}
                onChange={(e) =>
                  setFormData({ ...formData, customerId: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <input
                type="number"
                placeholder="Vehicle ID"
                value={formData.vehicleId}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleId: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <input
                type="number"
                placeholder="Service Center ID"
                value={formData.serviceCenterId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceCenterId: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <div className="col-span-2 flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export default AdminAppointments;
