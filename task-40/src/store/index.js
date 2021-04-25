import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    symbols: [],
    tickers: [],
  },
  mutations: {
    updateTicker(state, { symbol, last, volume }) {
      const index = state.tickers.findIndex((i) => i.symbol === symbol);
      if (index === -1) {
        state.tickers.push({ symbol, last, volume });
        return;
      }
      state.tickers[index] = { symbol, last, volume };
    },
    setSymbols(state, symbols) {
      state.symbols = symbols;
    },
  },
  actions: {
    async fetchSymbols(ctx) {
      const socket = new WebSocket('wss://api.exchange.bitcoin.com/api/2/ws/public');

      await new Promise((resolve) => {
        socket.addEventListener('open', () => {
          const request = {
            method: 'getSymbols',
            id: 'getSymbols',
          };
          socket.send(JSON.stringify(request));
          resolve();
        });
      });

      await new Promise((resolve) => {
        socket.addEventListener('message', (event) => {
          const response = JSON.parse(event.data);
          if (response.id === 'getSymbols') {
            const symbols = Object.values(response.result).map((i) => ({
              id: i.id,
              baseCurrency: i.baseCurrency,
              quoteCurrency: i.quoteCurrency,
            }));
            ctx.commit('setSymbols', symbols);
            resolve();
          }
        });
      });

      socket.close();
    },
    subscribeSymbols(ctx) {
      const symbols = ctx.getters.getSymbols;

      const socket = new WebSocket('wss://api.exchange.bitcoin.com/api/2/ws/public');

      socket.addEventListener('open', () => {
        symbols.forEach((i) => {
          const request = {
            method: 'subscribeTicker',
            params: {
              symbol: i.id,
            },
            id: i.id,
          };
          socket.send(JSON.stringify(request));
        });
      });

      socket.addEventListener('message', (event) => {
        const response = JSON.parse(event.data);
        if (response.method === 'ticker') {
          const ticker = {
            symbol: response.params.symbol,
            last: response.params.last,
            volume: response.params.volume,
          };
          ctx.commit('updateTicker', ticker);
        }
      });
    },
  },
  getters: {
    getSymbols(state) {
      return state.symbols.slice(0, 5);
    },
    getTickers(state) {
      return state.tickers;
    },
  },
});
