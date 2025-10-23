import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
let socket;

export default function Admin() {
    const [players, setPlayers] = useState([]);
    const [state, setState] = useState({ players: [] });

    useEffect(() => {
        socket = io(SOCKET_URL, { transports: ['websocket'] });
        socket.on('state:update', (d) => setState(d));
        return () => socket.disconnect();
    }, []);

    function startGame() {
        socket.emit('admin:startGame');
    }
    function reset() {
        socket.emit('admin:reset');
    }
    function kick(playerId) {
        socket.emit('admin:kick', { playerId });
    }
    function setBalance(playerId) {
        const b = prompt('New balance:');
        if (!b) return;
        socket.emit('admin:setBalance', { playerId, balance: Number(b) });
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4" style={{ color: '#d4af37' }}>Admin Panel</h2>

                <div className="mb-4">
                    <button className="mr-2 px-3 py-2 rounded" style={{ background: '#d4af37', color: '#000' }} onClick={startGame}>Start Game</button>
                    <button className="px-3 py-2 rounded" onClick={reset}>Reset Table</button>
                </div>

                <h3 className="font-medium mb-2">Players</h3>
                <div>
                    {state.players && state.players.length ? state.players.map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-black/30 p-2 rounded mb-2">
                            <div>
                                <div className="text-sm font-semibold">{p.name}</div>
                                <div className="text-xs text-gray-300">Balance: {p.balance}</div>
                            </div>
                            <div>
                                <button className="text-xs mr-2" onClick={() => setBalance(p.id)}>Set</button>
                                <button className="text-xs" onClick={() => kick(p.id)}>Kick</button>
                            </div>
                        </div>
                    )) : <div className="text-xs text-gray-400">No players</div>}
                </div>
            </div>
        </div>
    );
}
