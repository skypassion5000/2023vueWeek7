<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="container">
  <table class="table mt-4">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in orders" :key="item.id">
        <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
          <td>{{ new Date(item.create_at * 1000).toLocaleDateString('zh-TW') }}</td>
          <td><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="product in item.products" :key="product.id">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox"
                :id="`paidSwitch${item.id}`" v-model="item.is_paid"
                @change="updatePaid(item)" />
              <label class="form-check-label" :for="`paidSwitch${item.id}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" type="button" @click="openModal(item)">
                檢視
              </button>
              <button class="btn btn-outline-danger btn-sm" type="button"
                @click="openDelOrderModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
  <!--OrderModal-->
  <div class="modal fade" id="productModal" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" ref="OrderModal">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>訂單細節</span>
          </h5>
          <button type="button" class="btn-close"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-4">
              <h3>用戶資料</h3>
              <table class="table">
                <tbody v-if="tempOrder.user">
                  <tr>
                    <th style="width: 100px">姓名</th>
                    <td>{{ tempOrder.user.name }}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{{ tempOrder.user.email }}</td>
                  </tr>
                  <tr>
                    <th>電話</th>
                    <td>{{ tempOrder.user.tel }}</td>
                  </tr>
                  <tr>
                    <th>地址</th>
                    <td>{{ tempOrder.user.address }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-8">
              <h3>訂單細節</h3>
              <table class="table">
                <tbody>
                  <tr>
                    <th style="width: 100px">訂單編號</th>
                    <td>{{ tempOrder.id }}</td>
                  </tr>
                  <tr>
                    <th>下單時間</th>
                    <td>{{ new Date(tempOrder.create_at * 1000).toLocaleDateString('zh-TW') }}</td>
                  </tr>
                  <tr>
                    <th>付款時間</th>
                    <td>
                      <span v-if="tempOrder.paid_date">
                        {{ new Date(tempOrder.paid_date * 1000).toLocaleDateString('zh-TW') }}
                      </span>
                      <span v-else>時間不正確</span>
                    </td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <strong v-if="tempOrder.is_paid" class="text-success">已付款</strong>
                      <span v-else class="text-muted">尚未付款</span>
                    </td>
                  </tr>
                  <tr>
                    <th>總金額</th>
                    <td>
                      {{ tempOrder.total }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3>選購商品</h3>
              <table class="table">
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  <tr v-for="item in tempOrder.products" :key="item.id">
                    <th>
                      {{ item.product.title }}
                    </th>
                    <td>{{ item.qty }} / {{ item.product.unit }}</td>
                    <td class="text-end">
                      {{ item.final_total }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-end">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                    v-model="tempOrder.is_paid" />
                  <label class="form-check-label" for="flexCheckDefault">
                    <span v-if="tempOrder.is_paid">已付款</span>
                    <span v-else>未付款</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="updatePaid(tempOrder)">
            修改付款狀態
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--DelModal-->
  <div class="modal fade" id="delOrderModal" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
    ref="delOrderModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <span>刪除 {{ tempOrder.title }}</span>
          </h5>
          <button type="button" class="btn-close"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除 <strong class="text-danger">{{ tempOrder.title }}</strong> (刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消
          </button>
          <button type="button" class="btn btn-danger" @click="delOrder">確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--DelModal-->
  <PaginationComponents :pages="pagination" @emitPages="getOrders" />
</template>

<script>
import { Modal } from 'bootstrap';
import PaginationComponents from '@/components/PaginationComponent.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      orders: {},
      isNew: false,
      pagination: {},
      isLoading: false,
      tempOrder: {},
      currentPage: 1,
      OrderModal: null,
      delOrderModal: null,
    };
  },
  methods: {
    openModal(item) {
      this.tempOrder = { ...item };
      this.isNew = false;
      this.OrderModal.show();
    },
    openDelOrderModal(item) {
      this.tempOrder = { ...item };
      this.delOrderModal.show();
    },
    updatePaid(item) {
      this.isLoading = true;
      const api = `${VITE_URL}/v2/api/${VITE_PATH}/admin/order/${item.id}`;
      const paid = {
        is_paid: item.is_paid,
      };
      this.$http.put(api, { data: paid }).then(() => {
        this.isLoading = false;
        this.OrderModal.hide();
        this.getOrders(this.currentPage);
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
    delOrder() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/order/${this.tempOrder.id}`;
      this.isLoading = true;
      this.$http.delete(url).then(() => {
        this.isLoading = false;
        this.delOrderModal.hide();

        this.getOrders(this.currentPage);
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
    getOrders(currentPage = 1) {
      this.currentPage = currentPage;
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/orders?page=${currentPage}`;
      this.isLoading = true;
      this.$http.get(url, this.tempProduct).then((response) => {
        this.orders = response.data.orders;
        this.pagination = response.data.pagination;
        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
  },
  components: {
    PaginationComponents,
  },
  mounted() {
    this.OrderModal = new Modal(this.$refs.OrderModal);
    this.delOrderModal = new Modal(this.$refs.delOrderModal);
    this.getOrders();
  },
};
</script>

<style scoped></style>
