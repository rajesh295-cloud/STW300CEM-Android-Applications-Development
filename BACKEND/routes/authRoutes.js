const express = require('express');
const authRoutes = express.Router();
const User = require("../models/userModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/verfiyUser');
const Product = require('../models/productModel')
const Commentmodel = require('../models/commentModel')
const upload = require('../upload/upload')
// register api
authRoutes.post('/register', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password;
    User.findOne({ email: email }).then(function (userData) {
        // check if the user already exist in database or not 
        if (userData) {
            res.json({ message: "username already exist" })
        } else {
            bcryptjs.hash(password, 10, async (e, has_password) => {
                const register = await new User({
                    username: username,
                    email: email,
                    password: has_password
                })
                register.save().then(
                    () => {
                        res.status(200).json({ message: "Register success", success: "true" })
                    }
                ).catch(
                    (e) => {
                        res.json({ message: "Register failed", success: "false" })
                    }
                )
            })
        }
    })
})

// login api 
authRoutes.post('/login', async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;
        // taking user email from database 
        const userData = await User.findOne({ email: email });
        // comparing the user register password and login password
        const passcompare = await bcryptjs.compare(password, userData.password);
        if (passcompare) {
            // generating token for the login - jsonwebtoken(jwt token)
            const jwt_token = await jwt.sign({ userId: userData._id, username: userData.username, image: userData.image, email: userData.email }, "anysecretkey");
            res.status(200).json({ message: "login success", "token": jwt_token })
            console.log(userData);
        } else {
            console.log('username or pass not match');
            res.json({ message: "username or password not match " })
        }
    } catch (e) {
        res.json({ message: "username or password not match" })
    }
});

// update user detail api
authRoutes.put('/user/update/:userid', upload.single('image'), auth.verifyUser, async (req, res) => {
    try {
        const id = req.params.userid;
        const userUpdate = await User.findByIdAndUpdate(id, {
            username: req.body.username,
            email: req.body.email,
            bio: req.body.bio,
            image: req.file.path
        },
            { new: true }
        ).then((e) => {
            console.log(e);
            res.json(e)
        }).catch((e) => {
            res.json({ message: "someting went wrong" })
        })
    } catch (e) {
        res.status(500).json("something went wrong")
    }
})
// upload profile pic api


authRoutes.put('/upload/user/photo/:userid', upload.single('image'), auth.verifyUser, (req, res) => {
    try {
        const id = req.params.userid
        const _uploadImage = User.findOneAndUpdate({ _id: id }, {
            image: req.file.path
        }).then(d => {
            console.log(d);
            res.status(200).json({ 'success': "true" })
        }).catch(e => {
            console.log(e);
            res.json(e)
        })
    } catch (error) {
        console.log(error);
    }
})
// authRoutes.put('/upload/user/photo/:userid', upload.single('image'), auth.verifyUser, async (req, res) => {
//     try {
//         const id = req.params.userid
//         const _uploadImage = await User.findOneAndUpdate({ _id: id }, {
//             image: req.file.path
//         })
//         res.status(200).json({ 'success': "true" })
//         console.log(_uploadImage);
//     } catch (error) {
//         console.log(error);
//     }
// })


// change password api
authRoutes.put('/change/password', auth.verifyUser, async (req, res) => {
    try {
        const id = req.userInfo._id;
        const password = req.body.password
        const oldpass = req.body.oldpassword
        const userPass = await User.findOne({ _id: id })
        const len = password.length
        const passcompare = await bcryptjs.compare(oldpass, userPass.password);
        if (oldpass === password) {
            res.json({ message: 'Old password and new password is too similar' })
        } else if (passcompare) {
            if (len < 6) {
                res.json({ message: 'Password must be more that 6 charector' })
            } else {
                bcryptjs.hash(password, 10, async (e, has_password) => {
                    // change the user password
                    const userData = await User.findByIdAndUpdate(id, {
                        password: has_password,
                    })
                    res.json({ message: 'Password update sucessfully', s:true })
                    // console.log("success");
                })
            }
        } else {
            res.json({ message: 'Old password not match' ,s:false })
            // console.log("err");
        }
    } catch (e) {
        res.status(500).json("something went wrong")
    }
})


authRoutes.put('/pass/change/:userid', (req, res) => {
    const password = req.body.password
    User.findOne({ _id: req.params.userid }).then((user) => {
        bcryptjs.hash(password, 10, async (e, has_password) => {
            // change the user password
            User.findByIdAndUpdate(req.params.userid, {
                password: has_password,
            },
                { new: true }).then(d => {
                    console.log(d);
                    res.json(d)
                }).catch(e=>{
                    console.log(e);
                    res.json(e)
                })
        })
    })
})

// delete user api
authRoutes.delete('/user/delete/:userId', auth.verifyUser, async (req, res) => {
    try {
        const id = req.params.userId
        try {
            await User.deleteOne({ _id: id })
            await Product.deleteMany({ user: id })
            await Commentmodel.deleteMany({ user: id })
            // console.log("user deleted")
            res.json("user deleted")
        } catch (error) {
            res.json(error)
        }
    } catch (e) {
        res.status(500).json(e)
    }
})

authRoutes.get("/profile/user", auth.verifyUser, async (req, res) => {
    try {
        const userId = req.params.userId
        const profile = await User.findOne({ _id: req.userInfo._id })
        res.json(profile)
    } catch (error) {
        res.json(error)
    }
})

module.exports = authRoutes;
