import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import PriceTrends from './components/PriceTrends';
import DetailedForecast from './components/DetailedForecast';
import Layout from './components/Layout';
import { CropProvider } from './context/CropContext';

function App() {
    return (
        <CropProvider>
            <Router>
                <Routes>
                    {/* Public Landing Page */}
                    <Route
                        path="/"
                        element={
                            <>
                                <SignedIn>
                                    <Navigate to="/dashboard" replace />
                                </SignedIn>
                                <SignedOut>
                                    <Landing />
                                </SignedOut>
                            </>
                        }
                    />

                    {/* Protected Dashboard Route */}
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                <SignedIn>
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </SignedIn>
                                <SignedOut>
                                    <Navigate to="/" replace />
                                </SignedOut>
                            </>
                        }
                    />

                    {/* Protected Price Trends Route */}
                    <Route
                        path="/trends"
                        element={
                            <>
                                <SignedIn>
                                    <Layout>
                                        <PriceTrends />
                                    </Layout>
                                </SignedIn>
                                <SignedOut>
                                    <Navigate to="/" replace />
                                </SignedOut>
                            </>
                        }
                    />

                    {/* Protected Detailed Forecast Route */}
                    <Route
                        path="/forecast"
                        element={
                            <>
                                <SignedIn>
                                    <Layout>
                                        <DetailedForecast />
                                    </Layout>
                                </SignedIn>
                                <SignedOut>
                                    <Navigate to="/" replace />
                                </SignedOut>
                            </>
                        }
                    />
                </Routes>
            </Router>
        </CropProvider>
    );
}

export default App;
