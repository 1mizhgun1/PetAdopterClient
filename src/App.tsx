import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdsPage from "./pages/ads";
import AdDetails from "./pages/ad";
import Login from "./pages/login";
import Register from "./pages/register";
import Header from "./components/Header";
import { UserProvider } from "./contexts/UserContext";
import CreateAdForm from "./components/CreateAdForm.tsx";
import EditAdForm from "./components/EditAdForm.tsx";

const App: React.FC = () => {
    return (
        <UserProvider>
            <Router>
                <Header />
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<Navigate to="/ads" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/ads" element={<AdsPage />} />
                        <Route path="/ads/:id" element={<AdDetails />} />
                        <Route path="/ads/create" element={<CreateAdForm />} />
                        <Route path="/ads/:id/edit" element={<EditAdForm />} />
                        <Route path="*" element={<h1>Страница не найдена</h1>} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;
