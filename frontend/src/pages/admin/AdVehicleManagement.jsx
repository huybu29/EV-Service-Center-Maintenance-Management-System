// src/pages/admin/AdminVehicles.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    licensePlate: "",
    brand: "",
    model: "",
    manufactureYear: "",
    currentMileage: "",
    batteryType: "",
    customerId: "",
    vin:"",
    status: "ACTIVE",
  });

  // Lấy danh sách phương tiện
  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles"); // endpoint backend
      setVehicles(res.data);
      setFilteredVehicles(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phương tiện:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter theo search
  useEffect(() => {
    setFilteredVehicles(
      vehicles.filter(
        (v) =>
          (v.licensePlate || "").toLowerCase().includes(search.toLowerCase()) ||
          (v.brand || "").toLowerCase().includes(search.toLowerCase()) ||
          (v.model || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, vehicles]);

  // Xóa phương tiện
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa phương tiện:", error);
    }
  };

  // Thêm / Sửa phương tiện
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update
        await api.put(`/vehicles/${formData.id}`, formData);
      } else {
        // Create
        await api.post("/vehicles", formData);
      }
      setShowModal(false);
      setFormData({
        licensePlate: "",
        brand: "",
        model: "",
        manufactureYear: "",
        currentMileage: "",
        batteryType: "",
        customerId: "",
        vin: "",
        status: "ACTIVE",
      });
      fetchVehicles();
    } catch (error) {
      console.error("Lỗi khi lưu phương tiện:", error);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🚗 Quản lý phương tiện</h2>
      <p className="text-gray-600 mb-4">Danh sách các xe trong hệ thống.</p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo biển số, hãng, model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition"
        >
          ➕ Thêm phương tiện
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Biển số</th>
              <th className="px-4 py-2">Hãng</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Năm SX</th>
              <th className="px-4 py-2">KM hiện tại</th>
              <th className="px-4 py-2">Battery</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
              <th className="px-4 py-2">VIN</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((v, idx) => (
                <tr key={v.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{v.licensePlate}</td>
                  <td className="px-4 py-2">{v.brand}</td>
                  <td className="px-4 py-2">{v.model}</td>
                  <td className="px-4 py-2">{v.manufactureYear}</td>
                  <td className="px-4 py-2">{v.currentMileage || 0}</td>
                  <td className="px-4 py-2">{v.batteryType}</td>
                  <td className="px-4 py-2">{v.status}</td>
                  <td className="px-4 py-2">{v.vin}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(v)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
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
                  Không có phương tiện nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-2/3">
            <h3 className="text-xl font-bold mb-4">{formData.id ? "Sửa" : "Thêm"} phương tiện</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Biển số"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Hãng"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Năm SX"
                value={formData.manufactureYear}
                onChange={(e) => setFormData({ ...formData, manufactureYear: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="KM hiện tại"
                value={formData.currentMileage}
                onChange={(e) => setFormData({ ...formData, currentMileage: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Battery Type"
                value={formData.batteryType}
                onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Customer ID"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="VIN"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="border px-3 py-2 rounded"
              />

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="IN_SERVICE">IN_SERVICE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
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

export default AdminVehicles;
