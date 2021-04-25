<template>
  <div id="app">
    <header>
      <h1>Cryptocurrency Quotes</h1>
    </header>
    <Quotes />
    <footer>
      <a>made with love for vk-vezdekod by webReportVitals.js</a>
      <a>2021</a>
    </footer>
  </div>
</template>

<script>
import Quotes from './components/Quotes.vue';

export default {
  name: 'App',
  components: {
    Quotes,
  },
  async created() {
    console.clear();

    await this.$store.dispatch('fetchSymbols');
    this.$store.dispatch('subscribeSymbols');
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

header {
  width: 100%;
  margin-bottom: 25px;
  padding: 25px;
  background-color: gainsboro;
  flex-direction: row;
  text-align: center;
}

footer {
  background-color: gainsboro;
  width: 100%;
  margin-top: 25px;
  padding: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
}
</style>
