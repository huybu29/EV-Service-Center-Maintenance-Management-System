import { HiLightningBolt } from "react-icons/hi";

const PartCard = ({ part }) => {
  // Parse chuỗi JSON từ DB
  const aiData = part.aiForecast ? JSON.parse(part.aiForecast) : null;

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="font-bold text-lg">{part.partName}</h3>
      <p className="text-sm text-gray-500">Mã: {part.partCode}</p>
      
      <div className="mt-2 flex justify-between items-center">
        <span className="text-gray-700">Tồn kho: <strong>{part.quantity}</strong></span>
      </div>

      {/* KHUNG HIỂN THỊ AI */}
      {aiData && (
        <div className="mt-3 bg-indigo-50 border border-indigo-100 p-3 rounded-md">
            <div className="flex items-center gap-1 text-indigo-700 font-bold text-xs uppercase mb-1">
                <HiLightningBolt /> Gemini AI Dự báo
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-900">Nhu cầu tháng tới:</span>
                <span className="text-lg font-bold text-indigo-700">{aiData.predicted}</span>
            </div>
            <p className="text-xs text-indigo-500 mt-1 italic">"{aiData.reason}"</p>
            
            {/* Cảnh báo nếu Tồn kho < Dự báo */}
            {part.quantity < aiData.predicted && (
                <div className="mt-2 text-center bg-red-100 text-red-700 text-xs font-bold py-1 rounded">
                    ⚠️ Cần nhập thêm hàng!
                </div>
            )}
        </div>
      )}
    </div>
  );
};
export default PartCard