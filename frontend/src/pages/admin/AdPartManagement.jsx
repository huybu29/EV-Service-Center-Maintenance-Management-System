import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminParts = () => {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredParts, setFilteredParts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    partCode: "",
    partName: "",
    category: "",
    description: "",
    unit: "",
    price: "",
    quantity: "",
    minQuantity: "",
    status: "ACTIVE",
  });

  // 🧩 Lấy danh sách phụ tùng
  const fetchParts = async () => {
    try {
      const res = await api.get("/parts");
      setParts(res.data);
      setFilteredParts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phụ tùng:", err);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // 🔍 Tìm kiếm
  useEffect(() => {
    setFilteredParts(
      parts.filter(
        (p) =>
          (p.partCode || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.partName || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.category || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, parts]);

  // 🗑️ Xóa phụ tùng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phụ tùng này?")) return;
    try {
      await api.delete(`/parts/${id}`);
      setParts(parts.filter((p) => p.partId !== id));
    } catch (err) {
      console.error("Lỗi khi xóa phụ tùng:", err);
    }
  };

  // 💾 Thêm / Cập nhật phụ tùng
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.partId) {
        await api.put(`/parts/${formData.partId}`, formData);
      } else {
        await api.post("/parts", formData);
      }
      setShowModal(false);
      setFormData({
        partCode: "",
        partName: "",
        category: "",
        description: "",
        unit: "",
        price: "",
        quantity: "",
        minQuantity: "",
        status: "ACTIVE",
      });
      fetchParts();
    } catch (err) {
      console.error("Lỗi khi lưu phụ tùng:", err);
    }
  };

  const handleEdit = (part) => {
    setFormData(part);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🧰 Quản lý phụ tùng</h2>
      <p className="text-gray-600 mb-4">Danh sách phụ tùng trong kho.</p>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, tên, loại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          ➕ Thêm phụ tùng
        </button>
      </div>

      {/* Bảng hiển thị phụ tùng */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Mã</th>
              <th className="px-4 py-2">Tên phụ tùng</th>
              <th className="px-4 py-2">Loại</th>
              <th className="px-4 py-2">Đơn vị</th>
              <th className="px-4 py-2">Giá (₫)</th>
              <th className="px-4 py-2">Số lượng</th>
              <th className="px-4 py-2">Tối thiểu</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.length > 0 ? (
              filteredParts.map((p, i) => (
                <tr key={p.partId} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-semibold">{p.partCode}</td>
                  <td className="px-4 py-2">{p.partName}</td>
                  <td className="px-4 py-2">{p.category}</td>
                  <td className="px-4 py-2">{p.unit}</td>
                  <td className="px-4 py-2">{p.price?.toLocaleString("vi-VN")}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      p.quantity <= p.minQuantity ? "text-red-500" : ""
                    }`}
                  >
                    {p.quantity}
                  </td>
                  <td className="px-4 py-2">{p.minQuantity}</td>
                  <td
                    className={`px-4 py-2 font-bold ${
                      p.status === "ACTIVE" ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {p.status}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(p.partId)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  Không có phụ tùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm / Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-2/3">
            <h3 className="text-xl font-bold mb-4">
              {formData.partId ? "✏️ Sửa phụ tùng" : "➕ Thêm phụ tùng"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Mã phụ tùng"
                value={formData.partCode}
                onChange={(e) => setFormData({ ...formData, partCode: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Tên phụ tùng"
                value={formData.partName}
                onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Loại"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Đơn vị (vd: cái, bộ)"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Giá (₫)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Số lượng hiện có"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Số lượng tối thiểu"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                className="border px-3 py-2 rounded"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <textarea
                placeholder="Mô tả chi tiết"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border px-3 py-2 rounded col-span-2"
              ></textarea>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
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

export default AdminParts;
