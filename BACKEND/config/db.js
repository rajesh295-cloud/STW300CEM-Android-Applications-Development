const mongoose =require('mongoose');
// import mongoose from 'mongoose';
mongoose.connect('mongodb://0.0.0.0:27017/RecaanShop',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Successfully connected to mongoDB");
}).catch()