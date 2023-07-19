const express=require('express')
const app=express();
const path=require('path')
const db=require('./db')
const PORT=8000
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send('home page')
})

app.post('/login',async (req,res)=>{
    try {
        const body = req.body;
        db.query("select email,password,role from register where email=?", body.email, (err, result) => {
            if (err) return res.send(err)
            console.log(result)
            if (result.length<0 || !result[0]) {
                res.status(400)
                return res.json({message:"Invalid Credentials"})
            }
            bcrypt.compare(body.password, result[0].password, (err, hash) => {
                if (err) return res.status(400).send(err);
                if (!hash) {
                    res.status(400)
                    return res.json({message:'Invalid Credentials'});
                }
                const token = jwt.sign(body.email, 'secretkey');
                res.status(200)
                return res.json({message:'login succes',token:token})                
            })

        })
    } catch (err) {
        return res.status(500).send(err)
    }
})


app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}/`)
    })