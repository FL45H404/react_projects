const app=require('express')
const Product = require('../models/Product')
const { verifyToken, verifyTokenAndAdmin } = require('./verifyToken')
const router=app.Router()



router.post('/',verifyToken,async (req,res)=>{
const newProduct=new Product(req.body)
try{
const savedProduct=await newProduct.save();
res.status(200).json(savedProduct)
}catch(err){
    res.status(500).json(err)
}
})


router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try{
const updateProduct=await Product.findByIdAndUpdate(req.params.id,{
    $set:req.body
},{
    new:true
})
res.status(200).json(updateProduct)
    }catch(err){
        res.status(500).json(err)
    }
})


router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{

        await Product.findByIdAndDelete(req.params.id)
        return res.status(200).json("Product has been deleted")

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})


router.get('/find/:id',async(req,res)=>{
    try{
const product=await Product.findById(req.params.id)
return res.status(200).json(product)
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

router.get('/',async(req,res)=>{
    const qNew=req.query.new
    const qCategory=req.query.category

    try{
        let products;
        if (qNew){
            products=await Product.find().sort({createdAt:-1}).limit(5)
        }else if(qCategory){
            products=await Product.find({
                categories:{
                    $in:[qCategory]
                }
            })
        }else{
            products=await Product.find()
        }
return res.status(200).json(products)
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

router.put('/up',async(req,res)=>{
    try{
        const color=['red','blue','orange','black']
const data=await Product.updateMany({},{color:color})
console.log(data)
res.status(200).json(data)

    }catch(err){
        res.status(500).json(err)
    }
})

module.exports=router