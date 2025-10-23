import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Game from './pages/Game';
import Admin from './pages/Admin';

export default function App() {
    return (
        <BrowserRouter>
            <div className="p-4">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold" style={{ color: '#d4af37' }}>Local Poker — Hold'em</h1>
                    <nav>
                        <Link to="/" className="mr-4 text-sm">Game</Link>
                        <Link to="/admin" className="text-sm">Admin</Link>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<Game />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
