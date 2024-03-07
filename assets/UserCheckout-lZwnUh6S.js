import{_ as h,r as p,o as n,c as l,b as f,e as t,p as g,F as a,h as m,t as s,i as y}from"./index-4OsAil_u.js";var L={VITE_URL:"https://vue3-course-api.hexschool.io",VITE_PATH:"vuejs",BASE_URL:"/2023vueWeek7/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const{VITE_URL:c,VITE_PATH:u}=L,v={data(){return{order:{user:{}},orderId:"",isLoading:!1}},methods:{getOrder(){const d=`${c}/v2/api/${u}/order/${this.orderId}`;this.isLoading=!0,this.$http.get(d).then(o=>{this.order=o.data.order,this.isLoading=!1}).catch(o=>{this.isLoading=!1,alert(o.response.data.message)})},payOrder(){const d=`${c}/v2/api/${u}/pay/${this.orderId}`;this.isLoading=!0,this.$http.post(d).then(()=>{this.isLoading=!1,this.getOrder()}).catch(o=>{this.isLoading=!1,alert(o.response.data.message)})}},created(){this.orderId=this.$route.params.orderId,this.getOrder()}},b={class:"my-5 row justify-content-center"},x={class:"table align-middle"},V=t("thead",null,[t("th",null,"品名"),t("th",null,"數量"),t("th",null,"單價")],-1),E={class:"text-end"},I=t("td",{colspan:"2",class:"text-end"},"總計",-1),k={class:"text-end"},O={class:"table"},T=t("th",{width:"100"},"Email",-1),R=t("th",null,"姓名",-1),S=t("th",null,"收件人電話",-1),B=t("th",null,"收件人地址",-1),D=t("th",null,"付款狀態",-1),U={key:0},w={key:1,class:"text-success"},A={key:0,class:"text-end"},C=t("button",{type:"submit",class:"btn btn-danger"},"確認付款去",-1),N=[C];function P(d,o,j,F,e,i){const _=p("VueLoading");return n(),l(a,null,[f(_,{active:e.isLoading,"z-index":1060},null,8,["active"]),t("div",b,[t("form",{class:"col-md-6",onSubmit:o[0]||(o[0]=g((...r)=>i.payOrder&&i.payOrder(...r),["prevent"]))},[t("table",x,[V,t("tbody",null,[(n(!0),l(a,null,m(e.order.products,r=>(n(),l("tr",{key:r.id},[t("td",null,s(r.product.title),1),t("td",null,s(r.qty)+"/"+s(r.product.unit),1),t("td",E,s(r.final_total),1)]))),128))]),t("tfoot",null,[t("tr",null,[I,t("td",k,s(e.order.total),1)])])]),t("table",O,[t("tbody",null,[t("tr",null,[T,t("td",null,s(e.order.user.email),1)]),t("tr",null,[R,t("td",null,s(e.order.user.name),1)]),t("tr",null,[S,t("td",null,s(e.order.user.tel),1)]),t("tr",null,[B,t("td",null,s(e.order.user.address),1)]),t("tr",null,[D,t("td",null,[e.order.is_paid?(n(),l("span",w,"付款完成")):(n(),l("span",U,"尚未付款"))])])])]),e.order.is_paid===!1?(n(),l("div",A,N)):y("",!0)],32)])],64)}const M=h(v,[["render",P]]);export{M as default};