const app=require('express');
const { verifyTokenAndAuthorization ,verifyToken, verifyTokenAndAdmin} = require('./verifyToken');
const router=app.Router()
const Cart =require('../models/Cart')


router.post('/',verifyToken,async (req,res)=>{
    const newCart=new Cart(req.body)
    try{
    const savedCart=await newCart.save();
    res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json(err)
    }
    })
    
    
    router.put('/:id',verifyTokenAndAuthorization,async (req,res)=>{
        try{
    const updateCart=await Cart.findByIdAndUpdate(req.params.id,{
        $set:req.body
    },{
        new:true
    })
    res.status(200).json(updateCart)
        }catch(err){
            res.status(500).json(err)
        }
    })
    
    
    router.delete('/:id',verifyTokenAndAuthorization,async(req,res)=>{
        try{
    
            await Cart.findByIdAndDelete(req.params.id)
            return res.status(200).json("Cart has been deleted")
    
        }catch(err){
            console.log(err)
            return res.status(500).json(err)
        }
    })
    
    
    router.get('/find/:userId',verifyTokenAndAuthorization,async(req,res)=>{
        try{
    const cart=await Cart.find({userId:req.params.userId})
    return res.status(200).json(cart)
        }catch(err){
            console.log(err)
            return res.status(500).json(err)
        }
    })
    
    // router.get('/',async(req,res)=>{
    //     const qNew=req.query.new
    //     const qCategory=req.query.category
    
    //     try{
    //         let products;
    //         if (qNew){
    //             products=await Product.find().sort({createdAt:-1}).limit(5)
    //         }else if(qCategory){
    //             products=await Product.find({
    //                 categories:{
    //                     $in:[qCategory]
    //                 }
    //             })
    //         }else{
    //             products=await Product.find()
    //         }
    // return res.status(200).json(products)
    //     }catch(err){
    //         console.log(err)
    //         return res.status(500).json(err)
    //     }
    // })
    
router.get('/',verifyTokenAndAdmin.apply,async (req,res)=>{
    try{
const carts=await Cart.find()
res.status(200).json(carts)
    }catch(err){
            return res.status(500).json(err)
    }
})

module.exports=router