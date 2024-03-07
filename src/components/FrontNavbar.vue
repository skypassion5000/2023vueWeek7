<template>
  <nav>
    <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/about">About</RouterLink> |
    <RouterLink to="/products">產品列表</RouterLink> |
    <RouterLink to="/cart">購物車列表</RouterLink> |
    <RouterLink to="/blog">部落格貼文</RouterLink> |
    <RouterLink to="/login">登入</RouterLink> |
    <RouterLink to="/admin/products">後台 購物車列表</RouterLink> |
    <RouterLink to="/cart" class="btn btn-primary position-relative">
      <i class="bi bi-cart"></i>
      <span class="position-absolute top-0 start-100 translate-middle
        badge rounded-pill bg-danger">
        {{ carts.length }}
        <span class="visually-hidden"></span>
      </span>
    </RouterLink>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import cartStore from '@/stores/cartStore';

export default {
  methods: {
    ...mapActions(cartStore, ['getCart']),
  },
  computed: {
    ...mapState(cartStore, ['carts']),
  },
  mounted() {
    this.getCart();
  },
};
</script>

<style scoped>
</style>
