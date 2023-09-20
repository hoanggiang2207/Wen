<template>
    <div class="order-details">
        <div class="order-details-inner">
            <h2 class="d-flex justify-content-between">Chi Tiết đơn hàng
                <slot></slot>
            </h2>
            <div class="d-flex flex-wrap h-50 flex-row" style="overflow-y: auto;">
                <div style="flex: 50%;" v-for="(f) in data" :key="f.food_id">
                    <div class="product-detail d-flex">
                        <div class="image">
                            <img :src="require(`../assets/images/${f.food_src}`)" alt="" />
                        </div>
                        <div class="content">
                            <p class="name">{{ f.food_name }} <span>X {{ f.item_qty }} X {{handleOptionName(f.option_id)}}</span></p>
                            <p class="desc">{{ f.food_desc }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="price">
                <p>Sale: {{ this.data[0].bill_discount }}đ</p>
                <p>Phí vận chuyển: {{ this.data[0].bill_delivery }}đ</p>
                <p>Tổng cộng: {{ this.data[0].bill_total }}đ</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
    props: ['bill'],
    name: "OrderDetails",

    data() {
        return {
            data:[],
        }
    },

    created() {
        this.getAllData();
        
    },

    computed: {
        ...mapState(["optionFoods"]),


        
    },

    methods: {
        
        handleOptionName: function (data) {
            let result = "-";
            
            for(let i=0;i<data.length;i++){
                if(data[i] != "_"){
                    
                    let op = this.optionFoods.filter((f) => parseInt(f.option_id)==parseInt(data[i]));
                    result += op[0].option_description + "-";
                }
            }
            console.log("result",result);
            return result;
        },
        
        
        async getAllData() {
            if (this.bill) {
                this.data = (await axios.get('/billstatus/bill/' + this.bill)).data;
                console.log("bill match = ",this.data[0]);
            }
        },
    }
}
</script>

<style scoped>
.order-details {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: center;
}

.order-details .order-details-inner {
    width: 60vw;
    height: 70vh;
    background-color: #fff;
    padding: 32px;
}


.order-details .order-details-inner h2 {
    margin: 0;
    font-size: 32px;
    color: #f0f85c;
    margin-bottom: 20px;
}


.order-details .order-details-inner .product-detail .image img {
    height: 8rem;
    width: 8rem;
    margin: 20px;
}

.order-details .order-details-inner .product-detail .content {
    margin-top: 20px;
    font-size: 12px;
    width: 100%;
}

.order-details .order-details-inner .product-detail .content p:first-of-type {
    font-size: 16px;
    color: #efdf4f;
}

.order-details .order-details-inner .product-detail .content p span {
    font-size: 14px;
    color: black;
}

.order-details .order-details-inner .price {
    margin-top: 30px;
    font-size: 16px;
}


@media (max-width: 768px) {

    .order-details .order-details-inner {
        width: 80vw;
        height: 60vh;

    }

    .order-details .order-details-inner h2 {
        font-size: 20px;
    }

    .order-details .order-details-inner .product-detail .content .desc,
    .order-details .order-details-inner .product-detail .content .name span {
        font-size: 12px !important;
    }

    .order-details .order-details-inner .product-detail .content .name {
        font-size: 14px !important;
    }


}

@media (max-width: 576px) {
    .order-details .order-details-inner {
        width: 90vw;
        height: 65vh;
    }

    .order-details .order-details-inner div:first-of-type {
        flex-direction: column;
    }
}

@media (max-width: 376px) {
    .order-details .order-details-inner {
        width: 90vw;
        height: 65vh;
        padding: 5px !important;
    }

    .order-details .order-details-inner .product-detail .content .name {
        font-size: 12px !important;
    }


}
</style>
