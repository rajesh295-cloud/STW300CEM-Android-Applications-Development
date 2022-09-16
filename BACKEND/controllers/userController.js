import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js';
import otp from '../models/otp.js';
import { response } from 'express';

// const Otp = require('../models/otp')
// const User = require('../models/userModel.js')

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const emailSend = asyncHandler(async (req, res) => {
    let data = await User.findOne({email:req.body.email});
    console.log(data)
    const response = {};
    if(data){
      let otpcode = Math.floor((Math.random() * 100000) + 1);
      let otpData = new otp({
        email:req.body.email,
        code:otpcode,
        expiresIn:new Date().getTime() + 300*1000
      })
      let otpresponse = await otpData.save();
      response.statusText = 'Success'
      response.message = 'Please check your email for OTP code';
    }else{
        response.statusText = 'Error'
        response.message = 'Email not found';
      }
    res.status(200).json(response);
    // throw new Error('Invalid email or password')
  })

const changePassword = asyncHandler(async (req, res) => {
  let data = await otp.find({email:req.body.email,code:req.body.otpCode});
  const response ={}
  if(data){
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if(diff < 0){
      response.statusText = 'Error'
      response.message = 'Token Expired';
    }
    else{
      let user = await User.findById({email:req.body.email})
      user.password = req.body.password;
      user.save();
      response.statusText = 'Password Changed Successfully'
      response.message = 'Success';
    }
  }else{
    response.statusText = 'Error'
    response.message = 'Invalid OTP Code';
  }res.status(200).json(responseType);
})

const mailer = (email, otp)=>{
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587, 
    secure: false,
    auth:{
      user:'rohit@gmail.com',
      pass:'mko0mko0',
    }
  });
  var mailOptions = {
    from: 'rohit@gmail.com',
    to:'rohit.sah.631@gmail.com',
    subject:'Sending Email For Password Reset',
    text: 'Thank you for using our application. Your OTP is '+otp
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  emailSend,
  changePassword,
}
