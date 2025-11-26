import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
  LineChart, Line
} from "recharts";

const AdminFinancePartsPage = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [parts, setParts] = useState([]);
  const [summary, setSummary] = useState({ revenue: 0, cost: 0, profit: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}`, "X-User-Role": "ROLE_ADMIN" };

        // 🔹 1. Payments
        const paymentsRes = await api.get("/payments/", { headers });
        const allPayments = paymentsRes.data;

        // 🔹 2. Orders
        const ordersRes = await api.get("/orders/all", { headers });
        const allOrders = ordersRes.data;

        // 🔹 3. Parts + parse AI forecast
        const partsRes = await api.get("/parts", { headers });
       const allParts = partsRes.data.map(p => {
  let forecast = { predicted: 0, reason: "" };

  if (p.aiForecast) {
    try {
      // Nếu p.aiForecast đã là object, giữ nguyên, nếu là string thì parse
      forecast = typeof p.aiForecast === "string"
        ? JSON.parse(p.aiForecast)
        : p.aiForecast;
    } catch (e) {
      console.warn(`Không parse được AI forecast cho part ${p.part_code}`, e);
    }
  }

  return {
    ...p,
    forecast_predicted: forecast.predicted || 0,
    forecast_reason: forecast.reason || ""
  };
});

        // 🔹 4. Tính tổng doanh thu
        const revenue = allPayments
          .filter(p => p.status === "COMPLETED")
          .reduce((sum, p) => sum + p.amount, 0);

        // 🔹 5. Tính tổng chi phí (dựa trên checklist + parts)
        let totalCost = 0;
        for (const order of allOrders) {
          const checklistRes = await api.get(`/orders/${order.id}/checklist`, { headers });
          const checklist = checklistRes.data;

          checklist.forEach(item => {
            if (item.type === "SERVICE") totalCost += item.price || 0;
            if (item.parts && item.parts.length > 0) {
              item.parts.forEach(part => {
                totalCost += part.unitPrice * part.quantity;
              });
            }
          });
        }

        setPayments(allPayments);
        setOrders(allOrders);
        setParts(allParts);
        setSummary({ revenue, cost: totalCost, profit: revenue - totalCost });
        setLoading(false);

      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Quản lý Doanh thu – Chi phí – Lợi nhuận & Phụ tùng
      </h1>

      {/* 🔹 Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-green-50 rounded-lg shadow text-center">
          <h3 className="text-lg font-bold text-green-700">Doanh thu</h3>
          <p className="text-2xl font-extrabold text-green-800">{summary.revenue.toLocaleString()} đ</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg shadow text-center">
          <h3 className="text-lg font-bold text-red-700">Chi phí</h3>
          <p className="text-2xl font-extrabold text-red-800">{summary.cost.toLocaleString()} đ</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg shadow text-center">
          <h3 className="text-lg font-bold text-blue-700">Lợi nhuận</h3>
          <p className="text-2xl font-extrabold text-blue-800">{summary.profit.toLocaleString()} đ</p>
        </div>
      </div>

      {/* 🔹 Biểu đồ Doanh thu & Chi phí */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-bold mb-4">Doanh thu & Chi phí theo đơn hàng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={orders.map(o => ({
              orderId: o.id,
              revenue: payments.find(p => p.bookingID === o.appointmentId)?.amount || 0,
              cost: o.totalCost || 0
            }))}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="orderId" />
            <YAxis />
            <Tooltip formatter={val => val.toLocaleString()} />
            <Legend />
            <Bar dataKey="revenue" fill="#4ade80" name="Doanh thu" />
            <Bar dataKey="cost" fill="#f87171" name="Chi phí" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Biểu đồ dự báo nhu cầu phụ tùng */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-bold mb-4">Dự báo nhu cầu phụ tùng (AI Forecast)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={parts.map(p => ({
              name: p.partName,
              quantity: p.quantity,
              forecast: p.forecast_predicted
            }))}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={val => val.toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="quantity" stroke="#60a5fa" name="Số lượng hiện tại" />
            <Line type="monotone" dataKey="forecast" stroke="#fbbf24" name="Dự báo AI" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Bảng danh sách phụ tùng */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-bold mb-4">Danh sách phụ tùng</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mã PT</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên PT</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Số lượng</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Dự báo AI</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú dự báo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {parts.map(part => (
              <tr key={part.part_id}>
                <td className="px-4 py-2">{part.partCode}</td>
                <td className="px-4 py-2">{part.partName}</td>
                <td className="px-4 py-2">{part.category}</td>
                <td className="px-4 py-2 text-right">{part.price.toLocaleString()} đ</td>
                <td className="px-4 py-2 text-right">{part.quantity}</td>
                <td className="px-4 py-2 text-right">{part.forecast_predicted}</td>
                <td className="px-4 py-2">{part.forecast_reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFinancePartsPage;
