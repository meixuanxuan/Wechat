/**
 * Created by 梅轩 on 2018/11/16.
 */


const {parseString} = require('xml2js')
module.exports = {
  getUserDataAsync (req){
    return new Promise(resolve =>{
      //接受数据
      let result = '';
      req
        .on('data',data =>{
          console.log(data.toString());
          result += data.toString();
        })
        .on('end',()=>{
          console.log('用户数据接受完毕');
          resolve(result)
        })
    })
  },
  parseXMLDataAsync (xmlData){
    return new Promise((resolve,reject) =>{
      parseString(xmlData,{trim:true},(err,data)=>{
        if(!err){
          resolve(data)
        }else{
          reject('parseXMLDataAsync方法出问题了：'+err)
        }
      })
    })
  },
  formatMessage ({xml}){
    let result = {};
    //遍历数组
    for (let key in xml) {
      //获取属性值
      let value = xml[key];
      //去掉[]
      result[key] =value[0];
    }
    return result;
  }

}