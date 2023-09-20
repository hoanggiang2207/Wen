<template>
    <vue-basic-alert :duration="300" :closeIn="2000" ref="alert" />

    <div v-if="user" class="quick-view">
        <div class="quick-view-inner" v-for="f in selectedFood" :key="f">
            <h2 class="d-flex justify-content-between">{{ f.food_name }}
                <slot></slot>
            </h2>
            <div class="product-detail d-flex">
                <div class="image">
                    <img :src="require(`../assets/images/${f.food_src}`)" alt="" />
                </div>
                <div class="content">
                    <p class="desc">{{ f.food_desc }}</p>
                    <p class="money">{{ (parseFloat(f.food_price) - parseFloat(f.food_discount) + parseFloat(this.optionPrice)) * this.qty}}đ<span
                            v-if="parseFloat(f.food_discount) > 0">{{
                                    (parseFloat(f.food_price) + parseFloat(this.optionPrice))*parseFloat(this.qty)
                            }}đ</span></p>
                    <div class="qty">
                        <label for="qty">Số lượng:</label>
                        <input type="number" name="qty" id="qty" value="1" min="1" max="1000"
                            @change="onQtyChange($event)" />
                    </div>
                    <div class="option" style="font-size: 15px;">
                        <label for="option">Toppings: </label>

                        <span v-for="option in getFoodsOptions" :key="option">
        
                                <input type="checkbox" :id="option.option_id" :value="option.option_id" v-model="options">
                                <label :for="option.option_id">{{ option.option_description }}</label>
                            
                        </span>
                    </div>
                    
                    
                    <button class="btn" @click="addToCart">Thêm vào giỏ hàng</button>
                    <button class="btn" @click="updatePriceOption">Update</button>
                    <button class="btn check-out-btn" @click="checkOutBtn()"><i class="fa fa-shopping-cart"></i>Thanh toán</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="quick-view">
        <div class="quick-view-inner">
            <h2 class="d-flex justify-content-between">Đăng nhập để sử dụng dịch vụ
                <slot></slot>
            </h2>
            <div class="link-to-login" style="text-align: center; margin-top: 120px;">
                <router-link class="btn" to="/login" style="padding: 28px; font-size: 24px">Đăng nhập
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import VueBasicAlert from 'vue-basic-alert';
export default {
    props: ['food'],
    name: "QuickView",

    data() {
        return {
            qty: 1,
            options: [],
            note : "none",
            optionPrice: 0,
        }
    },
    created() {

    },
    computed: {
        ...mapState(["allFoods", "user","optionFoods"]),

        selectedFood: function () {
            let data = this.allFoods.filter((f) => parseInt(f.food_id) == parseInt(this.food));
            //console.log(data);
            return data;
        },

        getFoodsOptions : function (){
            let data = this.optionFoods.filter((f) => parseInt(f.food_id) == parseInt(this.food)) ;

            return data;
        },


    },

    methods: {

        updatePriceOption : function(){
            let i;
            let totalPriceOption = 0;
            let foodOption = this.getFoodsOptions;

                for(i=0;i<this.options.length;i++){
                    
                    let data = foodOption.filter((f) => parseInt(f.option_id) == parseInt(this.options[i]));
                    totalPriceOption = parseInt(totalPriceOption) + parseInt(data[0].price_option); 
                       
                }
            this.optionPrice = totalPriceOption;
            console.log("option " , this.options);
            console.log("price " , this.optionPrice);
        },
        onQtyChange: function (e) {
            if (e.target.value < 1) {
                e.target.value = 1;
                this.qty = e.target.value;

            } else {
                this.qty = e.target.value;
            }

        },
        checkOutBtn: function () {
            this.$router.push("/checkout");
        },

        async addToCart() {

            this.updatePriceOption();
            if(this.options.length == 0){
                this.options.push(1);
            }
            //convert to string option
            let option = this.options.reduce((a, b) => a + '_' + b);
            //handle price for opption


            console.log("option =" + option);
            

                let existItem = await axios.get('/cartItem/' + parseInt(this.user.user_id) + '/' + parseInt(this.food) + '/'+ option );

                if (existItem.data.length == 1) {
                    
                    let data = {
                        user_id: parseInt(this.user.user_id),
                        food_id: parseInt(this.food),
                        item_qty: parseInt(this.qty) + parseInt(existItem.data[0].item_qty),
                        //handle note and optional items
                        option_id: option,
                        note : this.note,
                        total_price_option: this.optionPrice,


                    };
                    await axios.put("/cartItem/", data)
                    this.$refs.alert.showAlert('success', 'Thank you!', 'Add To Cart Successfully !')

                } else {
                    let data = {
                        user_id: parseInt(this.user.user_id),
                        food_id: parseInt(this.food),
                        item_qty: parseInt(this.qty),
                        //handle note and optional items
                        option_id: option,
                        note : this.note,
                        total_price_option: this.optionPrice,
                    };

                    await axios.post("/cartItem/", data)
                    this.$refs.alert.showAlert('success', 'Thank you!', 'Add To Cart Successfully !')
                }
            
            this.options = [];
            this.note = "none";
            this.optionPrice=0;
        }
    },

    components: {
        VueBasicAlert
    }
}
</script>

<style scoped>
.quick-view {
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

.quick-view .quick-view-inner {
    width: 45vw;
    height: 45vh;
    background-color: #fff;
    padding: 32px;
}


.quick-view .quick-view-inner h2 {
    margin: 0;
    font-size: 32px;
    color: #edfb54;
}

.quick-view .quick-view-inner .product-detail .image img {
    height: 20rem;
    margin: 20px;
}

.quick-view .quick-view-inner .product-detail .content {
    margin-top: 20px;
    font-size: 20px;
    width: 100%;
}

.quick-view .quick-view-inner .product-detail .content p span {
    margin-left: 5px;
    text-decoration: line-through;
    opacity: 0.5;
}

.quick-view .quick-view-inner .product-detail .content div label {
    margin-right: 10px;
}

.quick-view .quick-view-inner .product-detail .content .btn {
    margin-top: 20px;
    float: right;
}

@media (max-width: 768px) {

    .quick-view .quick-view-inner {
        width: 50vw;
        height: 40vh;

    }

    .quick-view .quick-view-inner h2 {
        font-size: 20px;
    }

    .quick-view .quick-view-inner .btn {
        font-size: 10px;
        padding: 0.3rem 0.9rem;
    }

    .quick-view .quick-view-inner .product-detail .image img {
        height: 12rem;
        margin: 30px;
        margin-left: 0px;

    }

    .quick-view .quick-view-inner .product-detail .content .desc {
        font-size: 12px;
    }

    .quick-view .quick-view-inner .product-detail .content .qty {
        font-size: 12px;
    }

    .link-to-login {
        margin-top: 20px !important;
    }
}

@media (max-width: 576px) {
    .quick-view .quick-view-inner {
        width: 90vw;
        height: 40vh;
    }

    .link-to-login {
        margin-top: 50px !important;
    }

    .link-to-login>a {
        padding: 20px !important;
        font-size: 18px !important;
    }

}
</style>
