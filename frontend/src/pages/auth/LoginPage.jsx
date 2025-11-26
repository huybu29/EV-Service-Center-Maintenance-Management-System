import React, { useState, useContext } from "react";
import { AuthContext } from "../../services/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineGoogle } from "react-icons/ai";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roleBasedRedirect = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        navigate("/admin");
        break;
      case "ROLE_STAFF":
        navigate("/staff");
        break;
      case "ROLE_CUSTOMER":
        navigate("/customer/home");
        break;
      case "ROLE_TECHNICIAN":
        navigate("/technician/dashboard");
        break;  
      default:
        navigate("/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("auth/login", { username, password });
      const token = res.data.token;

      if (!token) {
        throw new Error("Không nhận được token");
      }

      const userRes = await api.get("users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data;

      if (!user || !user.role) {
        throw new Error("Không thể lấy thông tin người dùng hoặc vai trò");
      }

      login(token);
      roleBasedRedirect(user.role);

    } catch (err) {
      console.error("Login failed", err);
      setError("⚠️ Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-10">
            <img
              src="https://placehold.co/32x32/007aff/ffffff?text=E"
              alt="EV Service Center Logo"
              className="h-8 w-8 mr-2 rounded"
            />
            <span className="text-xl font-semibold text-gray-800">
              EV Service Center
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại
          </h2>
          <p className="text-gray-500 mb-8">
            Đăng nhập để quản lý lịch bảo dưỡng của bạn.
          </p>

          <div className="flex mb-6">
            <button className="flex-1 py-3 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg mr-2">
              Đăng nhập
            </button>
            <button
              className="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg ml-2"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên đăng nhập
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <a
                href="#"
                className="block text-right text-sm text-blue-600 hover:underline mt-2"
              >
                Quên mật khẩu?
              </a>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">Hoặc tiếp tục với</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <AiOutlineGoogle className="w-5 h-5 mr-2" />
            Đăng nhập bằng Google
          </button>

          <p className="mt-8 text-xs text-gray-500 text-center">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Chính sách bảo mật
            </a>{" "}
            của chúng tôi.
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-200">
        <img
          src="https://images.unsplash.com/photo-1617051084221-39320BPu4J4?q=80&w=1974&auto=format&fit=crop"
          alt="Modern electric car in a service garage"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;