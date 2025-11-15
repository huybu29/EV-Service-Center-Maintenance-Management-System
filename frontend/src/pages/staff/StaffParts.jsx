import React, { useEffect, useState } from "react";
import api from "../../services/api";

const StaffParts = () => {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredParts, setFilteredParts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    partId: "",
    partName: "",
    category: "",
    quantity: "",
    minQuantity: "",
  });

  // 🔹 Lấy danh sách phụ tùng
  const fetchParts = async () => {
    try {
      const res = await api.get("/parts", {
        headers: { "X-User-Role": "ROLE_STAFF" },
      });
      setParts(res.data);
      setFilteredParts(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách phụ tùng:", err);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // 🔍 Lọc phụ tùng theo tìm kiếm
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

  // 🧾 Mở modal chỉnh sửa
  const handleEdit = (part) => {
    setFormData({
      partId: part.partId,
      partName: part.partName,
      category: part.category,
      quantity: part.quantity,
      minQuantity: part.minQuantity,
    });
    setShowModal(true);
  };

  // 💾 Gửi request cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPart = {
        quantity: formData.quantity,
        minQuantity: formData.minQuantity,
      };

      await api.put(`/parts/${formData.partId}`, updatedPart, {
        headers: { "X-User-Role": "ROLE_STAFF" },
      });

      alert("✅ Cập nhật số lượng phụ tùng thành công!");
      setShowModal(false);
      fetchParts();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật phụ tùng:", err);
      alert("❌ Cập nhật thất bại!");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🧰 Quản lý Phụ tùng (Nhân viên)</h2>
      <p className="text-gray-600 mb-4">
        Nhân viên có thể xem và cập nhật số lượng phụ tùng trong kho. Không thể thay đổi giá.
      </p>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo mã, tên, loại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 w-1/2"
        />
      </div>

      {/* Bảng phụ tùng */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Mã</th>
              <th className="px-4 py-2">Tên phụ tùng</th>
              <th className="px-4 py-2">Loại</th>
              <th className="px-4 py-2">Giá (₫)</th>
              <th className="px-4 py-2">Số lượng</th>
              <th className="px-4 py-2">Tối thiểu</th>
              <th className="px-4 py-2 text-center">Cập nhật</th>
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
                  <td className="px-4 py-2 text-gray-500">
                    {p.price?.toLocaleString("vi-VN")}
                  </td>
                  <td className={`px-4 py-2 font-semibold ${p.quantity <= p.minQuantity ? "text-red-500" : ""}`}>
                    {p.quantity}
                  </td>
                  <td className="px-4 py-2">{p.minQuantity}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  Không có phụ tùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chỉnh sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">🔧 Cập nhật số lượng phụ tùng</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.partName}
                disabled
                className="border px-3 py-2 rounded bg-gray-100"
              />
              <input
                type="text"
                value={formData.category}
                disabled
                className="border px-3 py-2 rounded bg-gray-100"
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
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffParts;
