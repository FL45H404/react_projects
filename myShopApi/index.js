require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors=require('cors')
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('db connect success')
}).catch((err)=>{
    console.log(err)
})
// require('db.js')
const PORT=8000
app.use(cors())
// app.use(cookieParser());
app.use(express.json());

const auth=require('./routes/auth')
const user=require('./routes/user')
const product=require('./routes/product')
const cart=require('./routes/cart')
const order=require('./routes/order')
app.use('/api/auth',auth)
app.use('/api/user',user)
app.use('/api/products',product)
app.use('/api/cart',cart)
app.use('/api/orders',order)
app.listen(process.env.PORT || PORT,()=>{
console.log(`server started http://localhost:${8000}/`)
})