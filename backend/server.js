const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createDeck, shuffleDeck } = require('./game/deck');
const { dealHoleCards } = require('./game/pokerLogic');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Codespaces / local usage; lock down in production
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

// In-memory game state (resets each server restart)
const state = {
  players: [],   // { id, name, balance, socketId, cards: [] }
  deck: [],
  table: { community: [], pot: 0, status: 'idle' } // basic placeholder
};

// Helpers
function broadcastState() {
  io.emit('state:update', {
    players: state.players.map(p => ({ id: p.id, name: p.name, balance: p.balance, cardsDealt: !!p.cards })),
    table: state.table
  });
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('player:join', ({ name }) => {
    if (!name) name = `Player${state.players.length + 1}`;
    if (state.players.length >= 8) {
      socket.emit('player:join:fail', { reason: 'Table full (max 8)' });
      return;
    }

    const player = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      name,
      balance: 1000, // default fake money
      socketId: socket.id,
      cards: []
    };

    state.players.push(player);
    socket.data.playerId = player.id;

    socket.emit('player:joined', { playerId: player.id });
    broadcastState();
  });

  socket.on('player:leave', () => {
    state.players = state.players.filter(p => p.socketId !== socket.id);
    broadcastState();
  });

  socket.on('admin:startGame', () => {
    if (state.players.length < 2) {
      socket.emit('admin:error', { reason: 'Need at least 2 players to start' });
      return;
    }
    // setup deck and deal two cards each
    state.deck = createDeck();
    shuffleDeck(state.deck);
    dealHoleCards(state.deck, state.players);
    state.table.status = 'running';
    broadcastState();
    io.emit('game:started', { players: state.players.map(p => ({ id: p.id, name: p.name })) });
  });

  socket.on('admin:reset', () => {
    state.players = [];
    state.deck = [];
    state.table = { community: [], pot: 0, status: 'idle' };
    broadcastState();
  });

  socket.on('admin:setBalance', ({ playerId, balance }) => {
    const p = state.players.find(x => x.id === playerId);
    if (p) { p.balance = Number(balance) || 0; }
    broadcastState();
  });

  socket.on('admin:kick', ({ playerId }) => {
    const p = state.players.find(x => x.id === playerId);
    if (p) {
      // notify the kicked player's socket if connected
      try {
        io.to(p.socketId).emit('player:kicked', { reason: 'Kicked by admin' });
      } catch (e) {}
      state.players = state.players.filter(x => x.id !== playerId);
      broadcastState();
    }
  });

  socket.on('disconnect', () => {
    // remove by socketId
    state.players = state.players.filter(p => p.socketId !== socket.id);
    broadcastState();
    console.log('socket disconnected', socket.id);
  });
});

app.get('/admin/players', (req, res) => {
  res.json(state.players.map(p => ({ id: p.id, name: p.name, balance: p.balance })));
});

app.post('/admin/reset-balances', (req, res) => {
  state.players.forEach(p => p.balance = 1000);
  broadcastState();
  res.json({ ok: true });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
