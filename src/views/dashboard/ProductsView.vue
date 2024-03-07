<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="container">
    <div class="text-end mt-4">
        <button type="button" @click="openModal('new')" class="btn btn-primary">
            建立新的產品
        </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
            <th width="120">
                分類
            </th>
            <th>產品名稱</th>
            <th width="120">
                原價
            </th>
            <th width="120">
                售價
            </th>
            <th width="100">
                是否啟用
            </th>
            <th width="120">
                編輯
            </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td class="text-end">{{ item.origin_price }}</td>
            <td class="text-end">{{ item.price }}</td>
            <td>
                <span v-if="item.is_enabled" class="text-success">啟用</span>
                <span v-else>未啟用</span>
            </td>
            <td>
                <div class="btn-group">
                    <button type="button" @click="openModal('edit',item)"
                        class="btn btn-outline-primary btn-sm">
                        編輯
                    </button>
                    <button type="button" @click="openModal('del',item)"
                        class="btn btn-outline-danger btn-sm">
                        刪除
                    </button>
                </div>
            </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁元件 -->
    <PaginationComponents :pages="pagination" @emitPages="getData"></PaginationComponents>
    <!-- 分頁元件 -->
  </div>
  <!-- Modal -->
  <ProductModal :temp-product="tempProduct" :update-product="updateProduct"
  :del-product="delProduct" :is-new="isNew" :create-images="createImages" ref="productModal">
  </ProductModal>
  <!-- Modal -->
  </template>

<script>
import ProductModal from '@/components/ProductModal.vue';
import axios from 'axios';
import PaginationComponents from '@/components/PaginationComponent.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      isLoading: false,
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, // 判斷是否為新增產品
      pagination: {},
    };
  },
  methods: {
    getData(currentPage = 1) { // 帶入分頁參數及預設值
      // 取得資料
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/products?page=${currentPage}`;
      this.isLoading = true;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination; // 取得分頁
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          alert(err.response.data.message);
          this.$router.push('/login');
        });
    },

    updateProduct() {
      // 新增產品
      let url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/product`;
      this.isLoading = true;
      let http = 'post';
      // 編輯產品
      if (!this.isNew) {
        url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`;
        http = 'put';
      }
      axios[http](url, { data: this.tempProduct })
        .then(() => {
          this.isLoading = false;
          this.getData(); // 重新渲染產品列表
          this.$refs.productModal.closeModal(); // 關掉Modal
          this.tempProduct = {}; // 清除欄位
        })
        .catch((err) => {
          this.isLoading = false;
          alert(err.response.data.message);
        });
    },
    delProduct() {
      // 刪除產品
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/product/${this.tempProduct.id}`;
      this.isLoading = true;
      axios.delete(url, { data: this.tempProduct })
        .then(() => {
          this.isLoading = false;
          this.getData();
          this.$refs.productModal.closeDelModal();
          this.tempProduct = {};
        })
        .catch((err) => {
          this.isLoading = false;
          alert(err.response.data.message);
        });
    },
    openModal(status, item) {
      if (status === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.$refs.productModal.openModal();
      } else if (status === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        this.$refs.productModal.openModal();
      } else if (status === 'del') {
        this.tempProduct = { ...item };
        this.$refs.productModal.openDelModal();
      }
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
  components: {
    PaginationComponents,
    ProductModal,
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
</style>
