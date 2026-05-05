// src/pages/customer/MyVehicles.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    brand: "",
    model: "",
    manufactureYear: "",
    currentMileage: "",
    batteryType: "",
    vin: "",
  });

    const token = localStorage.getItem("accessToken");
    const user = token ? jwtDecode(token) : null;
    const userId = user?.userId;
    const userRole = user?.role;

  const fetchVehicles = async () => {
    try {
      const res = await api.get(`/vehicles/customer/${userId}`, {
        headers: {
          "X-User-Role": userRole,
          "X-User-Id": userId,
        },
      });
      setVehicles(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách xe:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vehicles", newVehicle);
      setShowForm(false);
      setNewVehicle({
        licensePlate: "",
        brand: "",
        model: "",
        manufactureYear: "",
        currentMileage: "",
        batteryType: "",
      });
      fetchVehicles();
    } catch (err) {
      console.error("Lỗi khi thêm xe:", err);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Đang tải dữ liệu...</p>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* Tiêu đề */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            🚗 Phương tiện của tôi
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
          >
            {showForm ? "✖️ Hủy" : "+ Thêm phương tiện"}
          </button>
        </div>

        {/* Form thêm xe */}
        {showForm && (
          <form
            onSubmit={handleAddVehicle}
            className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-8 shadow-sm"
          >
            <div className="grid md:grid-cols-2 gap-5">
              {[
              
                { key: "brand", placeholder: "Hãng xe" },
                { key: "model", placeholder: "Model xe" },
                {
                  key: "manufactureYear",
                  placeholder: "Năm sản xuất",
                  type: "number",
                },
                {
                  key: "currentMileage",
                  placeholder: "Số km hiện tại",
                  type: "number",
                },
                { key: "batteryType", placeholder: "Loại pin" },
                { key: "vin", placeholder: "VIN" },
              ].map((field) => (
                <input
                  key={field.key}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={newVehicle[field.key]}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      [field.key]: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              ))}
            </div>
            <div className="text-right mt-6">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
              >
                ✅ Lưu phương tiện
              </button>
            </div>
          </form>
        )}

        {/* Danh sách xe */}
        {vehicles.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            Bạn chưa có phương tiện nào được thêm.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="p-6 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {v.brand} {v.model}
                </h3>
                <p className="text-gray-600">
                  <strong>Biển số:</strong> {v.licensePlate}
                </p>
                <p className="text-gray-600">
                  <strong>Năm sản xuất:</strong> {v.manufactureYear}
                </p>
                <p className="text-gray-600">
                  <strong>Số km:</strong> {v.currentMileage}
                </p>
                <p className="text-gray-600">
                  <strong>Loại pin:</strong> {v.batteryType}
                </p>
                <p className="mt-2">
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      v.status === "ACTIVE"
                        ? "text-green-600"
                        : v.status === "IN_SERVICE"
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    {v.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVehicles;
