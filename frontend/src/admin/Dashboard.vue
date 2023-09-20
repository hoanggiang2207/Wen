<template>
    <div class="admin-container">
        <div class="d-flex justify-content-between">
            <h1>Hello Admin!</h1>
            <button class="btn" @click="addProduct()">THÊM SẢN PHẨM</button>
            <button class="btn" @click="addOptionProduct()">THÊM OPTION SẢN PHẨM</button>
            <button class="btn" @click="handleLogout()">Đăng xuất</button>
            
        </div>

        <div class="table-responsive">
            <!-- PROJECT TABLE -->
            <table class="table colored-header datatable project-list">
                <thead>
                    <tr>
                        <th>ID đơn hàng</th>
                        <th>ID người dùng</th>
                        <th>SĐT</th>
                        <th>Địa chỉ</th>
                        <th>Thời gian</th>
                        <th>Phải trả</th>
                       
                        <th>Tên SP x Số Lượng x Options</th>
                        
                        <th>Trạng thái</th>
                        <th>Kiểm cuối</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(b) in filterBills.slice().reverse()" :key="b.bill_id">
                        <td>{{ b.bill_id }}</td>
                        <td>{{ b.user_id }}</td>
                        <td>{{ b.bill_phone }}</td>
                        <td>{{ b.bill_address }}</td>
                        <td>{{ b.bill_when }}</td>
                        <td>{{ b.bill_total }}đ</td>
                        
                        <td>{{ b.food_name}} x {{b.item_qty}} x {{handleOptionName(b.option_id)}}</td>
                       
                        <td>{{ avaiableStatus[b.bill_status] }}</td>
                        <td>
                            <button v-if="b.bill_status < 5" class="action-btn" @click="nextStatusBtn(b.bill_id)">
                                {{ avaiableStatus[b.bill_status + 1] }}
                            </button>

                            <button v-if="b.bill_status == 1" class="cancel-btn" @click="cancelBtn(b.bill_id)">
                                Huỷ
                            </button>

                            <button v-else-if="b.bill_status == 5 && b.bill_paid == 'false'" class="paid-btn"
                                @click="paidBtn(b.bill_id)">
                                Thanh toán
                            </button>

                            <button v-else-if="b.bill_status == 5 && b.bill_paid == 'true'" class="action-btn"
                                @click="nextStatusBtn(b.bill_id)">
                                {{ avaiableStatus[b.bill_status + 1] }}
                            </button>
                        </td>
                    </tr>
                   
                </tbody>
            </table>
        </div>
        
        
    </div>
</template>


<script>

import axios from "axios";
import { mapState, mapMutations } from "vuex";
export default {
    name: 'Dashboard',

    data() {
        return {
            avaiableStatus: ["Huỷ", "Xác nhận", "Đang chuẩn bị", "Kiểm tra", "Vận chuyển", "Đã giao", "Hoàn thành"],
            allBills: [],
            showOrderDetails: false,
            sendId: undefined,
            interval: "",
        }
    },

    created() {
        this.getAllBills();
        if (!this.admin) {
            this.$router.push("/");
        }
    },

    mounted: function () {
        this.autoUpdate();
    },

    beforeUnmount() {
        clearInterval(this.interval)
    },

    computed: {
        ...mapState(["allFoods", "admin","optionFoods"]),

        filterBills: function () {
            return this.allBills.filter((b) => b.bill_status < 6 && b.bill_status > 0);
        },
    },

    methods: {
        ...mapMutations(["setAdmin"]),

        
        async getAllBills() {
            this.allBills = (await axios.get('/billstatus')).data;
            console.log("all bill = ",this.allBills);
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
        sendBillId: function (id) {
            this.sendId = id
            this.showOrderDetails = !this.showOrderDetails;
        },

        closeView: function () {
            this.showOrderDetails = !this.showOrderDetails;
        },
        addProduct: function () {
            this.setAdmin("admin");
            this.$router.push("/admin/dashboard/addproduct");

        },
        addOptionProduct: function () {
            this.setAdmin("admin");
            this.$router.push("/admin/dashboard/addoptionproduct");

        },
        handleLogout: function () {
            this.setAdmin("");
        },

        async nextStatusBtn(id) {
            await axios.put('/billstatus/' + id);
            this.getAllBills();
        },

        async paidBtn(id) {
            await axios.put('/billstatus/paid/' + id);
            this.getAllBills();
        },

        async cancelBtn(id) {
            await axios.put('/billstatus/cancel/' + id);
            this.getAllBills();
        },

        autoUpdate: function () {
            this.interval = setInterval(function () {
                this.getAllBills();
            }.bind(this), 10000);
        }

    },
    
}

</script>

<style scoped>
.admin-container {
    background-color: #fff;
    height: 100vh;
    padding: 2rem 9%;
    font-size: 16px;
}

.project-list>tbody>tr>td {
    padding: 12px 8px;
}

.project-list>tbody>tr>td .avatar {
    width: 22px;
    border: 1px solid #CCC;
}

.table-responsive {
    margin-top: 8vh;
}

.action-btn,
.cancel-btn,
.paid-btn {
    width: 150px;
    height: 25px;
    color: white;
    text-transform: capitalize;
}

.action-btn {
    background-color: #0da9ef;
    margin-right: 20px;
}

.cancel-btn,
.paid-btn {
    background-color: red;
}

.action-btn:hover {
    background-color: #27ae60;
}
</style>