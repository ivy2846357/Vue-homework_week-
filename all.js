/* 使用 ESM 載入 Vue */
import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

/* 載入元件 */

import bsProductModal from './bsProductMdal.js';

/* 建立 Vue 的初始及實體化環境 */
const app = createApp({
    data() {
        return {
            // 站點網址
            url: 'https://vue3-course-api.hexschool.io/',
            // 自己申請的 API 路徑
            api_path: 'ivy2846357',
            // 商品 id 存放處
            productId: '',
            // 商品資料存放處
            product: {},
            // 購物車資料存放處
            cartProduct: {},
            // 控制 loading 啟用 / 取消
            isLoading: ''

        }
    },
    methods: {
        // 取得購物車商品資料
        getProduct() {
            axios.get(`${this.url}/v2/api/${this.api_path}/products/all`)
                .then(res => {
                    this.product = res.data.products;
                })
                .catch(err => {
                    console.log('商品資料取得失敗')
                })
        },
        // 開啟單一商品modal
        openProductModal(id) {
            // 將外部的 id 資料載入 data 內
            this.productId = id;
            this.$refs.productModal.openModal();
        },
        // 取得購物車清單
        getCart() {
            axios.get(`${this.url}/v2/api/${this.api_path}/cart`)
                .then(res => {
                    this.cartProduct = res.data.data;
                })
                .catch(err => {
                    console.log('購物車資料取得失敗')
                })
        },
        // 加入商品至購物車
        addProductToCart(id, qty = 1) {
            // 設定資料格式
            const cartProductData = {
                product_id: id,
                qty
            }
            this.isLoading = id;
            // 加入購物車
            axios.post(`${this.url}/v2/api/${this.api_path}/cart`, {
                    "data": cartProductData
                })
                .then(res => {
                    this.cartProduct = res.data.data;
                    this.getCart();
                    // 取消 loading
                    this.isLoading = '';
                })
                .catch(err => {
                    console.log('商品加入失敗')
                })
        },
        // 刪除單一商品
        delSingleProduct(id) {
            this.isLoading = id;
            axios.delete(`${this.url}/v2/api/${this.api_path}/cart/${id}`)
                .then(res => {
                    console.log('已刪除購物車商品');
                    this.getCart();
                    this.isLoading = '';
                })
                .catch(err => {
                    console.log('商品刪除失敗');
                })
        },
        // 清空購物車
        delAllProduct() {
            axios.delete(`${this.url}/v2/api/${this.api_path}/carts`)
                .then(res => {
                    console.log('已清空購物車');
                    this.getCart();
                })
                .catch(err => {
                    console.log('商品刪除失敗');
                })
        },
        // 變更購物車商品數量
        updateProductNum(item) {
            const cartProductData = {
                product_id: item.id,
                qty: item.qty
            }
            this.isLoading = item.id;

            axios.put(`${this.url}/v2/api/${this.api_path}/cart/${item.id}`, {
                    "data": cartProductData
                })
                .then(res => {
                    this.cartProduct = res.data.data;
                    this.getCart();
                    this.isLoading = '';
                })
                .catch(err => {
                    console.log('商品加入失敗')
                })
        },
    },
    // 設定元件資料
    components: {
        bsProductModal
    },
    mounted() {
        // 網頁開啟即取出商品 / 購物車資料
        this.getProduct();
        this.getCart();
    }
})


/* 載入 vee-validate 套件 */


// 載入 vee-validate 所有的驗證規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源( ErrorMessage 內容)
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

// 載入 vee-validate 所有的驗證規則
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);



app.mount('#app');