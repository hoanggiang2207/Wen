<template>
    <div class="checkout-container">
        <div class="checkout-form-container">
            <form id="checkoutForm" @submit="handleSubmit" novalidate autocomplete="off">
                <div class="checkout-heading">
                    <h3>Hoàn thành các bước để thanh toán<span>Tổng cộng</span></h3>
                    <h3 v-if="user">Đơn hàng của {{ user.user_name }}<span>{{ calculateSummaryPrice()[3] }}đ</span></h3>
                </div>

                <div class="form-group details-group">
                    <h4>Thông tin chi tiết</h4>
                    <div class="form-group">
                        <input type="text" name="coPhone" id="coPhone" placeholder="Số điện thoại" class="form-control"
                            v-model="checkoutObj.phone" />
                        <p class="error-mess" v-if="errorObj.phoneErr.length > 0">{{ errorObj.phoneErr[0] }}</p>
                    </div>

                    <div class="form-group">
                        <input type="text" name="coAddress" id="coAddress" placeholder="Địa chỉ"
                            class="form-control" v-model="checkoutObj.address" />
                        <p class="error-mess" v-if="errorObj.addressErr.length > 0">{{ errorObj.addressErr[0] }}</p>
                    </div>
                </div>

                <div class="form-group details-group">
                    <h4>Cách thức thanh toán</h4>
                    <div class="form-group">
                        <div class="form-group">
                            <input type="radio" name="payment" value="cash" id="paymentCash"
                                v-model="checkoutObj.paymentMethod" /><span>Tiền mặt</span>
                            <input type="radio" name="payment" value="card" id="paymentCard"
                                v-model="checkoutObj.paymentMethod" /><span>Chuyển khoản</span>
                        </div>
                        <p class="error-mess" v-if="errorObj.payErr.length > 0">{{ errorObj.payErr[0] }}</p>
                    </div>


                    <div v-if="checkoutObj.paymentMethod == 'card'">
                        

                        <div class="form-group">
                            <input v-upcase type="text" name="coCardName" placeholder="Nhập tên thẻ"
                                id="coCardName" class="form-control" v-model="cardObj.name" />
                            <p class="error-mess" v-if="errorObj.nameErr.length > 0">{{ errorObj.nameErr[0] }}</p>
                        </div>
                        
                        <div class="qr">
                            <img src="../assets/images/qrthanhtoan.png">
                        </div>
                        
                        <h3>Quét mã sau và gọi cho số: 0918347417 để xác nhận đơn hàng</h3>
                        
                    </div>
                </div>

                <div v-if="user" class="form-group">
                    <input type="submit" value="Đồng ý và thanh toán" class="btn"
                        :disabled="filterFoods.length ? false : true" />
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
    name: "Checkout",

    data() {
        return {
            checkoutObj: { phone: "", address: "", paymentMethod: "" },
            cardObj: { number: "", name: "", expiryDate: "", cvv: "" },
            errorObj: { phoneErr: [], addressErr: [], payErr: [], nameErr: [], },
            cart :[],
            itemQuantity: [],
        }
    },

    created() {
        this.getAllCartItem();
    },

    computed: {
        ...mapState(["allFoods", "user","optionFoods"]),

        filterFoods: function () {
            //get intersection food and cart
            let data = this.cart.filter((g) => this.allFoods.filter((f) => f.food_id == g.food_id ));
            console.log("data filter = ",data);
            return data;
        },
    },

    methods: {
        availableTime: function () {
            var now = new Date();
            var currentMonth = ("0" + (now.getMonth() + 1)).slice(-2);

            var minRange = now.getFullYear() + "-" + currentMonth;
            var maxRange = (now.getFullYear() + 10) + "-" + currentMonth;

            document.getElementById("coCardEx").setAttribute("min", minRange);
            document.getElementById("coCardEx").setAttribute("max", maxRange);
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

        async getAllCartItem() {
            if (this.user) {
                let existItem = await axios.get('/cartItem/' + this.user.user_id);

                this.cart = [...existItem.data];
                
                existItem.data.forEach((f) => {
                    this.itemQuantity.push(f.item_qty);
                });
               
            }
        },

        resetCheckErr: function () {
            this.errorObj.phoneErr = [];
            this.errorObj.addressErr = [];
            this.errorObj.payErr = [];
            this.errorObj.nameErr = [];            
        },

        checkEmptyErr: function () {
            for (var typeErr in this.errorObj) {
                if (this.errorObj[typeErr].length != 0) {
                    return false;
                }
            }
            return true;
        },

        inputUpcase: function (e) {
            e.target.value = e.target.value.toUpperCase()
        },

        checkForm: function () {
            this.resetCheckErr();

            // Phone validate
            if (!this.checkoutObj.phone) {
                this.errorObj.phoneErr.push('Chưa nhập SĐT');
            }
            else {
                if (!this.checkoutObj.phone.startsWith('0')) {
                    this.errorObj.phoneErr.push('Số điện thoại phải bắt đầu bằng số 0');
                }

                if (this.checkoutObj.phone.length != 10) {
                    this.errorObj.phoneErr.push('Bắt buộc phải đủ 10 chữ số');
                }

                if (!/[0-9]{10}/.test(this.checkoutObj.phone)) {
                    this.errorObj.phoneErr.push('SĐT chỉ được là những chữ số');
                }
            }

            // Address validate
            if (!this.checkoutObj.address) {
                this.errorObj.addressErr.push('Chưa nhập địa chỉ');
            }

            // Card validate
            if (!this.checkoutObj.paymentMethod) {
                this.errorObj.payErr.push('Phải chọn hình thức thanh toán');
            }
            else if (this.checkoutObj.paymentMethod == "card") {
                
                if (!this.cardObj.name) {
                    this.errorObj.nameErr.push('Phải nhập tên thẻ');
                }
                else {
                    if (!/^[A-Za-z]+$/.test(this.cardObj.name.replace(/\s/g, ""))) {
                        this.errorObj.nameErr.push('Chỉ chưa các kí tự không phải chữ số');
                    }
                }

                


                
            } else if (this.checkoutObj.paymentMethod == "cash") {
                this.cardObj.number = "";
                this.cardObj.name = "";
                this.cardObj.expiryDate = "";
                this.cardObj.cvv = "";

                this.errorObj.numErr = [];
                this.errorObj.nameErr = [];
                this.errorObj.exDateErr = [];
                this.errorObj.cvvErr = [];
            }
        },

        isPaid: function () {
            if (this.checkoutObj.paymentMethod == "cash") {
                return "false"
            }
            else if (this.checkoutObj.paymentMethod == "card") {
                return "false"
            }
        },

        async sendBillDetails(billId, foodId, qty,option) {
            let billDetails = {
                bill_id: parseInt(billId),
                food_id: parseInt(foodId),
                item_qty: parseInt(qty),
                option_id :option,
            }

            await axios.post("/billdetails", billDetails);
        },

        async handleSubmit(e) {
            this.checkForm();

            if (!this.checkEmptyErr()) {
                e.preventDefault();
            } else {
                e.preventDefault();
                let billId = (await axios.get("/billstatus/new")).data;

                if (billId == "") {
                    billId = 1
                } else {
                    billId = parseInt(billId.bill_id) + 1
                }

                this.cart.forEach((f,index) => {
                    this.sendBillDetails(billId,f.food_id ,this.itemQuantity[index],f.option_id );
                });

                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var hour = ("0" + (now.getHours())).slice(-2);
                var min = ("0" + (now.getMinutes())).slice(-2);
                var currentTime = now.getFullYear() + "-" + month + "-" + day + "T" + hour + ":" + min;

                let billStatus = {
                    bill_id: parseInt(billId),
                    user_id: parseInt(this.user.user_id),
                    bill_phone: this.checkoutObj.phone,
                    bill_address: this.checkoutObj.address,
                    bill_when: currentTime,
                    bill_method: this.checkoutObj.paymentMethod,
                    bill_discount: parseInt(this.calculateSummaryPrice()[1]),
                    bill_delivery: parseInt(this.calculateSummaryPrice()[2]),
                    bill_total: parseInt(this.calculateSummaryPrice()[3]),
                    bill_paid: this.isPaid(),
                    bill_status: 1
                }

                axios.post("/billstatus", billStatus);
                axios.delete("/cartItem/" + this.user.user_id);

                this.cart = [];
                this.itemQuantity = [];

                this.$router.push("/thank");

            }
        }
    }
};
</script>

<script setup>
// enables v-focus in templates
const vUpcase = {
    mounted(el) {
        el.style.textTransform = "uppercase";
    }
}
</script>

<style scoped>
.checkout-container {
    padding: 2rem 9%;
    padding-top: 10rem 9%;
}

.checkout-container .checkout-form-container {
    background: #fff;
    height: 1000px;
}

.checkout-container .checkout-form-container form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -30%);
    max-width: 70rem;
    width: 100%;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.05);
    border: 0.1rem solid rgba(0, 0, 0, 0.2);
    padding: 2rem;
    border-radius: 0.5rem;
    animation: fadeUp 0.4s linear;
}

.checkout-container .checkout-form-container form h3 {
    padding-bottom: 1rem;
    font-size: 2rem;
    text-transform: uppercase;
    color: #130f40;
    margin: 0;
}

.checkout-container .checkout-form-container form .form-control {
    margin: 0.7rem 0;
    border-radius: 0.5rem;
    background: #f7f7f7;
    padding: 2rem 1.2rem;
    font-size: 1.6rem;
    color: #130f40;
    text-transform: none;
    width: 100%;
    border: none;
}

.checkout-container .checkout-form-container form label {
    font-size: 2rem;
    margin: 0;
    padding: 0;
}

.checkout-container .checkout-form-container form span {
    font-size: 18px;
    padding-left: 5px;
    padding-right: 40px;
}

.checkout-container .checkout-form-container form .btn {
    margin: 1rem 0;
    width: 100%;
    text-align: center;
}

.checkout-container .checkout-form-container form p {
    padding-top: 1rem;
    font-size: 1.5rem;
    color: #666;
    margin: 0;
}

.checkout-container .checkout-form-container form p a {
    color: #27ae60;
}

.checkout-container .checkout-form-container form p a:hover {
    color: #130f40;
    text-decoration: underline;
}

.checkout-container .checkout-form-container form .form-group {
    margin: 0;
}

.checkout-container .checkout-form-container form .form-group.details-group {
    margin-top: 40px;
}

.checkout-container .checkout-form-container form .form-group .error-mess {
    font-size: 1.5rem;
    position: relative;
    color: rgb(243, 47, 47);
    margin: 0;
    padding: 0;
}

.checkout-container .checkout-form-container form .checkout-heading h3 {
    display: flex;
    justify-content: space-between;
}

.checkout-container .checkout-form-container form .checkout-heading h3 span {
    padding-right: 0px;
    color: #f38609;
}

.checkout-container .checkout-form-container form .checkout-heading h3:first-of-type span {
    padding-right: 0px;
    color: #130f40;
}
.qr {
    display: space-between;
    margin-left: auto;
    margin-right: auto;
    width: 280px;
    padding-bottom: 20px;
    padding-top: 20px;
}
</style>
