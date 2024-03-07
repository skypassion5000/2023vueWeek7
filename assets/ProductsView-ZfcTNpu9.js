import{_ as h,g as p,o,c,e as t,F as l,h as a,d as r,t as e,i as u}from"./index-4OsAil_u.js";var m={VITE_URL:"https://vue3-course-api.hexschool.io",VITE_PATH:"vuejs",BASE_URL:"/2023vueWeek7/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const{VITE_URL:g,VITE_PATH:y}=m,v={data(){return{products:[],tempProduct:{}}},methods:{getData(){const n=`${g}/v2/api/${y}/products/all`;p.get(n).then(i=>{this.products=i.data.products}).catch(i=>{alert(i.response.data.message)})}},mounted(){this.getData()}},P={class:"mt-4"},b={class:"row py-3"},x={class:"col-md-6"},f=t("h2",null,"產品列表",-1),k={class:"table table-hover mt-4"},w=t("thead",null,[t("tr",null,[t("th",{width:"150"},"產品名稱"),t("th",{width:"120"}," 原價 "),t("th",{width:"120"}," 售價 "),t("th",{width:"150"}," 是否啟用 "),t("th",{width:"120"}," 查看細節 ")])],-1),V={width:"150"},E={width:"120"},T={width:"120"},D={width:"150"},R={key:0,class:"text-success"},U={key:1},B={width:"120"},I=["onClick"],L={class:"col-md-6"},S=t("h2",null,"單一產品細節",-1),j={key:0},A={class:"card mb-3"},C=["src"],N={class:"card-body"},F={class:"card-title"},H={class:"badge bg-primary ms-2"},O={class:"card-text"},M={class:"card-text"},W={class:"d-flex"},q={class:"card-text me-2"},z={class:"card-text text-secondary"},G=["src"],J={key:1,class:"text-secondary"};function K(n,i,Q,X,s,Y){return o(),c("div",P,[t("div",b,[t("div",x,[f,t("table",k,[w,t("tbody",null,[(o(!0),c(l,null,a(s.products,d=>(o(),c("tr",{key:d.id},[t("td",V,e(d.title),1),t("td",E,e(d.origin_price),1),t("td",T,e(d.price),1),t("td",D,[d.is_enabled?(o(),c("span",R,"啟用")):(o(),c("span",U,"未啟用"))]),t("td",B,[t("button",{type:"button",class:"btn btn-primary",onClick:_=>s.tempProduct=d},"查看細節",8,I)])]))),128))])]),t("p",null,[r("目前有 "),t("span",null,e(s.products.length),1),r(" 項產品")])]),t("div",L,[S,s.tempProduct.title?(o(),c("div",j,[t("div",A,[t("img",{src:s.tempProduct.imageUrl,height:"300",class:"card-img-top primary-image",style:{"object-fit":"cover"},alt:"主圖"},null,8,C),t("div",N,[t("h5",F,[r(e(s.tempProduct.title)+" ",1),t("span",H,e(s.tempProduct.category),1)]),t("p",O,"商品描述："+e(s.tempProduct.description),1),t("p",M,"商品內容："+e(s.tempProduct.content),1),t("div",W,[t("p",q,e(s.tempProduct.price),1),t("p",z,[t("del",null,e(s.tempProduct.origin_price),1)]),r(" "+e(s.tempProduct.unit)+" / 個 ",1)])])]),(o(!0),c(l,null,a(s.tempProduct.imagesUrl,(d,_)=>(o(),c("span",{key:_},[d?(o(),c("img",{key:0,src:d,class:"images m-2",style:{"object-fit":"cover"},height:"300"},null,8,G)):u("",!0)]))),128))])):(o(),c("p",J,"請選擇一個商品查看"))])])])}const $=h(v,[["render",K]]);export{$ as default};