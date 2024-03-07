<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="mt-4">
    <h2>購物車列表</h2>
    <!-- 產品列表 -->
    <table class="table align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td style="width: 200px">
            <div
              style="
                height: 100px;
                background-size: cover;
                background-position: center;
              " :style="{ backgroundImage: `url(${item.imageUrl})` }"
            ></div>
          </td>
          <td>{{ item.title }}</td>
          <td>
            <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
            <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
            <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <!-- getProduct(item.id)、disabled、loadingStatus -->
              <button type="button"
                class="btn btn-outline-secondary"
                @click="getProduct(item.id)"
                :disabled="loadingStatus.loadingItem === item.id || !item.is_enabled">
                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.loadingItem === item.id"></i>
                查看更多
              </button>
              <button type="button" class="btn btn-outline-danger" @click="addToCart(item.id)">
                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.loadingItem === item.id"></i>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 購物車列表 -->
    <div class="text-end">
      <button class="btn btn-outline-danger" type="button" @click="deleteAllCarts">
        清空購物車
      </button>
    </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="carts && carts.length > 0">
          <tr v-for="item in carts" :key="item.id">
            <td>
              <button type="button"
              class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)"
              :disabled="loadingStatus.loadingItem === item.id">
                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.loadingItem === item.id"></i>
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <div class="text-success" v-if="item.coupon">已套用優惠券</div>
            </td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <input v-model.number="item.qty" @blur="updateCart(item)"
                  :disabled="loadingStatus.loadingItem === item.id"
                  min="1" type="number" class="form-control"/>
                  <span class="input-group-text" id="basic-addon2"
                    >{{ item.product.unit }}</span
                  >
                </div>
              </div>
            </td>
            <td class="text-end">
              <small v-if="final_total !== total" class="text-success">折扣價：</small>
              {{ item.final_total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end">總計</td>
          <td class="text-end">{{ cart.total }}</td>
        </tr>
        <tr v-if="final_total !== total">
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{ final_total }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="input-group mb-3 input-group-sm">
      <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
          套用優惠碼
        </button>
      </div>
    </div>
    <!-- 表單驗證 -->
    <div class="my-5 row justify-content-center">
      <v-form ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <v-field
            id="email"
            name="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            rules="email|required"
            v-model="form.user.email"
          ></v-field>
          <error-message
            name="email"
            class="invalid-feedback"
          ></error-message>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <v-field
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            rules="required"
            v-model="form.user.name"
          ></v-field>
          <error-message
            name="姓名"
            class="invalid-feedback"
          ></error-message>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <v-field
            id="tel"
            name="電話"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話"
            rules="required|min:8|max:10" v-model="form.user.tel"
          ></v-field>
          <error-message
            name="電話"
            class="invalid-feedback"
          ></error-message>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <v-field
            id="address"
            name="地址"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址"
            rules="required"
            v-model="form.user.address"
          ></v-field>
          <error-message
            name="地址"
            class="invalid-feedback"
          ></error-message>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            id="message"
            class="form-control"
            cols="30"
            rows="10"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-danger">送出訂單</button>
        </div>
      </v-form>
    </div>
  </div>
  <!-- 產品Modal -->
  <UserProductModal ref="userProductModal"
    :product="product" @add-to-cart="addToCart"></UserProductModal>
</template>

<script>
import UserProductModal from '@/components/UserProductModal.vue';

import cartStore from '@/stores/cartStore';
import { mapActions, mapState } from 'pinia';

import axios from 'axios';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
      isLoading: false,
      coupon_code: '',
      delCartModal: null,
    };
  },
  components: {
    UserProductModal,
  },
  computed: {
    ...mapState(cartStore, ['carts', 'total', 'final_total']),
  },
  mounted() { // 初始化
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/products`;
      this.isLoading = true;
      axios.get(url)
        .then((response) => {
          this.products = response.data.products;
          this.isLoading = false;
        }).catch((err) => {
          alert(err.response.data.message);
          this.isLoading = false;
        });
    },
    getProduct(id) {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/product/${id}`;
      this.isLoading = true;
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        this.loadingStatus.loadingItem = '';
        this.product = response.data.product;
        // 控制 Vue元件
        this.$refs.userProductModal.openModal();
        this.isLoading = false;
      }).catch((err) => {
        alert(err.response.data.message);
        this.isLoading = false;
      });
    },
    ...mapActions(cartStore, ['getCart']),
    // getCart() {
    //   const url = `${VITE_URL}/v2/api/${VITE_PATH}/cart`;
    //   this.isLoading = true;
    //   axios.get(url).then((response) => {
    //     this.cart = response.data.data;
    //     this.isLoading = false;
    //   }).catch((err) => {
    //     alert(err.response.data.message);
    //     this.isLoading = false;
    //   });
    // },
    ...mapActions(cartStore, ['addToCart']),
    // addToCart(id, qty = 1) {
    //   const url = `${VITE_URL}/v2/api/${VITE_PATH}/cart`;
    //   this.isLoading = true;
    //   this.loadingStatus.loadingItem = id;
    //   const cart = {
    //     product_id: id,
    //     qty,
    //   };
    //   // 隱藏 userProductModal
    //   this.$refs.userProductModal.hideModal();
    //   axios.post(url, { data: cart }).then((response) => {
    //     alert(response.data.message);
    //     this.loadingStatus.loadingItem = '';
    //     // 取得購物車資訊去渲染
    //     this.getCart();
    //     this.isLoading = false;
    //   }).catch((err) => {
    //     alert(err.response.data.message);
    //     this.isLoading = false;
    //   });
    // },
    deleteAllCarts() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/carts`;
      this.isLoading = true;
      axios.delete(url).then((response) => {
        alert(response.data.message);
        this.getCart();
        this.isLoading = false;
      }).catch((err) => {
        alert(err.response.data.message);
        this.isLoading = false;
      });
    },
    removeCartItem(id) {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/cart/${id}`;
      this.isLoading = true;
      this.loadingStatus.loadingItem = id;
      axios.delete(url)
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
          this.isLoading = false;
        }).catch((err) => {
          alert(err.response.data.message);
          this.isLoading = false;
        });
    },
    updateCart(data) {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/cart/${data.id}`;
      this.isLoading = true;
      this.loadingStatus.loadingItem = data.id;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      axios.put(url, { data: cart })
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
          this.isLoading = false;
        }).catch((err) => {
          alert(err.response.data.message);
          this.isLoading = false;
        });
    },
    addCouponCode() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/coupon`;
      const coupon = {
        code: this.coupon_code,
      };
      this.isLoading = true;
      this.$http.post(url, { data: coupon }).then((response) => {
        alert(response.data.message);
        this.getCart();
        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
    createOrder() {
      // console.log(this.form.user,"form");
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/order`;
      this.isLoading = true;
      const order = this.form;
      axios.post(url, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$router.push(`checkout/${response.data.orderId}`);
          this.$refs.form.resetForm();
          this.getCart();
          this.isLoading = false;
        }).catch((err) => {
          alert(err.response.data.message);
          this.isLoading = false;
        });
    },
  },
};
</script>
