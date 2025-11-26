import React, { useState, useEffect, useRef } from "react";
import { db, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, where } from "../../services/firebase"; 
import { HiX, HiPaperAirplane, HiOutlineChatAlt2 } from "react-icons/hi";

const CustomerChatBox = ({ 
    isOpen, 
    onClose, 
    customerId, 
    customerName = "Bạn" 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ Room ID duy nhất cho Customer, tất cả Staff sẽ chat vào đây
  const chatRoomId = `chat_customer_${customerId}`;

  // Tự động cuộn xuống cuối
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // 1. Lắng nghe tin nhắn realtime từ tất cả Staff
  useEffect(() => {
    if (!isOpen) {
        setMessages([]);
        return;
    }

    const q = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          timestamp: doc.data().createdAt?.toDate() 
      }));
      setMessages(msgs);
      scrollToBottom();
    }, (error) => {
      console.error("Lỗi Firestore Listener:", error);
    });

    return () => unsubscribe();
  }, [isOpen, chatRoomId]);

  // 2. Gửi tin nhắn
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msg = {
      chatRoomId,
      senderId: customerId,
      senderName: customerName,
      senderRole: "CUSTOMER", // CUSTOMER gửi
      content: newMessage,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "messages"), msg);
      setNewMessage(""); 
    } catch (error) {
      console.error("Lỗi gửi tin nhắn Firebase:", error);
      alert("Lỗi gửi tin.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 animate-fadeInUp">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
            <HiOutlineChatAlt2 className="w-6 h-6"/>
            <h3 className="font-bold text-sm">Hộp chat</h3>
        </div>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded transition"><HiX size={20}/></button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">Bạn đã sẵn sàng trò chuyện.</p>
        )}

        {messages.map((msg) => {
            const isMe = msg.senderRole === "CUSTOMER";
            const senderLabel = isMe ? customerName : msg.senderName || `Staff ID ${msg.senderId}`;
            const timeStr = msg.timestamp ? msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Đang gửi...";

            return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-xl shadow-sm max-w-[85%] text-sm ${
                        isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                    }`}>
                        {!isMe && <p className="text-[10px] font-bold text-gray-500 mb-1">{senderLabel}</p>}
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>{timeStr}</p>
                    </div>
                </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={!newMessage.trim()} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:bg-gray-300">
            <HiPaperAirplane className="w-5 h-5 rotate-90 ml-0.5"/>
        </button>
      </div>
    </div>
  );
};

export default CustomerChatBox;
