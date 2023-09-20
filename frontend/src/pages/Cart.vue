<template>
    <div class="shopping-cart-section">

        <div class="heading">
            <span>Shopping cart</span>
            <h3>Good products, fast delivery</h3>
        </div>

        <div class="container">
            <div class="wrapper wrapper-content">
                <div class="row">
                    <div class="in-cart col-md-9">
                        <div class="box">
                            <div class="box-title item-total row">
                                <h3>
                                    <p style="font-size: 15px;">số món: {{ filterFoods.length.toString() }}
                                        <span v-if="filterFoods.length < 2"></span>
                                        <span v-else>items</span>
                                    </p>Giỏ hàng của bạn
                                </h3>
                            </div>

                            <div v-if="!filterFoods.length">
                                <div class="box-content row no-food">
                                    <div class="content">
                                        <h2 style="color: #057835fa;">Bạn không có món nào trong giỏ hàng. Đặt hàng ngay.</h2>
                                    </div>
                                    <div class="image">
                                        <img src="../assets/images/notfound.png" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div v-for="(f, index) in filterFoods" :key="index">
                                    <div class="box-content row">
                                        <div class="image-box col-sm-3" style="padding-left: 0;">
                                            <img :src="require(`../assets/images/${f.food_src}`)" alt=""
                                                class="cart-product-img" />
                                        </div>

                                        <div class="desc col-sm-4">
                                            <h2 class="item-name">{{ f.food_name }}</h2>
                                            <div class="item-desc">
                                                <b>Thông tin món</b>
                                                <p>{{ f.food_desc }}</p>
                                            </div>
                                            <button class="btn remove-btn" @click="removeBtn(f.food_id,f.option_id,index)"><i
                                                    class="fa fa-trash"></i>Xoá món</button>
                                        </div>

                                        <div class="item-price col-sm-1">
                                            <span class="sale-price">{{ parseFloat(f.food_price) -
                                                    parseFloat(f.food_discount)
                                            }}đ</span>
                                            <p class="text-muted first-price"
                                                v-if="parseFloat(f.food_discount) != 0.00">
                                                {{
                                                        parseFloat(f.food_price)
                                                }}đ

                                            </p>
                                        </div>

                                        <div class="item-qty col-sm-2 d-inline">
                                            <label for="iQuantity"
                                                style="font-size: 12px; padding-right: 2px;">Số lượng:</label>
                                            <input type="number" id="iQuantity" class="form-control item-quantity"
                                                :value="itemQuantity[index]" min="1" max="1000"
                                                @change="onQtyChange($event, index)">
                                        </div>

                                        <div class="cal-total col-sm-2">
                                            <h4 class="item-total">{{
                                                    calculateItemPrice(index) 
                                            }}đ 
                                            </h4>
                                            <span>{{handleOptionName(f.option_id)}}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div class="box-content row">
                            <router-link to="/menu" class="btn shop-btn"><i class="fa fa-arrow-left"></i>Tiếp tục chọn</router-link>
                            <button class="btn check-out-btn" style="margin-left: 10px;"
                                :disabled="filterFoods.length ? false : true" @click="checkOutBtn()"><i
                                    class="fa fa fa-shopping-cart"></i>Thanh toán</button>
                        </div>
                    </div>


                    <div class="col-md-3">
                        <div class="box">
                            <div class="box-title">
                                <h3>Tổng giỏ hàng</h3>
                            </div>

                            <div class="box-content">
                                <span>Tổng cộng</span>
                                <h3 class="font-bold total-first-price">{{ calculateSummaryPrice()[0] }}đ</h3>

                                <span>khuyến mại</span>
                                <h3 class="font-bold total-discount">{{ calculateSummaryPrice()[1] }}đ</h3>

                                <span>Phí vận chuyển</span>
                                <h3 class="font-bold total-delivery">{{ calculateSummaryPrice()[2] }}đ</h3>

                                <hr />

                                <span>Tổng của bạn hết:</span>
                                <h2 class="font-bold total-sale">{{ calculateSummaryPrice()[3] }}đ</h2>

                                <div class="btn-group">
                                    <button class="btn check-out-btn" :disabled="filterFoods.length ? false : true"
                                        @click="checkOutBtn()"><i class="fa fa-shopping-cart"></i>
                                        Thanh toán</button>
                                    <button class="btn cancel-btn" @click="cancelBtn()"
                                        :disabled="filterFoods.length ? false : true">
                                        Huỷ</button>
                                </div>
                            </div>
                        </div>

                        <div class="box">
                            <div class="box-title">
                                <h3>Hỗ Trợ</h3>
                            </div>
                            <div class="box-content text-center">
                                <h3><i class="fa fa-phone"></i> +84 918347417</h3>
                                <span class="small">
                                    Vui lòng gọi nếu có bất cứ vấn đề gì xảy ra. Phục vụ 24/7.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
    name: "Cart",

    data() {
        return {
            itemQuantity: [],
            cart :[],

        };
    },

    created() {
        this.getAllCartItem();
    },

    computed: {
        ...mapState(["allFoods", "user","optionFoods"]),

        filterFoods: function () {
            //get intersection array by cart
            let data = this.cart.filter((g) => this.allFoods.filter((f) => f.food_id == g.food_id ));
            console.log("data filter = ",data);
            return data;
        },
    },

    methods: {
        
        calculateItemPrice: function (index) {

            let food_price = parseInt(this.filterFoods[index].food_price);
            let discount = parseInt(this.filterFoods[index].food_discount);
            let qty = parseInt(this.itemQuantity[index]);
            let price_option = parseInt(this.filterFoods[index].total_price_option);

            let result = ((food_price - discount)*qty) + price_option;

            // console.log("food price = ",food_price);
            // console.log(" qty = ",qty);
            // console.log("dis = ",   discount);
            // console.log("op = ",   price_option);
            // console.log("rl = ",   result);
            return result;

        },
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
        calculateSummaryPrice: function () {
            let subtotal = 0;
            let discount = 0;
            let delivery = 15000;
            let i = 0;
            let filterFoods = this.filterFoods;
            console.log("test =" ,filterFoods);

            while (i < this.itemQuantity.length) {
                subtotal = subtotal + parseInt(filterFoods[i].food_price) * this.itemQuantity[i] + parseInt(filterFoods[i].total_price_option);
                discount = discount + parseInt(filterFoods[i].food_discount) * this.itemQuantity[i] + parseInt(filterFoods[i].total_price_option);
                i = i + 1
            }
            if (!this.filterFoods.length) {
                delivery = 0
            }
            let total = subtotal - discount + delivery;
            return [subtotal, discount, delivery, total];
        },

        async onQtyChange(e, i) {
            if (e.target.value < 1) {
                e.target.value = 1
                this.itemQuantity[i] = 1
            } else {
                this.itemQuantity[i] = e.target.value;
            }

            let data = {
                user_id: parseInt(this.user.user_id),
                food_id: parseInt(this.cart[i].food_id),
                item_qty: this.itemQuantity[i],
                //handle opt 
                option_id: this.cart[i].option_id,
            };
            await axios.put("/cartItem/", data)
        },

        async cancelBtn() {
            await axios.delete("/cartItem/" + this.user.user_id);

            this.cart = [];
            this.itemQuantity = [];
            
        },

        checkOutBtn: function () {
            this.$router.push("/checkout");
        },

        async removeBtn(food_id,option_id,index) {
            await axios.delete("/cartItem/" + this.user.user_id + "/" + food_id + "/" + option_id);

            this.cart.splice(index, 1);
            this.itemQuantity.splice(index, 1);
        },
        
        async getAllCartItem() {
            if (this.user) {
                let existItem = await axios.get('/cartItem/' + this.user.user_id);

                this.cart = [...existItem.data];
                
                existItem.data.forEach((f) => {
                    this.itemQuantity.push(f.item_qty);
                });
               
                
                console.log("getall = ", existItem.data);
            }
        }


    }

}
</script>


<style scoped>
.shopping-cart-section {
    background: #fff;
    padding: 2rem 9%;
}

.item-name {
    color: #f4ff57
}

.cart-product-img {
    text-align: center;
    width: 100%;
    height: 125px;
    object-fit: cover;
    background-color: #f7f7f7;

}

.box {
    clear: both;
    margin: 0;
    margin-bottom: 20px;
    padding: 0;
}

.box:after,
.box:before {
    display: table;
}

.box-title {
    background-color: inherit;
    border-color: #e7eaec;
    border-style: solid solid none;
    border-width: 3px 0 0;
    color: inherit;
    margin-bottom: 0;
    padding: 14px 15px 7px;
    min-height: 78px;
}

.box-content {
    background-color: inherit;
    color: inherit;
    padding: 15px 20px 20px 20px;
    border-color: #e7eaec;
    border-image: none;
    border-style: solid solid none;
    border-width: 1px 0;

}

.item-desc b {
    font-size: 12px;
}

.item-desc p {
    font-size: 10px;
}

.sale-price,
.first-price,
.item-quantity {
    font-size: 12px;
}

.item-quantity {
    width: 60px;
    height: 15px;
}

.first-price {
    text-decoration: line-through;
}

.remove-btn {
    font-size: 10px;
    padding: 5px;
    margin-top: 27px;
}

.remove-btn i {
    padding-right: 5px;
}

.box-content button i,
.box-content a i {
    padding-right: 5px;
}

.no-food {
    text-align: center;
    justify-content: center;
    display: block;
}

.no-food .image img {
    width: 200px;
    height: 200px;
}


@media (max-width: 768px) {
    .box-content .item-name {
        font-size: 14px;
    }

    .desc button {
        position: absolute;
        bottom: 0;
    }

    .box-content .btn-group {
        display: block;
    }

    .box-content .btn-group button {
        border-radius: .5rem !important;
    }

    .box-content .btn-group button i {
        margin-top: 3px;
    }

    .box-content .btn-group .check-out-btn {
        display: flex;
        margin-top: 10px;
        margin-bottom: 10px;
    }
}

@media (max-width: 576px) {

    .box-title {
        min-height: 48px;
    }

    .box-title.item-total {
        border: none;
    }

    .in-cart .box-content .btn-group {
        margin-top: 5px;
        display: inline-flex;
    }

    .in-cart .box-content .btn-group .check-out-btn {
        display: flex;
        margin-top: 0px;
        margin-right: 5px;
        margin-bottom: 0px;
    }

    .image-box {
        position: absolute;
        opacity: 0.8;
        max-width: 100%;
        width: 100%;
        max-height: 100%;
        filter: brightness(60%);
        padding: none;
    }

    .image-box img {
        border-radius: 15px;

    }

    .in-cart .box-content {
        color: white;
        margin-left: -25px;
        border: none;
        display: flex;
    }

    .desc .item-name {
        color: black !important; 
        font-size: 16px;
        filter: brightness(160%);
    }

    .desc b {
        font-size: 10px;
    }

    .desc p {
        font-size: 12px;
    }

    .desc .remove-btn {
        font-size: 10px;
        position: relative;

    }

    .item-price {
        position: absolute;
        margin-top: 55px;
    }

    .item-price .first-price {
        display: inline;
        padding-left: 5px;
        color: red !important;
    }

    .item-qty {
        position: absolute;
        margin-top: 55px;
        padding-left: 160px;
    }

    .cal-total {
        display: none;
    }

    .in-cart .box-content .check-out-btn {
        display: none;
    }

}
</style>