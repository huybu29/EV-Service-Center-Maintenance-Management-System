import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AdminStations = () => {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newStation, setNewStation] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: 0,
    longitude: 0,
    status: "ACTIVE",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  
  const fetchStations = async () => {
    try {
      const res = await api.get("/stations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStations(res.data);
      setFilteredStations(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách trạm:", error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    setFilteredStations(
      stations.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (s.address || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, stations]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa trạm này?")) return;
    try {
      await api.delete(`/stations/${id}`, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setStations(stations.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa trạm:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await api.post("/stations", newStation, {
        headers: { "X-User-Role": "ROLE_ADMIN" },
      });
      setStations([...stations, res.data]);
      setShowModal(false);
      setNewStation({
        name: "",
        address: "",
        phone: "",
        latitude: 0,
        longitude: 0,
        status: "ACTIVE",
      });
    } catch (error) {
      console.error("Lỗi khi tạo trạm:", error);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🏭 Quản lý trạm</h2>
          <p className="text-gray-600">Danh sách các trung tâm / trạm đổi pin trong hệ thống.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          ➕ Thêm trạm
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc địa chỉ trạm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Tên trạm</th>
              <th className="px-4 py-2 text-left">Địa chỉ</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Vĩ độ</th>
              <th className="px-4 py-2 text-left">Kinh độ</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStations.length > 0 ? (
              filteredStations.map((s, idx) => (
                <tr key={s.id} className="border-t hover:bg-green-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.address}</td>
                  <td className="px-4 py-2">{s.phone}</td>
                  <td className="px-4 py-2">{s.status}</td>
                  <td className="px-4 py-2">{s.latitude}</td>
                  <td className="px-4 py-2">{s.longitude}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/admin/stations/${s.id}`)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
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
                  Không có trạm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm trạm */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">➕ Thêm trạm mới</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên trạm"
                value={newStation.name}
                onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Địa chỉ"
                value={newStation.address}
                onChange={(e) => setNewStation({ ...newStation, address: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newStation.phone}
                onChange={(e) => setNewStation({ ...newStation, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Vĩ độ"
                value={newStation.latitude}
                onChange={(e) =>
                  setNewStation({ ...newStation, latitude: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Kinh độ"
                value={newStation.longitude}
                onChange={(e) =>
                  setNewStation({ ...newStation, longitude: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <select
                value={newStation.status}
                onChange={(e) => setNewStation({ ...newStation, status: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStations;
