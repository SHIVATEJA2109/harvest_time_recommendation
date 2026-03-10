import React from 'react';
import { CloudRain, Sun, ThermometerSnowflake, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function WeatherWidget({ data: weatherData, loading, error }) {

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6">
                <div className="flex items-center text-red-600 mb-2">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <h3 className="font-bold">Weather Risk Unavailable</h3>
                </div>
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    if (!weatherData) return null;

    const { location, temperature, conditions, risk_score, recommendation } = weatherData;

    let riskColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    let riskIcon = <ShieldCheck className="w-6 h-6 text-emerald-500" />;

    if (risk_score === "Medium") {
        riskColor = "bg-amber-50 text-amber-700 border-amber-200";
        riskIcon = <AlertTriangle className="w-6 h-6 text-amber-500" />;
    } else if (risk_score === "High") {
        riskColor = "bg-red-50 text-red-700 border-red-200";
        riskIcon = <CloudRain className="w-6 h-6 text-red-500" />;
    }

    return (
        <div className={`rounded-2xl shadow-sm border p-6 transition-all ${riskColor}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Harvest Risk: {risk_score}</h3>
                    <div className="flex items-center text-2xl font-black">
                        {temperature}°C
                    </div>
                    <p className="text-sm font-medium opacity-90">{location} • {conditions}</p>
                </div>
                <div className="p-3 bg-white/50 rounded-full backdrop-blur-sm shadow-sm">
                    {riskIcon}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-current/20">
                <p className="text-sm font-semibold flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-80" />
                    {recommendation}
                </p>
            </div>
        </div>
    );
}
