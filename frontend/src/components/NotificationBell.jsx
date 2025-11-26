import React, { useState, useEffect } from "react";
// Nhớ cài đặt và import db từ file cấu hình Firebase SDK của bạn
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { HiOutlineBell } from "react-icons/hi";

// Hàm chính lắng nghe thông báo từ Firestore
const NotificationBell = ({ currentUserId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;

    // 1. Định nghĩa truy vấn: Chỉ lấy thông báo cho user này, sắp xếp theo thời gian mới nhất
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUserId), // Lấy tin nhắn đích danh (userId: 4)
      orderBy("timestamp", "desc")
    );

    // 2. Lắng nghe Realtime (onSnapshot)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newUnreadCount = 0;
      
      const latestNotifications = snapshot.docs.map(doc => {
          const data = doc.data();
          if (!data.isRead) {
              newUnreadCount++;
          }
          return { id: doc.id, ...data };
      });

      setNotifications(latestNotifications);
      setUnreadCount(newUnreadCount);
      
      // OPTIONAL: Hiện toast popup khi có thông báo mới (nếu muốn)
      if (latestNotifications.length > notifications.length && notifications.length > 0) {
          console.log("🔔 Thông báo mới vừa đến!");
      }
    });

    // Cleanup: Ngắt lắng nghe khi component unmount
    return () => unsubscribe();
  }, [currentUserId]);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-full hover:bg-gray-200 transition relative"
      >
        <HiOutlineBell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown thông báo */}
      {showDropdown && (
        <div className="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-3 font-bold border-b text-gray-800">Thông báo ({unreadCount} mới)</div>
          <div className="max-h-64 overflow-y-auto divide-y">
            {notifications.slice(0, 5).map(noti => (
              <div key={noti.id} className={`p-3 text-sm hover:bg-gray-50 transition ${!noti.isRead ? 'bg-blue-50' : ''}`}>
                <p className="font-semibold">{noti.title}</p>
                <p className="text-xs text-gray-500 mt-1">{noti.message}</p>
                <p className="text-xs text-gray-400 text-right">{noti.timestamp?.toDate().toLocaleString('vi-VN')}</p>
              </div>
            ))}
          </div>
          <div className="p-2 text-center text-xs text-blue-600 hover:bg-gray-100 cursor-pointer border-t">Xem tất cả</div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;