import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, ThermometerSnowflake, CloudLightning, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function DetailedForecast() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const response = await axios.post('http://localhost:8000/weather-risk', {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                        setWeatherData(response.data);
                        setError(null);
                    } catch (err) {
                        setError(err.response?.data?.detail || "Failed to fetch weather forecast.");
                    } finally {
                        setLoading(false);
                    }
                },
                (err) => {
                    setError("Location access denied. Please enable location services.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []);

    const getWeatherIcon = (condition) => {
        const cond = condition.toLowerCase();
        if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className="w-10 h-10 text-blue-500" />;
        if (cond.includes('storm') || cond.includes('thunder')) return <CloudLightning className="w-10 h-10 text-violet-500" />;
        if (cond.includes('snow')) return <ThermometerSnowflake className="w-10 h-10 text-cyan-400" />;
        if (cond.includes('cloud')) return <Cloud className="w-10 h-10 text-slate-400" />;
        return <Sun className="w-10 h-10 text-amber-500" />;
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-32 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-8 text-center flex flex-col items-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="font-bold text-xl text-red-700">Forecast Unavailable</h3>
                    <p className="text-red-500 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (!weatherData) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8">
                <div>
                    <div className="flex items-center text-agri-600 font-bold mb-2 uppercase tracking-wide text-sm">
                        <MapPin className="w-4 h-4 mr-1.5" /> {weatherData.location}
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        5-Day Risk Forecast
                    </h2>
                </div>

                <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 shadow-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> Extended Outlook
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-10 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {weatherData.forecast?.map((day, idx) => (
                        <div
                            key={day.date}
                            className={`relative rounded-2xl p-6 flex flex-col items-center text-center transition-all ${idx === 0
                                ? "bg-agri-50 border-2 border-agri-200 shadow-md"
                                : "bg-slate-50 border border-slate-100 hover:border-slate-300 hover:shadow-sm"
                                }`}
                        >
                            {idx === 0 && (
                                <span className="absolute -top-3 bg-agri-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                    Today
                                </span>
                            )}

                            <div className="text-sm font-bold text-slate-500 mb-4 whitespace-nowrap">
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>

                            <div className="mb-4">
                                {getWeatherIcon(day.condition)}
                            </div>

                            <div className="text-lg font-black text-slate-800 mb-1">
                                {day.condition}
                            </div>

                            <div className="flex items-center space-x-3 mt-2">
                                <div className="text-rose-600 font-bold flex items-center text-sm">
                                    <span className="text-xs text-rose-400 mr-1">H</span> {Math.round(day.temp_max)}°
                                </div>
                                <div className="text-blue-600 font-bold flex items-center text-sm">
                                    <span className="text-xs text-blue-400 mr-1">L</span> {Math.round(day.temp_min)}°
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Highlight Recommendation */}
            <div className="bg-amber-50 rounded-2xl p-6 md:p-8 border border-amber-200 shadow-sm flex items-start">
                <AlertTriangle className="w-6 h-6 text-amber-500 mr-4 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-amber-900 font-bold mb-1">AI Recommendation Update</h4>
                    <p className="text-amber-700 font-medium">
                        Based on the extended outlook, your current risk status remains: <span className="font-extrabold uppercase bg-amber-100 px-1 rounded">{weatherData.risk_score}</span>. {weatherData.recommendation} Ensure storage preparations are aligned with the 5-day trajectory.
                    </p>
                </div>
            </div>
        </div>
    );
}
