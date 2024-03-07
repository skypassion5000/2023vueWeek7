import './assets/all.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import axios from 'axios';
import VueAxios from 'vue-axios';

import Loading from 'vue-loading-overlay';

import CKEditor from '@ckeditor/ckeditor5-vue';

// 匯入vee-validate
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AllRules from '@vee-validate/rules';
// eslint-disable-next-line import/no-extraneous-dependencies
import { localize, setLocale } from '@vee-validate/i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import App from './App.vue';
import router from './router';
// vee-validate 規則
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true, // 當輸入任何內容直接進行驗證
});
// 設定預設語系
setLocale('zh_TW');

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.use(CKEditor);
app.component('VueLoading', Loading);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);
app.mount('#app');
