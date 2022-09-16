const mongoose = require('mongoose')

const Like  = mongoose.model("Like",{
    user:{
        type:mongoose.Schema.Types.ObjectId , ref:"User"
    },
    ecommerce:{
        type:mongoose.Schema.Types.ObjectId , ref:"ecommerce"
    }
})

module.exports = Like;