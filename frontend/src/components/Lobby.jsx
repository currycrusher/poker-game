import React from 'react';

export default function Lobby({ state }) {
    const players = state.players || [];
    return (
        <div className="mt-2">
            <div className="text-sm text-gray-300 mb-2">Players ({players.length}/8)</div>
            <div className="space-y-2">
                {players.map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-black/30 rounded">
                        <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-gray-400">Balance: {p.balance}</div>
                        </div>
                        <div className="text-xs text-gray-400">Seat {idx+1}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
