import React, { useState, useEffect } from 'react';
import { Sprout, Activity } from 'lucide-react';
import FileUpload from './FileUpload';
import QualityCard from './QualityCard';
import MarketSync from './MarketSync';
import WeatherWidget from './WeatherWidget';
import OptimalWindowWidget from './OptimalWindowWidget';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useCrop } from '../context/CropContext';
import axios from 'axios';

function Dashboard() {
    const { user } = useUser();
    const { selectedCrop } = useCrop();
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Weather State
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(null);

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
                        setWeatherError(null);
                    } catch (err) {
                        setWeatherError(err.response?.data?.detail || "Failed to fetch weather data.");
                    } finally {
                        setWeatherLoading(false);
                    }
                },
                (err) => {
                    setWeatherError("Location access denied. Please enable location services.");
                    setWeatherLoading(false);
                }
            );
        } else {
            setWeatherError("Geolocation is not supported by your browser.");
            setWeatherLoading(false);
        }
    }, []);

    const handleUpload = async (uploadedFile) => {
        setFile(uploadedFile);
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('crop_type', selectedCrop); // Send expected crop to backend

        try {
            const response = await axios.post('http://localhost:8000/analyze-crop', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error analyzing crop:', error);
            alert('Failed to analyze crop. Ensure the FastAPI backend is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex flex-col items-center">

            {/* Intro */}
            <section className="text-center max-w-3xl mx-auto space-y-5 animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-500 to-emerald-600 drop-shadow-sm">{user?.firstName || 'Farmer'}</span>!
                </h2>
                <p className="text-lg md:text-xl text-gray-600 font-medium pb-2">
                    Upload an image of your crop to instantly detect quality, predict market value, and get actionable diversion strategies.
                </p>
            </section>

            {/* AI Decision Engine (Optimal Window) */}
            <OptimalWindowWidget result={result} weatherData={weatherData} />

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Upload & Quality */}
                <div className="lg:col-span-2 space-y-8 w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-agri-100 text-agri-700 mr-3 text-sm font-bold">1</span>
                            Crop Analysis
                        </h3>
                        <FileUpload onUpload={handleUpload} loading={loading} />
                    </div>

                    {result && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow animate-fade-in-up relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-agri-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                            <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800 relative z-10">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-agri-100 text-agri-700 mr-3 text-sm font-bold">2</span>
                                Quality Assessment
                            </h3>
                            <div className="relative z-10">
                                <QualityCard result={result} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Market Sync & Weather */}
                <div className="w-full sticky top-24 space-y-6">
                    <WeatherWidget data={weatherData} loading={weatherLoading} error={weatherError} />
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 h-full hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
                            Live Market Visibility
                        </h3>
                        <MarketSync result={result} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
