const mongoose = require('mongoose')

const catogery = mongoose.model('Catogery',{
    catogery:{
       type:[ "Electronics","Mobile","Television","Laptop","Home"]
    }
})
module.exports = catogery;