import React, { useState } from 'react';
import { Truck, CheckCircle, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useCrop } from '../context/CropContext';

const MarketSync = ({ result }) => {
    const { selectedCrop } = useCrop();
    const [acceptedOffer, setAcceptedOffer] = useState(null);
    const [showPoolAlert, setShowPoolAlert] = useState(false);

    // Dynamic mock offers based on AI prediction and selected crop
    const getOffers = () => {
        if (!result) return [];

        // Hackathon logic: Adjust base price slightly by crop name length just to make it dynamic
        const priceModifier = selectedCrop.length * 2;

        if (result.quality === "Fresh") {
            return [
                { id: 1, buyer: "FreshMart Organic", distance: "12km", price: `₹${45 + priceModifier}/kg`, qty: "Up to 500kg", urgency: "High", type: "Premium" },
                { id: 2, buyer: "City Supermarket", distance: "28km", price: `₹${38 + priceModifier}/kg`, qty: "Any", urgency: "Medium", type: "Standard" }
            ];
        } else if (result.quality === "Medium") {
            return [
                { id: 3, buyer: "Local Juice Factory", distance: "8km", price: `₹${18 + priceModifier}/kg`, qty: "Min 100kg", urgency: "High", type: "Processing" },
                { id: 4, buyer: "City Supermarket", distance: "28km", price: `₹${22 + priceModifier}/kg`, qty: "Any", urgency: "Low", type: "Standard" }
            ];
        } else {
            return [
                { id: 5, buyer: "Green Earth Compost", distance: "5km", price: `₹${5 + Math.floor(priceModifier / 3)}/kg`, qty: "Any", urgency: "Medium", type: "Compost" },
                { id: 6, buyer: "Valley Cattle Farm", distance: "15km", price: `₹${8 + Math.floor(priceModifier / 3)}/kg`, qty: "Max 200kg", urgency: "Low", type: "Feed" }
            ];
        }
    };

    const offers = getOffers();

    const handleAccept = (offer) => {
        setAcceptedOffer(offer);
        // Simulate checking for nearby logistics pooling
        setTimeout(() => setShowPoolAlert(true), 800);
    };

    if (!result) {
        return (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                <Clock className="w-12 h-12 text-slate-300 mb-4" />
                <h4 className="text-slate-500 font-medium">Upload crop image to view pre-harvest commitments.</h4>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Active buyer contracts matching your <span className="font-bold text-slate-800">{result.quality} {selectedCrop}</span> crop.
                </p>
                <span className="flex items-center text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Real-time
                </span>
            </div>

            {/* Order Book List */}
            {!acceptedOffer ? (
                <div className="space-y-4">
                    {offers.map((offer) => (
                        <div key={offer.id} className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-agri-400 hover:shadow-md transition-all group">
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{offer.buyer}</h4>
                                        <span className="flex items-center text-xs font-medium text-slate-500 mt-1">
                                            <MapPin className="w-3 h-3 mr-1" /> {offer.distance} away
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-emerald-600">{offer.price}</div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{offer.qty}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAccept(offer)}
                                    className="w-full mt-2 bg-slate-50 group-hover:bg-agri-500 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-agri-600 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    Accept Pre-Harvest Contract <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                            {/* Side visual indicator based on urgency */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${offer.urgency === 'High' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in-up">
                    {/* Success Contract Screen */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center shadow-sm">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-emerald-900 mb-1">Contract Locked!</h4>
                        <p className="text-emerald-700 font-medium mb-4">
                            You are committed to supply <span className="font-bold">{acceptedOffer.buyer}</span> at <span className="font-bold">{acceptedOffer.price}</span>.
                        </p>
                        <button
                            onClick={() => { setAcceptedOffer(null); setShowPoolAlert(false); }}
                            className="text-sm font-bold text-emerald-600 hover:text-emerald-800 underline"
                        >
                            View other offers
                        </button>
                    </div>

                    {/* Logistics Overlay */}
                    {showPoolAlert && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm relative overflow-hidden animate-fade-in-up">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-70"></div>
                            <div className="relative z-10">
                                <div className="flex items-center text-blue-800 font-bold mb-2">
                                    <Truck className="w-5 h-5 mr-2" /> Logistics Synchronization
                                </div>
                                <p className="text-sm text-blue-700 font-medium mb-4">
                                    <span className="bg-blue-200/50 px-1.5 py-0.5 rounded text-blue-900 font-extrabold">2</span> other farmers in your area are delivering to {acceptedOffer.buyer} this week.
                                </p>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-md transition-colors flex items-center justify-center">
                                    Split Transport (Est. Save 40%)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MarketSync;
