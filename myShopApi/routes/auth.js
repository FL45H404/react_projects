require('dotenv').config()
const User = require('../models/User');
const bcrypt=require('bcrypt')
const router=require('express').Router();
const jwt=require('jsonwebtoken');
const { verifyToken,verifyTokenAndAuthorization } = require('./verifyToken');

function errorMsg(err){
    console.log(err)
    return res.status(500).json(err)
}
// register api
router.post('/register',async (req,res)=>{
    const body=req.body
    const newUser=User({
        username:body.username,
        email:body.email,
        password:body.password
    });
    try{
        newUser.password=await bcrypt.hash(newUser.password,8)
        const saveUser=await newUser.save()
        res.status(201).json(saveUser)
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
    
})

router.get('/checkEmail/:email',async (req,res)=>{
console.log(req.params.email)
    try{
        const data=await User.findOne({email:req.params.email})
        console.log(data)
        if(!data) return res.status(400).json('Email Id Unique and ready to register')
        return res.status(200).json('Email Id already exist please click on Login')
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

//login api

router.post('/login',async(req,res)=>{
    try{
        const body=req.body
        const data=await User.findOne({username:body.username})
        if (!data) return res.status(400).json("wrong credentials!")
        const hashPass=await bcrypt.compare(body.password,data.password)
        if (!hashPass) return res.status(400).json("wrong credentials!")
        const {password,...others}=data._doc
        const accessToken=jwt.sign({
            id:data._id,isAdmin:data.isAdmin
        },
        process.env.JWTKEY,{expiresIn:"3d"})
        return res.status(200).json({...others,accessToken})
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})



module.exports=router