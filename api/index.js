const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.get('/test', (req,res)=>{
    res.json('test ok')
});



app.listen(4000)