// src/pages/Homepage.jsx
import React from "react";

const Homepage = () => {
  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Quản lý bảo dưỡng xe điện thông minh & hiệu quả
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Theo dõi xe, đặt lịch dịch vụ và quản lý chi phí — tất cả trong một nền tảng trực tuyến.
          </p>

          <div className="flex justify-center space-x-4">
            <a
              href="/register"
              className="bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
            >
              Đăng ký ngay
            </a>
            <a
              href="#features"
              className="border border-gray-800 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 hover:text-white transition"
            >
              Tìm hiểu thêm
            </a>
          </div>

          <div className="mt-12">
            <img
              src="https://cdn.pixabay.com/photo/2016/11/29/02/32/electric-car-1867885_1280.jpg"
              alt="EV Car"
              className="mx-auto rounded-2xl shadow-xl max-w-full h-auto grayscale hover:grayscale-0 transition duration-700"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Tính năng nổi bật
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              🕒 Nhắc nhở & Theo dõi xe
            </h3>
            <p className="text-gray-600">
              Nhắc nhở bảo dưỡng định kỳ theo km hoặc thời gian, quản lý thông tin xe dễ dàng.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              📅 Đặt lịch dịch vụ trực tuyến
            </h3>
            <p className="text-gray-600">
              Lựa chọn trung tâm dịch vụ phù hợp và nhận xác nhận nhanh chóng.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              💰 Quản lý chi phí & Thanh toán
            </h3>
            <p className="text-gray-600">
              Theo dõi chi phí từng lần bảo dưỡng và thanh toán trực tuyến an toàn, tiện lợi.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">&copy; 2025 EV Service Center. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
