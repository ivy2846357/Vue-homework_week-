/* productModal 元件設定 */

export default {
    data() {
        return {
            // modal 設定
            productModal: {},
            // 商品資料存放處
            tempProduct: {}
        }
    },
    // 從外層取得資料
    props: ['id', 'url', 'api_path'],
    watch: {
        // 監聽當 id 有變動時，就執行函式
        id() {
            this.getProductInfo();
        }
    },
    // 元件樣式
    template: '#userProductModal',
    methods: {
        // 開啟 modal 函式
        openModal() {
            this.productModal.show();
        },
        // 取得單一商品資料
        getProductInfo() {
            axios.get(`${this.url}/v2/api/${this.api_path}/product/${this.id}`)
                .then(res => {
                    // 將資料傳入 data 的 tempProduct 內
                    this.tempProduct = res.data.product;
                })
                .catch(err => {
                    console.log('商品資料取得失敗')
                })
        }
    },
    mounted() {
        // bs modal 設定
        this.productModal = new bootstrap.Modal(this.$refs.modal);
    }
}