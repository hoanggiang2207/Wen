// import connection
import db from "../config/database.js";

// get all Foods
export const getFoods = (result) => {
    db.query("SELECT * FROM food ", (err,results)=> {
        if (err){
            console.log(err);
            result(err,null);
        }else{
            result(null,results);
        }
    });
};

// get option Foods
export const getFoodById = (result) => {
    db.query("SELECT * FROM  option_food", (err,results)=> {
        if (err){
            console.log(err);
            result(err,null);
        } else {
            result(null,results);
        }
    });
};

// insert Food
export const insertFood = (data,result) => {
    db.query("INSERT INTO food SET ?",data, (err,results)=> {
        if (err){
            console.log(err);
            result(err,null);
        } else {
            
            result(null,results[0]);
        }
    });
};

export const insertFoodOption = (data, result) => {
  db.query("INSERT INTO option_food SET ?", data, (err, results) => {
    if (err) {
      console.log(err);
      result(err, null);
    } else {
      result(null, results[0]);
    }
  });
};

// update Food
export const updateFoodById = (data,id,result) => {
    db.query("UPDATE food SET food_name = ?, food_price = ? WHERE food_id = ?",[data.food_name, data.food_price, id], (err,results)=> {
        if (err){
            console.log(err);
            result(err,null);
        }else{
            result(null,results);
        }
    });
};


// delete Food
export const deleteFoodById = (id,result) => {
    db.query("DELETE FROM food WHERE food_id = ?",[id], (err,results)=> {
        if (err){
            console.log(err);
            result(err,null);
        }else{
            result(null,results);
        }
    });
};