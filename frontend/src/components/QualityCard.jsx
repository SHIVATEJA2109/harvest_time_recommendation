import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, Package, Leaf } from 'lucide-react';

const QualityCard = ({ result }) => {
    if (!result) return null;

    const { quality, label, action } = result;

    const getConfig = () => {
        switch (quality) {
            case 'Fresh':
                return {
                    color: 'text-emerald-700',
                    gradientText: 'from-emerald-600 to-emerald-400',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
                    actionIcon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
                    actionBg: 'bg-emerald-100/50'
                };
            case 'Medium':
                return {
                    color: 'text-amber-700',
                    gradientText: 'from-amber-600 to-amber-400',
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
                    actionIcon: <Package className="w-6 h-6 text-amber-600" />,
                    actionBg: 'bg-amber-100/50'
                };
            case 'Poor':
                return {
                    color: 'text-red-700',
                    gradientText: 'from-red-600 to-red-400',
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: <AlertOctagon className="w-8 h-8 text-red-500" />,
                    actionIcon: <Leaf className="w-6 h-6 text-red-600" />,
                    actionBg: 'bg-red-100/50'
                };
            default:
                return { color: 'text-gray-600', gradientText: 'from-gray-600 to-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', icon: null, actionIcon: null, actionBg: 'bg-gray-100' };
        }
    };

    const config = getConfig();

    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${config.bg} ${config.border} flex flex-col md:flex-row items-center md:items-start space-y-5 md:space-y-0 md:space-x-6 shadow-sm`}>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-white/50">
                    {config.icon}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Detected Quality</p>
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-3">
                        <h4 className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br ${config.gradientText}`}>{quality}</h4>
                        <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-white text-gray-800 shadow-sm border border-gray-100 uppercase tracking-wide">
                            {label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recommended Action</h5>
                <div className={`flex items-start md:items-center space-x-4 p-5 rounded-xl border border-dashed border-gray-200 ${config.actionBg}`}>
                    <div className="flex-shrink-0 mt-1 md:mt-0 p-2 bg-white rounded-lg shadow-sm">
                        {config.actionIcon}
                    </div>
                    <p className="text-gray-800 font-bold text-lg leading-tight">
                        {action}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QualityCard;
