import React from 'react';
import { Sprout, ArrowRight, ShieldCheck, Activity, BarChart3 } from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-agri-100 to-transparent opacity-50"></div>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-agri-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-10vh]">

                {/* Logo & Badge */}
                <div className="flex flex-col items-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-6 border border-slate-100">
                        <Sprout className="w-12 h-12 text-agri-500" />
                    </div>
                    <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">AI Predictability Engine</span>
                    </div>
                </div>

                {/* Hero Text */}
                <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                    Optimize Your Harvest.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-500 to-emerald-600">
                        Maximize Your Market.
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 font-medium">
                    Upload crop images to immediately detect quality, predict market prices, and receive real-time dispatch diversion strategies.
                </p>

                {/* Auth Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                        <button className="w-full sm:w-auto px-8 py-4 bg-agri-500 hover:bg-agri-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-agri-500/30 transition-all flex items-center justify-center hover:-translate-y-1">
                            Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </SignUpButton>

                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 hover:text-slate-900 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-bold text-lg transition-all flex items-center justify-center hover:-translate-y-1">
                            Sign In for Farmers
                        </button>
                    </SignInButton>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <ShieldCheck className="w-8 h-8 text-agri-500 mb-4" />
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Automated Quality Control</h3>
                        <p className="text-slate-500 text-sm">Computer vision instantly grades your yield tier (Premium, Standard, Spoiled).</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <BarChart3 className="w-8 h-8 text-emerald-500 mb-4" />
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Live Market Sync</h3>
                        <p className="text-slate-500 text-sm">Real-time visibility into local market prices and buyer demand alerts.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Activity className="w-8 h-8 text-blue-500 mb-4" />
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Smart Diversion</h3>
                        <p className="text-slate-500 text-sm">Actionable routes to juice units or compost to prevent 100% loss.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
