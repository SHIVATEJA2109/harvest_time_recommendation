import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, Activity, LayoutDashboard, LineChart, Cloud } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { useCrop } from '../context/CropContext';

export default function Layout({ children }) {
    const { user } = useUser();
    const { selectedCrop, setSelectedCrop, crops } = useCrop();

    return (
        <div className="min-h-screen bg-agri-50 text-slate-800 font-sans pb-12">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <Sprout className="h-8 w-8 text-agri-600" />
                            <h1 className="text-2xl font-bold border-none text-gray-900 tracking-tight m-0 p-0 leading-none">Smart Harvest Advisor</h1>
                        </div>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex space-x-1">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? "bg-agri-50 text-agri-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Crop Analysis
                            </NavLink>
                            <NavLink
                                to="/forecast"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? "bg-agri-50 text-agri-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                <Cloud className="w-4 h-4 mr-2" />
                                5-Day Forecast
                            </NavLink>
                            <NavLink
                                to="/trends"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? "bg-agri-50 text-agri-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                <LineChart className="w-4 h-4 mr-2" />
                                Price Trends
                            </NavLink>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-2 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            {/* <Activity className="w-4 h-4 text-blue-500" /> */}
                            {/* <span>Predictability Engine</span> */}
                        </div>

                        {/* Global Crop Selector */}
                        <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
                            <Sprout className="w-4 h-4 text-agri-500 mr-2" />
                            <select
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                className="appearance-none bg-transparent font-bold text-slate-700 text-sm focus:outline-none cursor-pointer pr-6"
                            >
                                {crops.map(crop => (
                                    <option key={crop} value={crop}>{crop}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main>
                {children}
            </main>
        </div>
    );
}
