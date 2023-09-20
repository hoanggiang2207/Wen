import {createStore} from "vuex"
import axios from "axios"

const store = createStore({
  state() {
    return {
        allFoods: [],
        optionFoods: [],
        user: undefined,
        admin: undefined,
    };
  },
  mutations: {
        setFoodsData(state, payload) {
            state.allFoods = payload;
        },
        setFoodsOption(state, payload) {
            state.optionFoods = payload;
        },
        setUser(state, payload) {
            state.user = payload;
        },
        setAdmin(state, payload) {
            state.admin = payload;
        },
  },
  actions: {
        async getFoodsData(context) {
        await axios
            .get("/foods")
            .then(function (response) {
            context.commit("setFoodsData", response.data);
            })
            .catch(function (error) {
            console.log(error);
            });
         },
      
        async getFoodsOption(context) {
        await axios
            .get("/foods/options")
            .then(function (response) {
            context.commit("setFoodsOption", response.data);
            })
            .catch(function (error) {
            console.log(error);
            });
        },
  },
});

export default store;