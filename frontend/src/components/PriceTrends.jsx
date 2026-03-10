import React, { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ReferenceLine, ReferenceDot
} from 'recharts';
import { TrendingUp, AlertTriangle, Info, CalendarDays } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import axios from 'axios';

export default function PriceTrends() {
    const { selectedCrop } = useCrop();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrends = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/price-trends/${selectedCrop}`);
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch price trends", err);
                setError("Failed to load dynamic price trends.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, [selectedCrop]);

    const peakPoint = useMemo(() => data.find(d => d.isPeak) || data[0] || { price: 0, day: '' }, [data]);
    const todayPoint = useMemo(() => data.find(d => d.isToday) || data[0] || { price: 0, day: '' }, [data]);

    const potentialGain = (peakPoint && todayPoint && todayPoint.price > 0)
        ? (((peakPoint.price - todayPoint.price) / todayPoint.price) * 100).toFixed(1)
        : 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-xl">
                    <p className="font-bold text-slate-800 mb-1">{label} {dataPoint.isToday && "(Today)"}</p>
                    <p className="text-emerald-600 font-bold text-lg">
                        ₹{dataPoint.price.toFixed(2)} / kg
                    </p>
                    {dataPoint.predicted && (
                        <p className="text-xs text-blue-500 font-bold uppercase mt-1 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> AI Projected
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Predictive Price Analysis
                    </h2>
                    <p className="text-slate-600 font-medium mt-2">
                        Forecasted market peaks to maximize your harvest profitability.
                    </p>
                </div>

                <div className="mt-4 md:mt-0 flex bg-slat-50 p-2 rounded-lg border border-slate-200 shadow-sm text-sm font-bold text-slate-500">
                    Showing projected analysis for <span className="text-agri-600 ml-1">{selectedCrop}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Insight Cards */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Current Price</div>
                        <div className="text-4xl font-black text-slate-900">₹{todayPoint?.price?.toFixed(2) || '0.00'}<span className="text-lg text-slate-500 font-medium">/kg</span></div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-agri-600 rounded-2xl p-6 border border-emerald-400 shadow-md text-white relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
                        <div className="text-sm font-bold text-emerald-100 uppercase tracking-wider mb-1">Projected Peak</div>
                        <div className="text-4xl font-black">₹{peakPoint?.price?.toFixed(2) || '0.00'}<span className="text-lg text-emerald-100 font-medium">/kg</span></div>

                        <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="flex items-center text-sm font-bold">
                                <CalendarDays className="w-4 h-4 mr-2" />
                                Target: {peakPoint?.day || 'TBD'}
                            </div>
                            <div className="text-xs font-semibold text-emerald-100 mt-1">
                                Holding harvest increases revenue by ~{potentialGain}%
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 text-blue-800">
                        <div className="flex items-start">
                            <Info className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-blue-500" />
                            <p className="text-sm font-medium">
                                Prices are projected based on historical cyclic demand, regional weather disruptions, and current supply volumes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center">
                            Market Price Curve: {selectedCrop}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm font-bold">
                            <span className="flex items-center text-slate-500">
                                <div className="w-3 h-3 rounded-full bg-slate-300 mr-2"></div> Historical
                            </span>
                            <span className="flex items-center text-emerald-600">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> Projected
                            </span>
                        </div>
                    </div>

                    {!loading && !error && data.length > 0 ? (
                        <div className="w-full h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        tickFormatter={(value) => `₹${value}`}
                                        domain={['dataMin - 5', 'dataMax + 5']}
                                    />
                                    <Tooltip content={<CustomTooltip />} />

                                    <ReferenceLine x="Today" stroke="#94a3b8" strokeDasharray="4 4" label={{ position: 'top', value: 'Today', fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />

                                    {/* Peak Highlight */}
                                    {peakPoint && peakPoint.day && (
                                        <>
                                            <ReferenceDot x={peakPoint.day} y={peakPoint.price} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />
                                            <ReferenceLine x={peakPoint.day} stroke="#10b981" strokeDasharray="3 3" />
                                        </>
                                    )}

                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                        activeDot={{ r: 8, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="w-full h-[400px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                            {loading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agri-600"></div>
                            ) : (
                                <p className="text-slate-500 font-bold">Failed to load chart data.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
