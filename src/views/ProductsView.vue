<template>
  <div class="mt-4">
    <!-- 產品列表 -->
    <div class="row py-3">
      <div class="col-md-6">
        <h2>產品列表</h2>
        <table class="table table-hover mt-4">
            <thead>
                <tr>
                    <th width="150">產品名稱</th>
                    <th width="120">
                        原價
                    </th>
                    <th width="120">
                        售價
                    </th>
                    <th width="150">
                        是否啟用
                    </th>
                    <th width="120">
                        查看細節
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in products" v-bind:key="item.id">
                    <td width="150">{{ item.title }}</td>
                    <td width="120">
                        {{ item.origin_price }}
                    </td>
                    <td width="120">
                        {{ item.price }}
                    </td>
                    <td width="150">
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td width="120">
                        <button type="button" class="btn btn-primary"
                            v-on:click="tempProduct = item">查看細節</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <p>目前有 <span>{{ products.length }}</span> 項產品</p>
      </div>
      <div class="col-md-6">
        <h2>單一產品細節</h2>
        <div v-if="tempProduct.title">
          <div class="card mb-3" >
            <img v-bind:src="tempProduct.imageUrl" height="300"
              class="card-img-top primary-image" style="object-fit:cover" alt="主圖">
            <div class="card-body">
              <h5 class="card-title">
                {{ tempProduct.title }}
                <span class="badge bg-primary ms-2">{{ tempProduct.category }}</span>
              </h5>
              <p class="card-text">商品描述：{{ tempProduct.description }}</p>
              <p class="card-text">商品內容：{{ tempProduct.content }}</p>
              <div class="d-flex">
                <p class="card-text me-2">{{ tempProduct.price }}</p>
                <p class="card-text text-secondary"><del>{{ tempProduct.origin_price }}</del></p>
                {{ tempProduct.unit }} / 個
              </div>
            </div>
          </div>
          <span v-for="(image, id) in tempProduct.imagesUrl" v-bind:key="id">
            <img v-if="image" v-bind:src="image" class="images m-2"
              style="object-fit:cover" height="300">
          </span>
        </div>
        <p v-else class="text-secondary">請選擇一個商品查看</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
    };
  },
  methods: {
    getData() {
    // 取得產品資料
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/products/all`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
