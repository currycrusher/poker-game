import React from 'react';

export default function TablePlaceholder({ state }) {
    const players = state.players || [];
    return (
        <div className="bg-gradient-to-b from-black/60 to-black/40 p-6 rounded-lg shadow-xl" style={{ minHeight: '420px' }}>
            <div className="flex items-center justify-center mb-6">
                <div className="w-3/4 bg-card p-4 rounded-lg text-center">
                    <div style={{ color: '#d4af37' }} className="font-semibold mb-2">Poker Table — Hold'em</div>
                    <div className="text-sm text-gray-300">Minimal black & gold desktop UI — Phase 1</div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => {
                    const player = players[i];
                    return (
                        <div key={i} className="p-3 bg-black/25 rounded flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center" style={{ border: '2px solid #d4af37' }}>
                                <div className="text-xs">{player ? player.name[0]?.toUpperCase() : ''}</div>
                            </div>
                            <div className="mt-2 text-xs">{player ? player.name : 'Empty'}</div>
                            <div className="text-xs text-gray-400">{player ? `\$${player.balance}` : ''}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
