import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { seller_order } from "../../api/ApiEndPoints.jsx";

const OrderTrend = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(seller_order, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orders = res.data;
        if (!orders || orders.length === 0) return;

        const counts = {};
        orders.forEach((order) => {
          order.items.forEach((item) => {
            const date = new Date(item.date).toISOString().split("T")[0];
            counts[date] = (counts[date] || 0) + 1;
          });
        });

        const dates = orders.flatMap((o) =>
          o.items.map((item) => new Date(item.date))
        );

        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        const tempData = [];
        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().split("T")[0];
          const label = d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          tempData.push({
            date: label,
            orders: counts[key] || 0,
          });
        }

        const todayKey = new Date().toISOString().split("T")[0];
        const todayLabel = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const todayExists = tempData.some((d) => d.date === todayLabel);
        if (!todayExists) {
          tempData.push({
            date: todayLabel,
            orders: counts[todayKey] || 0,
          });
        }

        setChartData(tempData);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-green-700 font-semibold mb-4 text-xl sm:text-2xl">
        📈 Order Trend
      </h2>
      <div className="w-full h-[250px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderTrend;

