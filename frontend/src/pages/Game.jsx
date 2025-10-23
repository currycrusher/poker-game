import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Lobby from '../components/Lobby';
import TablePlaceholder from '../components/TablePlaceholder';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

let socket;

export default function Game() {
    const [connected, setConnected] = useState(false);
    const [state, setState] = useState({ players: [], table: {} });
    const [playerName, setPlayerName] = useState('');

    useEffect(() => {
        socket = io(SOCKET_URL, { transports: ['websocket'] });

        socket.on('connect', () => setConnected(true));
        socket.on('state:update', (data) => setState(data));
        socket.on('player:kicked', () => {
            alert('You were kicked by admin');
            window.location.reload();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    function join() {
        if (!playerName) {
            alert('Enter a name first');
            return;
        }
        socket.emit('player:join', { name: playerName });
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <TablePlaceholder state={state} />
                </div>

                <div>
                    <div className="bg-card p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg" style={{ color: '#d4af37' }}>Lobby</h3>
                        <Lobby state={state} />
                        <div className="mt-4">
                            <input className="p-2 rounded mr-2" placeholder="Your name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
                            <button className="px-3 py-2 rounded" style={{ background: '#d4af37', color: '#000' }} onClick={join}>Join</button>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                        <p>Connection: {connected ? 'connected' : 'disconnected'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
