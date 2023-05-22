const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcryptjs')

const bcryptSalt = bcrypt.genSaltSync(10);
require('dotenv').config()

app.use(cors({
    credentials:true,
    origin: 'http://127.0.0.1:5173',
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)

app.get('/test', (req,res)=>{
    res.json('test ok')
});

app.post('/register', async (req,res)=>{
    const{name,email,password} = req.body;

    try{
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt)
        });
        res.json(userDoc);
    } catch(e){
        res.status(422).json(e)
    }
    

})

app.post('/login', async (req,res)=>{
    const{email,password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passOK = bcrypt.compareSync(password,userDoc.password);
        if(passOK){
            
            res.json('pass ok')
        }else{
            res.status(422).json('pass not ok')
        }
        
    }else{
        res.json('not found')
        
    }
})

app.listen(4000)