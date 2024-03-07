<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的頁面
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th style="width: 200px">標題</th>
          <th style="width: 200px">作者</th>
          <th>描述</th>
          <th style="width: 100px">建立時間</th>
          <th style="width: 100px">是否公開</th>
          <th style="width: 120px">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.author }}</td>
          <td>{{ article.description }}</td>
          <td>{{ new Date(article.create_at * 1000).toLocaleDateString('zh-TW') }}</td>
          <td>
            <span v-if="article.isPublic">已上架</span>
            <span v-else>未上架</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
                type="button" @click="getArticle(article.id)">
                編輯
              </button>
              <button class="btn btn-outline-danger btn-sm"
                type="button" @click="openDelArticleModal(article)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <ArticleModal ref="articleModal"
      :article="tempArticle" :is-new="isNew" @update-article="updateArticle">
    </ArticleModal>
    <!-- ArticleModal -->
    <!-- DelModal -->
    <div class="modal fade" id="delModal" tabindex="-1"
      role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" ref="delArticleModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <span>刪除 {{ tempArticle.title }}</span>
            </h5>
            <button type="button" class="btn-close"
              data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempArticle.title }}</strong> (刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消
            </button>
            <button type="button" class="btn btn-danger" @click="delArticle">確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- DelModal -->
    <PaginationComponents :pages="pagination" @emitPages="getArticles" />
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import ArticleModal from '@/components/ArticleModal.vue';
import PaginationComponents from '@/components/PaginationComponent.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      articles: [],
      isLoading: false,
      isNew: false,
      tempArticle: {},
      currentPage: 1,
      delArticleModal: null,
      pagination: {},
    };
  },
  watch: {
    article() {
      this.tempArticle = {
        ...this.article,
        tag: this.article.tag || [],
        isPublic: this.article.isPublic || false,
      };
      // eslint-disable-next-line prefer-destructuring
      this.create_at = new Date(this.tempArticle.create_at * 1000).toISOString().split('T')[0];
    },
    create_at() {
      this.tempArticle.create_at = Math.floor(new Date(this.create_at) / 1000);
    },
  },
  methods: {
    openModal(isNew, item) {
      if (isNew) {
        this.tempArticle = {
          isPublic: false,
          create_at: new Date().getTime() / 1000,
          tag: [],
        };
        this.isNew = true;
      } else {
        this.tempArticle = { ...item };
        this.isNew = false;
      }
      this.$refs.articleModal.openModal();
    },
    openDelArticleModal(item) {
      this.tempArticle = { ...item };
      this.delArticleModal.show();
    },
    updateArticle(item) {
      this.tempArticle = item;
      let api = `${VITE_URL}/v2/api/${VITE_PATH}/admin/article`;
      let httpMethod = 'post';
      this.isLoading = true;
      if (!this.isNew) {
        api = `${VITE_URL}/v2/api/${VITE_PATH}/admin/article/${this.tempArticle.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, { data: this.tempArticle }).then(() => {
        this.isLoading = false;
        this.$refs.articleModal.hideModal();
        this.getArticles(this.currentPage);
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
    delArticle() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/article/${this.tempArticle.id}`;
      this.isLoading = true;
      this.$http.delete(url).then(() => {
        this.isLoading = false;
        this.delArticleModal.hide();
        this.getArticles(this.currentPage);
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
    getArticle(id) {
      const api = `${VITE_URL}/v2/api/${VITE_PATH}/admin/article/${id}`;
      this.isLoading = true;
      this.$http.get(api).then((response) => {
        this.isLoading = false;
        this.openModal(false, response.data.article);
        this.isNew = false;
      }).catch((error) => {
        this.isLoading = false;
        alert('error', error.response, error.request, error.message);
      });
    },
    getArticles(page = 1) {
      this.currentPage = page;
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/admin/articles?page=${page}`;
      this.isLoading = true;
      this.$http.get(url).then((response) => {
        this.isLoading = false;
        const { data } = response;
        if (data && data.success) {
          this.articles = data.articles;
          this.pagination = data.pagination;
        } else {
          console.error('API request failed:', data.error);
        }
      }).catch((error) => {
        this.isLoading = false;
        console.error('API request failed:', error);
      });
    },
  },
  components: {
    PaginationComponents,
    ArticleModal,
  },
  mounted() {
    // this.articleModal = new Modal(this.$refs.articleModal)
    this.delArticleModal = new Modal(this.$refs.delArticleModal);
    this.getArticles();
  },
};
</script>

<style>
.ck-editor__editable_inline {
  min-height: 300px;
}
</style>
