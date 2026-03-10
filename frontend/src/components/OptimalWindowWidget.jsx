import React, { useState, useEffect, useMemo } from 'react';
import { CalendarClock, AlertCircle, TrendingUp, CheckCircle2, DollarSign } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import axios from 'axios';

export default function OptimalWindowWidget({ result, weatherData }) {
    const { selectedCrop } = useCrop();
    if (!result || !weatherData) return null;

    // Decision Engine Logic
    let recommendation = "";
    let urgency = "";
    let storageAdvice = "";
    let colorClass = "";
    let Icon = CalendarClock;

    const weatherRisk = weatherData?.risk_score || "Low";
    const cropQuality = result?.quality || "Fresh";

    const [priceData, setPriceData] = useState([]);
    const [loadingPrice, setLoadingPrice] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            setLoadingPrice(true);
            try {
                const response = await axios.get(`http://localhost:8000/price-trends/${selectedCrop}`);
                setPriceData(response.data);
            } catch (err) {
                console.error("Failed to fetch price trends for Optimal Window:", err);
            } finally {
                setLoadingPrice(false);
            }
        };

        if (selectedCrop) fetchTrends();
    }, [selectedCrop]);

    const peakPoint = useMemo(() => priceData.find(d => d.isPeak) || priceData[0], [priceData]);
    const todayPoint = useMemo(() => priceData.find(d => d.isToday) || priceData[0], [priceData]);
    const potentialGain = (peakPoint && todayPoint && todayPoint.price > 0)
        ? (((peakPoint.price - todayPoint.price) / todayPoint.price) * 100).toFixed(1)
        : 0;

    // Parse the peak day offset (e.g., "+3 Days" -> 3)
    let peakDaysOffset = 0;
    if (peakPoint && peakPoint.day) {
        const match = peakPoint.day.match(/\+(\d+)/);
        if (match) peakDaysOffset = parseInt(match[1], 10);
    }

    if (weatherRisk === "High") {
        recommendation = "HARVEST IMMEDIATELY";
        urgency = "Critical Weather Threat detected. Accelerate harvest to prevent total crop rot.";
        if (peakDaysOffset > 0) {
            storageAdvice = `STORE FOR ${peakDaysOffset} ${peakDaysOffset === 1 ? 'DAY' : 'DAYS'}: Harvest immediately to avoid weather ruin, then use cold storage until the projected peak price on ${peakPoint.day}.`;
        }
        colorClass = "bg-rose-50 border-rose-200 text-rose-800";
        Icon = AlertCircle;
    } else if (cropQuality === "Poor") {
        recommendation = "HARVEST TODAY";
        urgency = "Crop is past optimal maturity. Harvest now for compost/feed diversion to minimize loss.";
        colorClass = "bg-amber-50 border-amber-200 text-amber-800";
        Icon = AlertCircle;
    } else if (cropQuality === "Medium" && weatherRisk === "Medium") {
        recommendation = "HARVEST WITHIN 24 HOURS";
        urgency = "Both crop maturity and weather risks are elevating. Do not delay.";
        if (peakDaysOffset > 1) {
            storageAdvice = `STORE FOR ${peakDaysOffset - 1} ${peakDaysOffset - 1 === 1 ? 'DAY' : 'DAYS'}: Harvest to avoid quality degrade, then store until peak price on ${peakPoint.day}.`;
        }
        colorClass = "bg-orange-50 border-orange-200 text-orange-800";
        Icon = TrendingUp;
    } else if (cropQuality === "Medium") {
        recommendation = "OPTIMAL WINDOW: 1-2 DAYS";
        urgency = "Crop is at processing maturity. Peak juice/puree market value is right now.";
        if (peakDaysOffset > 2) {
            storageAdvice = `STORE TO MAXIMIZE PROFIT: Harvest within 48 hours to preserve quality, then move to controlled storage until the peak market price hits on ${peakPoint.day}.`;
        }
        colorClass = "bg-blue-50 border-blue-200 text-blue-800";
        Icon = CheckCircle2;
    } else if (weatherRisk === "Medium") {
        recommendation = "OPTIMAL WINDOW: 2-3 DAYS";
        urgency = "Crop is Prime, but weather risk is elevating. Prepare logistics for early harvest.";
        if (peakDaysOffset > 3) {
            storageAdvice = `COLD STORAGE RECOMMENDED: Harvest before weather degrades quality, then heavily rely on cold storage until the peak price on ${peakPoint.day}.`;
        }
        colorClass = "bg-amber-50 border-amber-200 text-amber-800";
        Icon = TrendingUp;
    } else {
        recommendation = "OPTIMAL WINDOW: 3-5 DAYS";
        urgency = "Crop is Premium. Weather is stable. You have time to negotiate the best buyer contracts.";
        colorClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
        Icon = CheckCircle2;
    }

    return (
        <div className="w-full mb-8 animate-fade-in-up">
            <div className={`border-2 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-sm transition-all ${colorClass}`}>

                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-current/20 mb-4 shadow-sm">
                        <CalendarClock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">AI Harvest Decision Engine</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                        {recommendation}
                    </h3>

                    <p className="font-medium text-lg opacity-90 max-w-2xl mb-4">
                        {urgency}
                    </p>

                    {storageAdvice && (
                        <div className="bg-white/50 border border-current/20 rounded-xl p-4 mb-6 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-current opacity-30"></div>
                            <p className="text-sm font-bold flex items-start">
                                <CalendarClock className="w-5 h-5 mr-2 shrink-0 opacity-70" />
                                <span>{storageAdvice}</span>
                            </p>
                        </div>
                    )}

                    {/* Unified Profit Report Section */}
                    {cropQuality === "Fresh" && weatherRisk !== "High" && !loadingPrice && todayPoint && peakPoint && (
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white/40 rounded-xl p-4 border border-current/10">
                            <div className="bg-white rounded-lg p-3 shadow-sm text-center min-w-[120px]">
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Current Price</div>
                                <div className="text-xl font-black text-slate-800">₹{todayPoint.price.toFixed(2)}/kg</div>
                            </div>

                            <TrendingUp className="w-6 h-6 shrink-0 opacity-50 hidden sm:block mt-4" />

                            <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg p-3 shadow-sm flex-1 text-left w-full">
                                <div className="flex items-center text-xs font-bold text-emerald-600 uppercase mb-1">
                                    <DollarSign className="w-3 h-3 mr-1" /> Projected Peak ({peakPoint.day})
                                </div>
                                <div className="flex items-end space-x-3">
                                    <div className="text-2xl font-black">₹{peakPoint.price.toFixed(2)}/kg</div>
                                    <div className="text-sm font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded mb-1">
                                        + {potentialGain}% Profit Margin
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="shrink-0 hidden md:block">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center border-4 border-white shadow-inner">
                        <Icon className="w-10 h-10 md:w-12 md:h-12 opacity-80" />
                    </div>
                </div>

            </div>
        </div>
    );
}
