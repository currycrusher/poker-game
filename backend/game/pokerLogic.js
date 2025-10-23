// dealHoleCards(deck, players)
function dealHoleCards(deck, players) {
  // each player gets 2 cards
  players.forEach(p => p.cards = []);
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < players.length; j++) {
      const card = deck.shift();
      players[j].cards.push(card);
    }
  }
  return players;
}

module.exports = { dealHoleCards };
