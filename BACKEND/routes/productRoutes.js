const express = require('express');
const routes = express.Router();
const Product = require('../models/productModel')
const Catogery = require('../models/catogeryModel')
const auth = require('../middleware/verfiyUser')
const upload = require('../upload/upload')
const Comment = require('../models/commentModel');
const Replycomment = require('../models/replyModel');
const Like = require('../models/likeModel');
const Orderuser = require('../models/orderModel');


// product post api
routes.post('/product/post', auth.verifyUser,upload.single('image'), async (req, res) => {
    try {
        const date = new Date().toDateString()
        const _post = await new Product({
            title: req.body.title,
            description: req.body.description,
            image: req.file.path,
            user: req.userInfo._id,
            price:req.body.price,
            date: date,
            catogery: req.body.catogery
        })
        _post.save()
        console.log(_post);
        res.status(201).json(_post);
    } catch (e) {

        res.json({ message: "Something went wrong" })
    }
})

// upload photo
routes.put('/upload/product/photo/:id', upload.single('image'), auth.verifyUser, async (req, res) => {
    try {
        const id = req.params.id
        const _uploadImage = await Product.findOneAndUpdate({ _id: id }, {
            image: req.file.path
        })
        res.status(200).json({ 'success': "true" })
    } catch (error) {
        console.log(error);
    }
})

// product update api
routes.put('/product/update/:id',upload.single('image'), auth.verifyUser, async (req, res) => {

    const productid = req.params.id
    console.log(productid);
    const date = new Date().toDateString()
    const update = await Product.findOneAndUpdate({ _id: productid }, {
        title: req.body.title,
        description: req.body.description,
        image: req?.file?.path,
        user: req.userInfo._id,
        price:req.body.price,
        date: date,
        catogery: req.body.catogery
    },
    {new:true}
    ).then(data=>{
        res.json(data)
        console.log(data);
    }).catch(e=>{
        res.json(e)
        console.log(e);
    })
})
// // product update api
// routes.put('/product/update/:id',upload.single('image'), auth.verifyUser, async (req, res) => {

//     const productid = req.params.id
//     console.log(productid);
//     const date = new Date().toDateString()
//     const update = await Product.findOneAndUpdate({ _id: productid }, {
//         title: req.body.title,
//         description: req.body.description,
//         image: req.file.path,
//         user: req.userInfo._id,
//         date: date,
//         catogery: req.body.catogery
//     }, function (err, docs) {
//         if (!err) {
//             console.log(docs);
//             res.json(docs)
//         } else
//             console.log("error");
//     }
//     )
// })

// product delete api
routes.delete('/product/delete/:productid', (req, res) => {
    try {
        const productid = req.params.productid
        console.log(productid);
        Product.findByIdAndDelete(productid, function (err, docs) {
            if (!err) {
                console.log(docs);
                if (docs) {
                    res.status(201).json({ message: "product deleted" })
                }
            } else {
                console.log(err)
            }
        });
        // if(deleteProduct){

        // }
    } catch (error) {
        console.log("some thing went wrong");
        res.json({ message: 'SOMETHING WENT WRONG' })
    }
})

// product comment post api
routes.post('/product/comment', auth.verifyUser, async (req, res) => {
    try {
        const id = req.body.product
        console.log(id);
        const date = new Date().toString()
        const comment = await new Comment({
            user: req.userInfo._id,
            comment: req.body.comment,
            product: id,
            date: date
        })
        comment.save()
        res.json({ success: 'success' })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})
// product replycomment post api
routes.post('/product/replycomment', auth.verifyUser, async (req, res) => {
    try {
        const id = req.body.commentid
        const comment = await new Replycomment({
            username: req.userInfo._id,
            text: req.body.replycomment,
            comment: id
        })
        comment.save()
        res.json(comment)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})
//  delete comment
routes.delete('/delete/comment/:commentid', auth.verifyUser, (req, res) => {

    try {
        const commentid = req.params.commentid
        Comment.deleteOne({ _id: commentid, user: req.userInfo._id }, function (err, docs) {
            if (!err) {
                console.log(docs);
                if (docs) {
                    res.status(201).json({ message: "Comment deleted" })
                }
            } else {
                console.log(err)
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// show comment 
routes.get('/show/comment/:product', (req, res) => {
    Comment.find({ product: req.params.product }).populate('user').then(result => {
        console.log(result);
        res.json(result)
    }).catch(e => {
        console.log(e);
    })
})

// product like api 
routes.post('/product/like', auth.verifyUser, async (req, res) => {
    try {
        const productid = req.body.productid
        const like = await new Like({
            user: req.userInfo._id,
            product: productid
        })
        like.save()
        console.log(productid);
        res.json({ success: 'success' })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})
// product unlike api 
routes.delete('/product/unlike/:likeid', auth.verifyUser, async (req, res) => {
    try {
        const likeid = req.params.likeid
        const unlike = await Like.findOneAndDelete({ _id: likeid, user: req.userInfo._id }).then((unlike) => {
            res.status(201).json({"success":"deleted"})
        }).catch((e) => {
            res.json({success: 'error', e })
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})
//  like get api 
routes.get('/product/like/count/:likeid', async (req, res) => {
    try {
        const productid = req.params.likeid
        const get = await Like.find({ product:productid }).then((d) => {
            res.json(d)
        }).catch((e) => {
            res.json({success: 'error', e })
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})
//  like filter user api 
routes.get('/product/like/filter/:productid', auth.verifyUser, async (req, res) => {
    try {
        const productid = req.params.productid
        const get = await Like.findOne({ product:productid , user: req.userInfo._id }).then((d) => {
            res.json(d)
        }).catch((e) => {
            res.json({success: 'error', e })
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

//  get product by id  
routes.get('/product/:productid', (req, res) => {
    const productid = req.params.productid
    Product.findOne({ _id: productid }).populate('user').then(result => {
        // console.log(result);
        res.json(result)
    })
})
// all product get api 
routes.get('/get/allproduct', async (req, res) => {
    try {
        const allProduct = await Product.find().populate('user');
        res.status(200).json(allProduct)
    } catch (error) {
        res.json(error)
    }
})

// get product belong to user
routes.get('/myproduct/:userId', (req, res) => {
    const userid = req.params.userId
    Product.find({ user: userid }).populate('user').then(result => {
        res.json(result)
    }).catch(e=>{
        res.json(e)
    })
})

// product serach api 
routes.get('/search/:name', async (req, res) => {
    try {
        const regex = new RegExp(req.params.name, "i");
        const getbyName = await Product.find({ title: regex });
        res.json(getbyName)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

// filter orders

routes.get('/filter/orders/:userId', auth.verifyUser, (req, res) => {
    const orders = req.userInfo._id
    const ordering = req.params.userId
    Orderuser.findOne({ orders: orders, ordering: ordering }).then(function (result) {
        res.json(result)
    })
})

// product catogery
routes.get('/findby/catogery', auth.verifyUser, (req, res) => {
    Product.find({ catogery: req.body.catogery}).then(function (result) {
        res.json(result)
    }).catch(e=>{
        res.json(e)
    })
})


module.exports = routes;