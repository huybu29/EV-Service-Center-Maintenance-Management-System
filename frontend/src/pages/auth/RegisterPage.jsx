import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
// Import icons từ react-icons
import { FiUser, FiLock, FiMail, FiPhone, FiHeart } from "react-icons/fi";
import { AiOutlineGoogle } from "react-icons/ai";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("auth/register", form);
      setMessage("✅ Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Thêm delay nhỏ để người dùng đọc tin nhắn
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "⚠️ Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-10">
            <img src="/path/to/your/logo.png" alt="EV Service Center Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-semibold text-gray-800">EV Service Center</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản của bạn</h2>
          <p className="text-gray-500 mb-8">Bắt đầu quản lý lịch bảo dưỡng ngay hôm nay.</p>

          <div className="flex mb-6">
            <button 
              className="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg mr-2"
              onClick={() => navigate('/login')} // Thêm điều hướng
            >
              Đăng nhập
            </button>
            <button className="flex-1 py-3 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg ml-2">
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Tên đăng nhập */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Họ và tên */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <FiHeart className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Thông báo */}
            {message && (
              <p
                className={`text-sm text-center py-2 rounded ${
                  message.includes("✅")
                    ? "text-green-600 bg-green-50"
                    : "text-red-500 bg-red-50"
                }`}
              >
                {message}
              </p>
            )}

            {/* Nút Đăng ký */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-2"
            >
              Tạo tài khoản
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">Hoặc tiếp tục với</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <AiOutlineGoogle className="w-5 h-5 mr-2" />
            Đăng ký bằng Google
          </button>

          <p className="mt-8 text-xs text-gray-500 text-center">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a> và{" "}
            <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a> của chúng tôi.
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-200">
        <img
          src="https://via.placeholder.com/800x1000" // Thay thế bằng hình ảnh của bạn
          alt="Modern electric car in a service garage"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default RegisterPage;