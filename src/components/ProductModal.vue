<template>
  <div id="productModal" ref="productModal" class="modal fade"
    tabindex="-1" aria-labelledby="productModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 id="productModalLabel" class="modal-title">
              <span v-if="isNew">新增產品</span>
              <span v-else>編輯產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="mb-2">
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label">輸入圖片網址</label>
                    <input id="imageUrl" type="text" class="form-control"
                      placeholder="請輸入圖片連結"
                        v-model="editProduct.imageUrl">
                  </div>
                  <div class="mb-3">
                    <label for="customFile" class="form-label">或 上傳圖片
                        <i class="fas fa-spinner fa-spin"
                          v-if="status.fileUploading"></i>
                    </label>
                    <input type="file" id="customFile" class="form-control"
                      ref="fileInput" @change="uploadFile" />
                  </div>
                  <img class="img-fluid" alt="" :src="editProduct.imageUrl">
                </div>
                <div>
                  <h4>多圖設置</h4>
                  <div v-if="Array.isArray(editProduct.imagesUrl)">
                      <template v-for="(item, index) in editProduct.imagesUrl"
                        :key="index + 123">
                          <img :src="item" alt="" class="img-fluid">
                          <input type="text" class="form-control"
                            v-model="editProduct.imagesUrl[index]">
                      </template>
                      <button class="btn btn-outline-primary btn-sm d-block w-100"
                          v-if="!editProduct.imagesUrl.length ||
                            editProduct.imagesUrl[editProduct.imagesUrl.length - 1]"
                          @click="editProduct.imagesUrl.push('')">
                          新增圖片
                      </button>
                      <button class="btn btn-outline-danger btn-sm d-block w-100"
                          @click="editProduct.imagesUrl.pop()">
                          刪除圖片
                      </button>
                  </div>
                  <div v-else>
                      <button class="btn btn-outline-primary btn-sm d-block w-100"
                        @click="createImages">
                          新增圖片
                      </button>
                  </div>
                </div>
              </div>
              <div class="col-sm-8">

                  <div class="mb-3">
                      <label for="title" class="form-label">標題</label>
                      <input id="title" type="text" class="form-control" placeholder="請輸入標題"
                          v-model="editProduct.title">
                  </div>

                  <div class="row">
                      <div class="mb-3 col-md-6">
                          <label for="category" class="form-label">分類</label>
                          <input id="category" type="text" class="form-control"
                            placeholder="請輸入分類" v-model="editProduct.category">
                      </div>
                      <div class="mb-3 col-md-6">
                          <label for="price" class="form-label">單位</label>
                          <input id="unit" type="text" class="form-control"
                            placeholder="請輸入單位" v-model="editProduct.unit">
                      </div>
                  </div>

                  <div class="row">
                      <div class="mb-3 col-md-6">
                          <label for="origin_price" class="form-label">原價</label>
                          <input id="origin_price" type="number" min="0"
                            class="form-control" placeholder="請輸入原價"
                              v-model.number="editProduct.origin_price">
                      </div>
                      <div class="mb-3 col-md-6">
                          <label for="price" class="form-label">售價</label>
                          <input id="price" type="number" min="0"
                            class="form-control" placeholder="請輸入售價"
                              v-model.number="editProduct.price">
                      </div>
                  </div>
                  <hr>

                  <div class="mb-3">
                      <label for="description" class="form-label">產品描述</label>
                      <textarea id="description" type="text" class="form-control"
                        placeholder="請輸入產品描述" v-model="editProduct.description">
          </textarea>
                  </div>
                  <div class="mb-3">
                      <label for="content" class="form-label">說明內容</label>
                      <textarea id="description" type="text" class="form-control"
                        placeholder="請輸入說明內容" v-model="editProduct.content">
          </textarea>
                  </div>
                  <div class="mb-3">
                      <div class="form-check">
                          <input id="is_enabled" class="form-check-input" type="checkbox"
                            :true-value="1" :false-value="0"
                            v-model="editProduct.is_enabled">
                          <label class="form-check-label" for="is_enabled">是否啟用</label>
                      </div>
                  </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                取消
            </button>
            <button type="button" @click="updateProduct" class="btn btn-primary">
                確認
            </button>
          </div>
        </div>
      </div>
  </div>

  <div id="delProductModal" ref="delProductModal" class="modal fade"
    tabindex="-1" aria-labelledby="delProductModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
                <span>刪除產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ editProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                取消
            </button>
            <button type="button" class="btn btn-danger" @click="delProduct">
                確認刪除
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import axios from 'axios';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  props: ['tempProduct', 'updateProduct', 'delProduct', 'isNew', 'createImages'],
  data() {
    return {
      modalProduct: null,
      delProductModal: null,
      editProduct: {},
      status: {},
      tempImage: {},
    };
  },
  methods: {
    openModal() {
      this.modalProduct.show();
    },
    closeModal() {
      this.modalProduct.hide();
    },
    openDelModal() {
      this.delProductModal.show();
    },
    closeDelModal() {
      this.delProductModal.hide();
    },
    uploadFile() {
      const uploadedFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadedFile);
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/upload`;
      this.status.fileUploading = true;

      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        this.status.fileUploading = false;
        this.tempImage.imageUrl = response.data.imageUrl;
        this.editProduct.imagesUrl.push(this.tempImage.imageUrl);
        this.$refs.fileInput.value = '';
      }).catch((error) => {
        this.status.fileUploading = false;
        alert(error.response.data.message);
      });
    },
  },
  watch: {
    tempProduct() {
      this.editProduct = this.tempProduct;
    },
  },
  mounted() {
  // 實體化BS modal
    this.modalProduct = new Modal(this.$refs.productModal);
    this.delProductModal = new Modal(this.$refs.delProductModal);
    this.editProduct = this.tempProduct;
  },
};
</script>

<style scoped>
</style>
