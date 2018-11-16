/**
 * Created by 梅轩 on 2018/11/16.
 */
const express = require('express');
const sha1 = require('sha1');

const {getUserDataAsync,parseXMLDataAsync,formatMessage} =require('./utils/tools')
const app = express();

const config = {
  appID:'wxdebd3135a68eb91a',
  appsecret:'b2b3f5089ccd2819e663608368ef676a',
  token:'HTML0810'
}
app.use(async (req, res, next) => {
  console.log(req.query);
  //获取请求参数
  const {signature, echostr, timestamp, nonce} = req.query;
  const {token} = config;

  // - 将参数签名加密的三个参数（timestamp、nonce、token）组合在一起，按照字典序排序
  const str = sha1([timestamp, nonce, token].sort().join(''));

  if(req.method === 'GET'){
    //验证服务器有效性逻辑
    if (signature === str) {
      //说明消息来自于微信服务器
      res.end(echostr);
    } else {
      //说明消息不来自于微信服务器
      res.end('error');
    }
  }else if(req.method === 'POST'){
    //转发用户消息
    //接受微信服务转发用户消息
    //验证消息来自于微信服务器

    if (signature !== str) {
      //说明消息不来自于微信服务器
      res.end('error');
      return;
    }
    //用户发送的消息在请求体中
    const xmlData = await getUserDataAsync(req)
    console.log(xmlData);

  /*
   <xml><ToUserName><![CDATA[gh_e4ede8d9d7ee]]></ToUserName> //微信号
   <FromUserName><![CDATA[oLX675sL0d34Bw1HwdKB6sp_KomI]]></FromUserName> //微信用户openId
   <CreateTime>1542364263</CreateTime> //发送消息的时间戳
   <MsgType><![CDATA[text]]></MsgType> //消息类型
   <Content><![CDATA[1]]></Content> //消息的具体内容
   <MsgId>6624404068533920206</MsgId> //消息的id 微信服务器会默认保存3天
   </xml>
  */
  //将用户发送过来的xml数据解析为js对象
    const jsData = await parseXMLDataAsync (xmlData)
    console.log(jsData);
  /*
   { xml: 
   { ToUserName: [ 'gh_e4ede8d9d7ee' ],
   FromUserName: [ 'oLX675sL0d34Bw1HwdKB6sp_KomI' ],
   CreateTime: [ '1542368088' ],
   MsgType: [ 'text' ],
   Content: [ '111' ],
   MsgId: [ '6624420496783827410' ] } }
   */
  //数据格式化
    const message = formatMessage(jsData)
    console.log(message);
  /*
   { ToUserName: 'gh_e4ede8d9d7ee',
   FromUserName: 'oLX675sL0d34Bw1HwdKB6sp_KomI',
   CreateTime: '1542368648',
   MsgType: 'text',
   Content: '1111',
   MsgId: '6624422901965513172' }

   */
  //初始化一个消息文本
    let content = '你在说什么';
    //判端用户发送消息的内容，根据内容返回待定的响应
    if (message.Content ==='1'){
      content = '发送22'
    }else if(message.Content === '22'){
      content = '发送333'
    }else if (message.Content ==='333'){
      content = '哈哈哈'
    }

    //返回xml消息的微信服务器
    //微信官网提供的xml数据有问题，
    let replyMessage = `<xml>
      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
      </xml>`;
    console.log(replyMessage);
    /*
     注意：微信服务器当没有接收到开发者服务器响应时，默认会请求
     */
    res.send(replyMessage)
  }else {
    res.end('error')
  }


})



app.listen(3000,err =>{
  if(!err) console.log('服务器连接成功了');
  else console.log(err);
})