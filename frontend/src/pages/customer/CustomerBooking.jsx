// src/pages/customer/BookingPage.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const BookingPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    vehicleId: "",
    serviceCenterId: "",
    appointmentDate: "",
    serviceType: "MAINTENANCE",
    notes: "",
  });

  const userId = localStorage.getItem("userId");

  // 🔹 Lấy dữ liệu ban đầu
  const fetchData = async () => {
    try {
      const [vehiclesRes, stationsRes, appointmentsRes] = await Promise.all([
        api.get(`/vehicles/me`),
        api.get(`/stations`),
        api.get(`/appointments/me`),
      ]);
      setVehicles(vehiclesRes.data);
      setStations(stationsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Gửi yêu cầu đặt lịch
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        customerId: userId,
        status: "PENDING",
      };

      await api.post(`/appointments`, payload);
      alert("✅ Đặt lịch thành công!");
      fetchData();

      setForm({
        vehicleId: "",
        serviceCenterId: "",
        appointmentDate: "",
        serviceType: "MAINTENANCE",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi đặt lịch");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* Header */}
        <div className="mb-8 border-b pb-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900">
            📅 Đặt lịch bảo dưỡng
          </h1>
          <span className="text-sm text-gray-500">
            Theo dõi & quản lý lịch bảo dưỡng xe điện của bạn
          </span>
        </div>

        {/* Form đặt lịch */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-10 shadow-sm"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Xe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🚗 Chọn xe
              </label>
              <select
                name="vehicleId"
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">-- Chọn xe --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.licensePlate} - {v.model}
                  </option>
                ))}
              </select>
            </div>

            {/* Trung tâm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 Trung tâm bảo dưỡng
              </label>
              <select
                name="serviceCenterId"
                value={form.serviceCenterId}
                onChange={(e) =>
                  setForm({ ...form, serviceCenterId: e.target.value })
                }
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">-- Chọn trung tâm --</option>
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Loại dịch vụ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🛠️ Loại dịch vụ
              </label>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={(e) =>
                  setForm({ ...form, serviceType: e.target.value })
                }
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="MAINTENANCE">Bảo dưỡng</option>
                <option value="BATTERY_REPLACEMENT">Thay pin</option>
                <option value="ENGINE_REPAIR">Sửa động cơ</option>
                <option value="GENERAL_REPAIR">Sửa chữa chung</option>
              </select>
            </div>

            {/* Ngày đặt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📆 Ngày giờ đặt lịch
              </label>
              <input
                type="datetime-local"
                value={form.appointmentDate}
                onChange={(e) =>
                  setForm({ ...form, appointmentDate: e.target.value })
                }
                className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Ghi chú (tuỳ chọn)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ví dụ: Xe có tiếng ồn lạ, muốn kiểm tra động cơ..."
            ></textarea>
          </div>

          <div className="text-right mt-6">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg transition"
            >
              ✅ Xác nhận đặt lịch
            </button>
          </div>
        </form>

        {/* Danh sách lịch hẹn */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📋 Lịch bảo dưỡng của bạn
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-500 italic">
              Hiện chưa có lịch bảo dưỡng nào.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-800">
                    <th className="p-3 text-left">Xe</th>
                    <th className="p-3 text-left">Trung tâm</th>
                    <th className="p-3 text-left">Dịch vụ</th>
                    <th className="p-3 text-left">Ngày giờ</th>
                    <th className="p-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 text-gray-700">{a.vehicleId}</td>
                      <td className="p-3 text-gray-700">{a.serviceCenterId}</td>
                      <td className="p-3 text-gray-700">{a.serviceType}</td>
                      <td className="p-3 text-gray-700">
                        {new Date(a.appointmentDate).toLocaleString("vi-VN")}
                      </td>
                      <td className="p-3 font-semibold">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            a.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : a.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : a.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
