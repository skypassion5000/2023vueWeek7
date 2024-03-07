<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ new Date(item.due_date * 1000).toLocaleDateString('zh-TW') }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-outline-primary btn-sm"
                @click="openCouponModal(false, item)">編輯</button>
              <button type="button" class="btn btn-outline-danger btn-sm"
                @click="openDelCouponModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!--delCouponModal-->
    <div class="modal fade" id="delModal" tabindex="-1"
      role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="delCouponModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <span>刪除 {{ tempCoupon.title }}</span>
            </h5>
            <button type="button" class="btn-close"
              data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> (刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消
            </button>
            <button type="button" class="btn btn-danger" @click="delCoupon">確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--delCouponModal-->
    <!--CouponModal-->
    <div class="modal fade" id="couponModal" tabindex="-1"
      role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true" ref="couponModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增優惠卷</span>
              <span v-else>編輯優惠卷</span>
            </h5>
            <button type="button" class="btn-close"
              data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title"
                v-model="tempCoupon.title" placeholder="請輸入標題">
            </div>
            <div class="mb-3">
              <label for="coupon_code">優惠碼</label>
              <input type="text" class="form-control" id="coupon_code"
                v-model="tempCoupon.code" placeholder="請輸入優惠碼">
            </div>
            <div class="mb-3">
              {{ due_date }}
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" id="due_date" v-model="due_date">
            </div>
            <div class="mb-3">
              <label for="price">折扣百分比</label>
              <input type="number" class="form-control" id="price" min="0"
                v-model.number="tempCoupon.percent"
                placeholder="請輸入折扣百分比">
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" :true-value="1" :false-value="0"
                  v-model="tempCoupon.is_enabled" id="is_enabled">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
            <button type="button" class="btn btn-primary"
              @click="updateCoupon(tempCoupon)"> {{ isNew ? '新增優惠卷' :
              '更新優惠券' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--CouponModal-->
    <PaginationComponents :pages="pagination" @emitPages="getCoupons" />
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import PaginationComponents from '@/components/PaginationComponent.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      coupons: {},
      due_date: '',
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        code: '',
        due_date: '',
      },
      isLoading: false,
      isNew: false,
      couponModal: null,
      delCouponModal: null,
      currentPage: 1,
      pagination: {},
    };
  },
  methods: {
    openCouponModal(isNew, item) {
      this.isNew = isNew;
      if (this.isNew) {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000,
        };
      } else {
        this.tempCoupon = { ...item };
      }
      this.couponModal.show();
    },
    openDelCouponModal(item) {
      this.tempCoupon = { ...item };
      this.delCouponModal.show();
    },
    updateCoupon(tempCoupon) {
      this.isLoading = true;
      let url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/coupon`;
      let httpMethos = 'post';
      let data = tempCoupon;

      if (!this.isNew) {
        url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
        httpMethos = 'put';
        data = this.tempCoupon;
      }

      this.$http[httpMethos](url, { data }).then((response) => {
        this.isLoading = false;
        alert(response.data.message);
        console.log(response.data);
        this.getCoupons();
        this.couponModal.hide();
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
    delCoupon() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.isLoading = true;
      this.$http.delete(url).then(() => {
        this.isLoading = false;
        this.delCouponModal.hide();
        this.getCoupons();
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
    getCoupons(page = 1) {
      this.currentPage = page;
      this.isLoading = true;
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/coupons?page=${page}`;
      this.$http.get(url, this.tempProduct).then((response) => {
        this.coupons = response.data.coupons;
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
    // 實體化BS modal
    this.couponModal = new Modal(this.$refs.couponModal);
    this.delCouponModal = new Modal(this.$refs.delCouponModal);
    this.getCoupons();
  },
};
</script>
