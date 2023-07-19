require('dotenv').config()
const mongoose=require('mongoose')
mongoose.connect(process.env.MONGO_URL
    ).then(()=>{
    console.log('db connect success')
}).catch((err)=>{
    console.log(err)
})
