<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink to="/blog">部落格列表</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ article.title }}
        </li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ article.title }}</h2>
        <p>
          <small class="text-muted">
            {{ new Date(article.create_at * 1000).toLocaleDateString('zh-TW') }}
          </small> -
          <small class="text-muted">作者：{{ article.author }}</small>
        </p>
        <img :src="article.imageUrl" :alt="article.title" class="img-fluid mb-3">
        <div v-html="article.content"></div>
      </article>
    </div>
  </div>
</template>

<script>
const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      isLoading: false,
      article: {},
      id: '',
    };
  },
  methods: {
    getArticle() {
      const api = `${VITE_URL}/v2/api/${VITE_PATH}/article/${this.id}`;
      this.isLoading = true;
      this.$http.get(api).then((response) => {
        this.article = response.data.article;
        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
        alert(error.response.data.message);
      });
    },
  },
  mounted() {
    this.id = this.$route.params.articleId;
    this.getArticle();
  },
};
</script>
