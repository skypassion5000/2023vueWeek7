<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="home">
    <h1>Hello, This is Home Page.</h1>
    <hr>
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    HelloWorld,
  },
};
</script>

<style scoped>
</style>
