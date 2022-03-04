/* 使用 ESM 載入 Vue */
import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

/* 載入元件 */

import bsProductModal from './bsProductMdal.js';

/* 載入 vee-validate 套件 */

// 抓取 vee-validate 元件及功能
const {
    defineRule,
    Form,
    Field,
    ErrorMessage,
    configure
} = VeeValidate;
// 抓取 vee-validate 的規則
const {
    required,
    email,
    min,
    max
} = VeeValidateRules;
// 抓取 vee-validate 的多國語系提示
const {
    localize,
    loadLocaleFromURL
} = VeeValidateI18n;

// 編輯 VeeValidateRules 的驗證功能
// 第一個參數為自定義的名稱，第二個參數為 VeeValidateRules 要載入的驗證功能
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 載入 vee-validate 提供的 JSON 檔案
loadLocaleFromURL('./zh_TW.json');

// 這裡用來設定中文語系的提示
configure({
    //啟用中文語系
    generateMessage: localize('zh_TW'),
    // true 為輸入文字時，就立即進行驗證
    validateOnInput: true,
});

/* 建立 Vue 的初始及實體化環境 */
const app = Vue.createApp({
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
            isLoading: false,
            form: {
                user: {
                    email: '',
                    name: '',
                    tel: '',
                    address: ''
                },
                message: ''
            }

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
        // 送出訂單
        onSubmit() {
            this.isLoading = true;
            axios.post(`${this.url}/v2/api/${this.api_path}/order`, {
                    "data": this.form
                })
                .then(res => {
                    alert('訂單已送出');
                    // 清空表單資料
                    this.$refs.form.resetForm();
                    // 清空購物車資料
                    this.getCart();
                    this.isLoading = false;
                })
                .catch(err => {
                    console.log('流程錯誤，訂單沒有送出');
                })
        },
        // 自行驗證訂單資料是否送出
        getOrderList() {
            axios.get(`${this.url}/v2/api/${this.api_path}/orders`)
                .then(res => {
                    console.log(res);
                })
        },
        // 檢查電話格式
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        }
    },
    // 設定元件資料
    components: {
        bsProductModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    mounted() {
        // 網頁開啟即取出商品 / 購物車資料
        this.getProduct();
        this.getCart();
    }
})

app.mount('#app');