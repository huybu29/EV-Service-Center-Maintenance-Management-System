import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const StaffCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  // 🔹 Lấy danh sách khách hàng
  const fetchCustomers = async () => {
    try {
      const res = await api.get("/users/role/ROLE_CUSTOMER", {
        headers: { "X-User-Role": "ROLE_STAFF" },
      });
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🔹 Lọc danh sách theo từ khóa tìm kiếm
  useEffect(() => {
    setFilteredCustomers(
      customers.filter(
        (c) =>
          (c.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
          (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
          (c.phone || "").toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, customers]);

  // 🔹 Xử lý thay đổi trong form thêm khách hàng
  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Gửi yêu cầu thêm khách hàng mới
  const handleAddCustomer = async () => {
    if (!newCustomer.username || !newCustomer.password) {
      alert("Vui lòng nhập tên đăng nhập và mật khẩu!");
      return;
    }

    try {
      await api.post("/users/create-customer", newCustomer, {
        headers: { "X-User-Role": "ROLE_STAFF" },
      });

      alert("✅ Thêm khách hàng thành công!");
      setShowModal(false);
      setNewCustomer({
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
      });
      fetchCustomers();
    } catch (error) {
      console.error("❌ Lỗi khi thêm khách hàng:", error);
      alert("Thêm khách hàng thất bại!");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        👥 Quản lý Khách hàng
      </h2>
      <p className="text-gray-600 mb-4">
        Nhân viên có thể thêm, tìm kiếm và cập nhật thông tin khách hàng.
      </p>

      {/* Search & Add */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm họ tên, email hoặc số điện thoại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ➕ Thêm khách hàng
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Tên đăng nhập</th>
              <th className="px-4 py-2 text-left">Họ tên</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">SĐT</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c, idx) => (
                <tr key={c.id} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{c.username}</td>
                  <td className="px-4 py-2">{c.fullName}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/staff/customers/${c.id}`)}
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                    >
                      ✏️ Cập nhật
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có khách hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm khách hàng */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">➕ Thêm khách hàng mới</h3>
            <div className="space-y-2">
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={newCustomer.username}
                onChange={handleNewCustomerChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={newCustomer.password}
                onChange={handleNewCustomerChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={newCustomer.fullName}
                onChange={handleNewCustomerChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={handleNewCustomerChange}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                value={newCustomer.phone}
                onChange={handleNewCustomerChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCustomers;
