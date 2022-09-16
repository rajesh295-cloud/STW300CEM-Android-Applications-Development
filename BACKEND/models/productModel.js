const mongoose = require('mongoose');
const Schema = mongoose.Schema


// const Product = mongoose.model("Product",{
const Product = mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    user:{
        type:Schema.Types.ObjectId , ref:"User"
    },
    catagory:{
        type:String
    },
    price: {
        type: Number,
        default: 0,
      },
    date:{
        type:String
    }
})

module.exports = mongoose.model("Product",Product)

