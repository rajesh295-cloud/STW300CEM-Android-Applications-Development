const express = require('express');
const OrderRoutes = express.Router();
const OrderModel = require('../models/orderModel')
const auth = require('../middleware/verfiyUser');

// order product api
OrderRoutes.post('/order/product', auth.verifyUser, async (req, res) => {
    try {
        const orderingid = req.body.orderingid
        const orderPost = await new OrderModel({
            orders: req.userInfo._id,
            ordering: orderingid,
        }).save()
        console.log(orderPost);
        res.status(200).json({ success: 'success' })
    } catch (error) {
        res.json('something went wrong')
    }
})

// unorder p api
OrderRoutes.delete('/unorder/product/:orderid', auth.verifyUser, async (req, res) => {
    try {
        const unorder = await OrderModel.findOneAndDelete({ _id: req.params.orderid, orders: req.userInfo._id })
        console.log(unorder);
        res.status(200).json({ message: "order success" })
    } catch (error) {
        res.json(error)
    }
})

// filter orders api
OrderRoutes.get('/filter/orders/:orderingid',auth.verifyUser,(req,res)=>{
    OrderModel.findOne({
        orders: req.userInfo._id,
        ordering: req.params.orderingid
    }).then(d=>{
        console.log(d);
        res.json(d);
    }).catch(e=>{
        console.log(e);
        res.json(e)
    })
})

// show orders only
OrderRoutes.get('/show/orders/:userId', (req, res) => {
    const userId = req.params.userId
    console.log(userId);
    OrderModel.find({ ordering: userId }).then((result) => {
        console.log(result);
        res.json(result)
    }).catch(e=>{
        res.json(e)
        console.log(e);
    })
})

// show ordering only
OrderRoutes.get('/show/orderings/:userId', (req, res) => {
    const userId = req.params.userId
    OrderModel.find({ orders: userId }).then((result) => {
        res.json(result)
    }).catch(e=>{
        res.json(e)
        console.log(e);
    })
})

module.exports = OrderRoutes;