<template>
    <div id="create-product">
        <h1 class="mx-auto" >-----------------------------------------------Create Product-------------------------------------------</h1>

        <!-- <p><router-link :to="{ name: 'all_products' }">Return to products</router-link></p> -->
        

        <form @submit="addProduct" >
            

            <div class="form-group col-md-6 mx-auto">
                <label name="product_name">Tên sản phẩm</label>
                <input type="text" class="form-control" v-model="product.food_name" id="product_name" required>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label class="label label-info" name="product_start">số sao</label>
                <input type="number" class="form-control" v-model="product.food_star" id="product_start" required>
                <p class="error-mess" v-if="errorObj.star.length > 0">{{ errorObj.star[0]}}</p>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="product_vote">Vote</label>
                <input type="number" class="form-control" v-model="product.food_vote" id="product_vote" required>
                
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="product_price">Giá</label>
                <input type="number" class="form-control" v-model="product.food_price" id="product_price" required>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="product_discount">Giảm giá</label>
                <input type="number" class="form-control" v-model="product.food_discount" id="product_discount" required>
                <p class="error-mess" v-if="errorObj.discount.length > 0">{{ errorObj.discount[0]}}</p>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="product_desc">Mô tả</label>
                <input type="text" class="form-control" v-model="product.food_desc" id="product_desc" required>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="product_status">Trạng thái</label>
                <input type="text" class="form-control" v-model="product.food_status" id="product_status" required>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="product_category">Mục</label>
                <input type="text" class="form-control" v-model="product.food_category" id="product_category" required>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="product_type">Phân loại đồ uống/đồ ăn</label>
                <input type="text" class="form-control" v-model="product.food_type" id="product_type" required>
            </div>
            <!-- <div class="form-group col-md-6">
                <label name="option">Option</label>
                <input type="text" class="form-control" v-model="option.option_description" id="option" required>
            </div>
            <div class="form-group col-md-6">
                <label name="price_option">Price Option</label>
                <input type="text" class="form-control" v-model="option.price_option" id="price_option" required>
            </div>
            <div class="form-group col-md-6">
                <label name="product_category">Category</label>
                <input type="text" class="form-control" v-model="product.food_category" id="product_category" required>
            </div> -->
            <div class="form-group col-md-6 mx-auto">
                <label name="product_source">Nguồn ảnh</label>
                <input type="file" class="form-control" v-on:change="handleFileUpload($event)" ref="inputFile" id="product_source" required>
                <p class="error-mess" v-if="errorObj.image.length > 0">{{ errorObj.image[0]}}</p>
            </div>
            
            

            <div class="form-group col-md-6 mx-auto">
                <button class="btn btn-primary">Create</button>
                <button class="btn btn-primary" @click="clearForm">Clear Form</button>
            </div>
        </form>
    </div>
</template>




<script>


import axios from "axios";
import { mapState} from "vuex";
export default {

    
    name: 'AddProduct',
    data(){
        return{
            option:{},
            product:{},
            errorObj: {discount:[],star:[],image:[],},
            file:{name:"",extension:"",target:""},
            
        }
    },
    created() {
       
        if (!this.admin) {
            this.$router.push("/");
        }
    },

    computed: {
        ...mapState(["admin"]),

    },

    methods: {
        
        async addProduct(e)
        {
            //handle submit
            this.checkForm();
            if (!this.checkEmptyErr()) {
                e.preventDefault();
                
            } else {
                e.preventDefault();
                let food = {
                    food_name: this.product.food_name,
                    food_star : this.product.food_star,
                    food_vote: this.product.food_vote,
                    food_price: this.product.food_price,
                    food_discount: this.product.food_discount,
                    food_desc:  this.product.food_desc,
                    food_status: this.product.food_status,
                    food_type: this.product.food_type,
                    food_category: this.product.food_category,
                    food_src: this.product.food_category+'/'+this.file.name,
                }
                await axios.post('/foods', food);
                this.clearForm();
                alert("Product was successfully added")
                //handle option food
                
            }
                           
        },
        clearForm : function(){
            //reset input
             this.product = {};
             this.option = {};
        },
        checkForm: function(){
            this.resetCheckErr();
            if(this.product.food_price <= this.product.food_discount){
                this.errorObj.discount.push("Discount must be lesser than price");
            }else if (this.product.food_star>5){
                this.errorObj.star.push("Star must be lesser than 5");
            }else if(!["png"].includes(this.file.extension)){
                this.errorObj.image.push("Image must be PNG extension");
            }
            else return true;
            
        },
        checkEmptyErr: function () {
            for (var typeErr in this.errorObj) {
                if (this.errorObj[typeErr].length != 0) {
                    return false;
                }
            }
            return true;
        },
        resetCheckErr: function () {
            this.errorObj.discount = [];
            this.errorObj.star = [];
            this.errorObj.image = [];
            
        },
        handleFileUpload: function(e){
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                //file extension
                this.file.extension = file.name.split(".").pop(); 
                //file name 
                this.file.name = file.name;
                //target
                this.file.target = file;

                console.log(this.file);
                
            }
            
            
        },

    }
}

</script>

<style scoped>
 .error-mess {
    
    color: rgb(243, 47, 47);
    
}
</style>
