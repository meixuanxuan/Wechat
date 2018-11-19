/**
 * Created by 梅轩 on 2018/11/16.
 */
const express = require('express');


const handleRequest = require('./reply/handleRequest');


const app = express();


app.use(handleRequest());



app.listen(3000,err =>{
  if(!err) console.log('服务器连接成功了');
  else console.log(err);
})