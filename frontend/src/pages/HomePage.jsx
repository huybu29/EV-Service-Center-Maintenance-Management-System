// src/pages/Homepage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineLightningBolt, HiOutlineCalendar, HiOutlineCurrencyDollar, HiArrowRight } from "react-icons/hi";

const Homepage = () => {
  return (
    <div className="font-sans text-gray-900 bg-white">
      
      {/* === HEADER / NAVBAR === */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <HiOutlineLightningBolt className="w-8 h-8 text-blue-600" />
             <span className="text-2xl font-extrabold tracking-tight text-gray-900">EV Service</span>
          </div>
          
          <div className="flex items-center gap-4">
             <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600">Đăng nhập</Link>
             <Link to="/register" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition transform hover:scale-105">
                Đăng ký ngay
             </Link>
          </div>
        </div>
      </header>

      {/* === HERO SECTION === */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wide mb-6 uppercase">
             Giải pháp quản lý xe điện toàn diện
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Bảo dưỡng thông minh <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Vận hành bền bỉ
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Hệ thống quản lý dịch vụ xe điện hiện đại giúp bạn theo dõi lịch trình bảo dưỡng, chi phí và đặt lịch hẹn chỉ trong vài giây.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2">
               Bắt đầu miễn phí <HiArrowRight />
            </Link>
            <a href="#features" className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition">
               Tìm hiểu thêm
            </a>
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-16 relative mx-auto max-w-5xl">
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
             
          </div>
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tính năng vượt trội</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Tối ưu hóa trải nghiệm sở hữu xe điện của bạn với bộ công cụ quản lý chuyên nghiệp.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-blue-600 hover:text-white transition duration-300 cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:bg-white/20 group-hover:text-white transition">
                <HiOutlineCalendar />
              </div>
              <h3 className="text-xl font-bold mb-3">Đặt lịch thông minh</h3>
              <p className="text-gray-500 group-hover:text-blue-100">
                Đặt lịch bảo dưỡng trực tuyến nhanh chóng. Hệ thống tự động gợi ý trạm dịch vụ gần nhất và khung giờ trống.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-purple-600 hover:text-white transition duration-300 cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-white text-purple-600 flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:bg-white/20 group-hover:text-white transition">
                <HiOutlineLightningBolt />
              </div>
              <h3 className="text-xl font-bold mb-3">Theo dõi sức khỏe xe</h3>
              <p className="text-gray-500 group-hover:text-purple-100">
                Cập nhật chỉ số pin (SOC), Odometer và nhận cảnh báo bảo dưỡng định kỳ tự động dựa trên dữ liệu thực tế.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-indigo-600 hover:text-white transition duration-300 cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-white text-indigo-600 flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:bg-white/20 group-hover:text-white transition">
                <HiOutlineCurrencyDollar />
              </div>
              <h3 className="text-xl font-bold mb-3">Minh bạch chi phí</h3>
              <p className="text-gray-500 group-hover:text-indigo-100">
                Quản lý lịch sử hóa đơn, xem trước báo giá dịch vụ và thanh toán online an toàn qua cổng thanh toán tích hợp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === STATS SECTION === */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
                <div className="text-4xl font-extrabold text-blue-400 mb-2">50+</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Trạm dịch vụ</div>
            </div>
            <div>
                <div className="text-4xl font-extrabold text-purple-400 mb-2">10k+</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Khách hàng</div>
            </div>
            <div>
                <div className="text-4xl font-extrabold text-green-400 mb-2">99%</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Hài lòng</div>
            </div>
            <div>
                <div className="text-4xl font-extrabold text-yellow-400 mb-2">24/7</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">Hỗ trợ</div>
            </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <HiOutlineLightningBolt className="w-6 h-6 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">EV Service</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Nền tảng tiên phong trong việc số hóa quy trình bảo dưỡng và chăm sóc xe điện tại Việt Nam.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-gray-900 mb-4">Sản phẩm</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-blue-600">Đặt lịch</a></li>
                    <li><a href="#" className="hover:text-blue-600">Tra cứu phụ tùng</a></li>
                    <li><a href="#" className="hover:text-blue-600">Bảng giá</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-gray-900 mb-4">Công ty</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-blue-600">Về chúng tôi</a></li>
                    <li><a href="#" className="hover:text-blue-600">Liên hệ</a></li>
                    <li><a href="#" className="hover:text-blue-600">Chính sách bảo mật</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center border-t border-gray-100 pt-8">
            <p className="text-sm text-gray-400">&copy; 2025 EV Service Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;