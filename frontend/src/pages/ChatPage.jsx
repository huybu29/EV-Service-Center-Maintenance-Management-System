import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs"; // Thư viện Stomp
import SockJS from "sockjs-client"; // Thư viện SockJS

const SOCKET_URL = "http://localhost:8089/ws"; 

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [username, setUsername] = useState("User" + Math.round(Math.random() * 100));
  
  // Dùng useRef để giữ kết nối STOMP
  const stompClientRef = useRef(null);

  useEffect(() => {
    // 1. Khởi tạo kết nối
    const client = new Client({
      // 2. Chỉ định dùng SockJS
      webSocketFactory: () => {
        return new SockJS(SOCKET_URL);
      },
      debug: (str) => {
        console.log(new Date(), str); // Log debug
      },
      reconnectDelay: 5000,
    });

    // 3. Xử lý khi kết nối thành công
    client.onConnect = (frame) => {
      console.log("Đã kết nối: " + frame);
      
      // 4. Lắng nghe (Subscribe) topic công cộng
      client.subscribe("/topic/public-chat", (message) => {
        const receivedMessage = JSON.parse(message.body);
        // Cập nhật state để hiển thị
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    };

    // 5. Xử lý lỗi
    client.onStompError = (frame) => {
      console.error("Lỗi Broker: " + frame.headers["message"]);
      console.error("Chi tiết: " + frame.body);
    };

    // 6. Kích hoạt kết nối
    client.activate();

    // 7. Lưu client vào ref
    stompClientRef.current = client;

    // 8. Ngắt kết nối khi component unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []); // Chỉ chạy 1 lần

  // Hàm gửi tin nhắn
  const sendMessage = () => {
    if (currentMessage.trim() && stompClientRef.current?.connected) {
      
      const chatMessage = {
        sender: username,
        content: currentMessage,
        type: "CHAT",
      };

      // 9. Gửi (Publish) tin nhắn đến Controller
      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(chatMessage),
      });

      setCurrentMessage(""); // Xóa ô input
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Demo Chat (Bạn là: {username})</h1>
      
      {/* Khung chat */}
      <div className="flex-1 p-4 bg-gray-800 rounded-lg overflow-y-auto mb-4 border border-gray-700">
        {messages.length === 0 && (
          <p className="text-gray-400">Chưa có tin nhắn...</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === username ? 'text-right' : 'text-left'}`}>
            <span className={`px-3 py-2 rounded-lg inline-block ${
              msg.sender === username ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              <strong className="block text-sm">{msg.sender}</strong>
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Ô nhập liệu */}
      <div className="flex gap-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatPage;