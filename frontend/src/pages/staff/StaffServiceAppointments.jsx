import React, { useEffect, useState } from "react";
import api from "../../services/api";

const StaffServiceAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // 🔹 Lấy thông tin nhân viên (đã lưu khi login)
  const staffId = localStorage.getItem("userId");
  const staffRole = localStorage.getItem("role") || "ROLE_STAFF";

  // ✅ Lấy danh sách lịch hẹn
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments", {
        headers: {
          "X-User-Id": staffId,
          "X-User-Role": staffRole,
        },
      });
      setAppointments(res.data);
      setFilteredAppointments(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lịch hẹn (Staff):", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Lọc tìm kiếm
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

  // ✅ Cập nhật trạng thái (PUT /appointments/{id})
  const handleStatusChange = async (id, newStatus) => {
    try {
      const appointment = selectedAppointment
        ? { ...selectedAppointment, status: newStatus }
        : null;

      if (!appointment) return;

      await api.put(`/appointments/${id}`, appointment, {
        headers: {
          "X-User-Id": staffId,
          "X-User-Role": staffRole,
        },
      });

      alert("✅ Cập nhật trạng thái thành công!");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        📅 Quản lý lịch hẹn (Nhân viên)
      </h2>
      <p className="text-gray-600 mb-4">
        Danh sách lịch hẹn tại trạm của bạn. Bạn chỉ có thể thay đổi trạng thái
        thực hiện.
      </p>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo dịch vụ, trạng thái, ghi chú..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
      </div>

      {/* Bảng danh sách */}
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
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setSelectedAppointment(a)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ⚙️ Cập nhật trạng thái
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

      {/* Modal cập nhật trạng thái */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Cập nhật trạng thái
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>Dịch vụ:</strong> {selectedAppointment.serviceType}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Khách hàng:</strong> {selectedAppointment.customerId}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Trạng thái hiện tại:</strong>{" "}
              {selectedAppointment.status}
            </p>

            <select
              value={selectedAppointment.status}
              onChange={(e) =>
                setSelectedAppointment({
                  ...selectedAppointment,
                  status: e.target.value,
                })
              }
              className="border px-3 py-2 rounded w-full mb-4"
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELED">CANCELED</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() =>
                  handleStatusChange(
                    selectedAppointment.id,
                    selectedAppointment.status
                  )
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffServiceAppointments;
