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
                //console.log("📦 All Orders from API:", orders);

                if (!orders || orders.length === 0) {
                    console.log("⚠️ Orders नाहीत");
                    return;
                }

                // ✅ Step 1: Orders तारखेप्रमाणे count कर (item.date वापरून)
                const counts = {};
                orders.forEach(order => {
                    order.items.forEach(item => {
                        const date = new Date(item.date).toISOString().split("T")[0];
                        counts[date] = (counts[date] || 0) + 1;
                    });
                });

                //console.log("📊 Orders Count by Date:", counts);

                // ✅ Step 2: Min आणि Max तारीख शोध (item.date वरून)
                const dates = orders.flatMap((o) =>
                    o.items.map((item) => new Date(item.date))
                );
                const minDate = new Date(Math.min(...dates));
                const maxDate = new Date(Math.max(...dates));
                //console.log("📅 Min Date:", minDate.toISOString());
                //console.log("📅 Max Date:", maxDate.toISOString());

                // ✅ Step 3: Range मधल्या सगळ्या तारखा loop करून chartData बनव
                const tempData = [];
                for (
                    let d = new Date(minDate);
                    d <= maxDate;
                    d.setDate(d.getDate() + 1)
                ) {
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

                //console.log("✅ Final Chart Data:", tempData);
                setChartData(tempData);
            } catch (err) {
                console.error("❌ Error fetching orders:", err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="w-full h-[400px] bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">📈 Order Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        angle={-45}
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
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrderTrend;
