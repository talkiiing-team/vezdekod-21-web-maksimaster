<template>
  <div class="main">
    <b-table striped hover :items="Object.values(getTickers)"></b-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Quotes',
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'getTickers',
    ]),
  },
};
</script>

<style scoped>
.main {
  width: 60%;
}
</style>
