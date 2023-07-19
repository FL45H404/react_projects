require('dotenv').config()
const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token
    console.log(req.headers.token)
    if(!authHeader) return res.status(401).json('You are not authenticated')
    const token=authHeader.split(' ')[1]
    jwt.verify(token,process.env.JWTKEY,(err,user)=>{
        if (err) res.status(403).json('Token is not valid')
        console.log(user)
        req.user=user;
        next();
    })

}

const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next()
        }else{
            return res.status(403).json("You dont have permission!")
        }
    })
}

const verifyTokenAndAdmin=(req,res,next)=>{
    console.log(req.user)
    verifyToken(req,res,()=>{
        if(req.user?.isAdmin){
            next()
        }else{
            return res.status(403).json("You dont have permission!")
        }
    })
}
module.exports={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}