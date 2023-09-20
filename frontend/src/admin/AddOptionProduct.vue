<template>
    <div id="create-product">
        <h1>-----------------------------------------------Tạo topping---------------------------------------------</h1>

        <!-- <p><router-link :to="{ name: 'all_products' }">Return to products</router-link></p> -->
        
        <form @submit="addOptionProduct" >
            
            <div class="form-group col-md-6 mx-auto">
                <label name="option">ID sản phẩm</label>
                <input type="number" class="form-control" v-model="food.food_id" id="option" required>
                <p class="error-mess" v-if="errorObj.id.length > 0">{{ errorObj.id[0]}}</p>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="food_name">Tên sản phẩm</label>
                <input type="text" class="form-control" id="food_name" v-model="food.food_name" @onChange="findFoodId" required>
                <p class="error-mess" v-if="errorObj.name.length > 0">{{ errorObj.name[0]}}</p>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="option_desc">Tên topping</label>
                <input type="text" class="form-control" v-model="option.option_description" id="option_desc" required>
                <p class="error-mess" v-if="errorObj.description.length > 0">{{ errorObj.description[0]}}</p>
            </div>
            <div class="form-group col-md-6 mx-auto">
                <label name="price_option">Giá topping</label>
                <input type="number" class="form-control" v-model="option.price_option" id="price_option" required>
                <p class="error-mess" v-if="errorObj.price.length > 0">{{ errorObj.price[0]}}</p>
            </div>
            
            
                
            <div class="form-group col-md-6 mx-auto">
                <button class="btn btn-primary">Create</button>
                <button class="btn btn-primary" @click="clearForm">Clear Form</button>
                <button class="btn btn-primary" @click="findFoodId">Find Food ID By Name</button>
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
            food:{},
            errorObj: {id:[],name:[],description:[],price:[],},
        }
    },
    created() {
       
        if (!this.admin) {
            this.$router.push("/");
        }
    },

    computed: {
        ...mapState(["admin","allFoods","optionFoods"]),

    },

    methods: {
        findFoodId : function(e){
            e.preventDefault();
            
            //clear check
            this.errorObj.name = [];

            let data = this.allFoods.filter((f) => f.food_name.includes(this.food.food_name));
            if(data[0]!=undefined) {
               this.food.food_name=data[0].food_name;
               this.food.food_id=data[0].food_id; 
               return true;
            }else {
                this.errorObj.name.push("Food name is not exist");
                return false;
            }
            
    
        },
        async addOptionProduct(e)
        {
            //handle submit
            this.checkForm();
            if (!this.checkEmptyErr()) {
                e.preventDefault();
                
            } else {
                e.preventDefault();
                let data = {
                    food_id : parseInt(this.food.food_id),
                    option_description : this.option.option_description,
                    price_option : parseInt(this.option.price_option),
                }
                await axios.post('/foods/option',data);
                this.food = {};
                this.option = {};
                alert("Option product was successfully added !!!");
                //handle option food
      
            }
                           
        },
        checkOptionExist : function(){

            let data =this.optionFoods.filter((f) => f.food_id == this.food.food_id);
            if(data[0]!=undefined) {
                if(data[0].option_description==this.option.option_description) 
                    
                    return true;
                
            }
            else return false;
        },
        clearForm : function(e){

            this.food = {};
            this.option = {};
            e.preventDefault();
           
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
            this.errorObj.id = [];
            this.errorObj.name = [];
            this.errorObj.price = [];
            this.errorObj.description = [];
        },
        checkForm: function(){
            this.resetCheckErr();
            if(typeof(this.food.food_id) != "number") {
                this.errorObj.id.push("ID must be Number");
            }
            if(!this.findFoodId){
                this.errorObj.name.push("Food name is not exist");
            }
            if(this.checkOptionExist()){
                this.errorObj.description.push("Food Option is exist");
            }
            else if(typeof(this.option.price_option) != "number"){
                this.errorObj.price.push("Price option must be number");
            }
            else return true;
            
        },

    },
}

</script>

<style scoped>
 .error-mess {
    
    color: rgb(243, 47, 47);
    
}

</style>
