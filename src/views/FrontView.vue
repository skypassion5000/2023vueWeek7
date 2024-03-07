<template>
  <div class="container">
    <h2>這是前台</h2>
    <FrontNavbar></FrontNavbar>
    <router-view></router-view>
  </div>
</template>

<script>
import FrontNavbar from '@/components/FrontNavbar.vue';

export default {
  components: {
    FrontNavbar,
  },
};
</script>

<style scoped>
</style>
