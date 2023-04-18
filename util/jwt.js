const {promisify}=require('util');
const jwt=require("jsonwebtoken");
const jwtSecret='linweibo';
exports.sign=promisify(jwt.sign);
exports.verify=promisify(jwt.verify);
exports.decode=promisify(jwt.decode);
// sign({加密文本},秘钥，[expire过期时间])
// const res=jwt.sign({
//     foo:"bar",
// },'linweibo')
// jwt.sign({
//     foo:"bar"
// },'linweibo',(err,token)=>{
//     if(err){
//         return console.log('create token err');
//     }
//     console.log('create token success'+token);
    
// })
// //验证 jwt  vertify('token','秘钥',callback)
// jwt.verify('','',(err,res)=>{
//     if(err){
//         return console.log('Token 认证失败');
//     }
//     console.log(res);   
// })