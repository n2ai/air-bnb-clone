const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const imageDownLoader = require('image-downloader')
const multer = require('multer')

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'adasdasdasdasd'
require('dotenv').config();

app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}));
app.use(express.json())
app.use('/uploads', express.static(__dirname+'/uploads'))

try{
  mongoose.connect(process.env.MONGO_URL);
  console.log('connected')

}catch(e){
  console.log(e)
  console.log('mongoDB connected')
}
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

app.post('/login', async (req,res) => {
  
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res)=>{
  const {token} = req.cookies;
  if(token){
    jwt.verify(token,jwtSecret, {}, async (err,userData)=>{
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id})
    })
  }else{
    res.json(null)
  }
})

app.post('/logout', (req,res)=>{
  res.cookie('token','').json(true)
})

app.post('/upload-by-link', async (req,res)=>{
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownLoader.image({
    url:link,
    dest:__dirname + '/uploads/' + newName
  })
  res.json(newName);
})

const photosMiddleWare = multer({dest:'uploads'});
app.post('/upload', photosMiddleWare.array('photos', 100), (req,res)=>{
  console(req.files)
  res.json(req.files);
})

app.listen(4000);