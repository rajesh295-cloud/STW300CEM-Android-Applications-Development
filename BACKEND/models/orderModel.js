const mongoose = require('mongoose')

const Order = mongoose.Schema({
    orders:{
        type:String
    },
    ordering:{
        type:String
    }
})
module.exports = mongoose.model("order",Order)