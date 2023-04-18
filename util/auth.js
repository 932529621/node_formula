const {verify} =require('../util/jwt') 
const db = require('../config/db');
const {jwtSecret} =require('../config/jwtSecret')
module.exports =async (req,res,next)=>{
    let token=req.headers['authorization'];
    token = token ? token.split('Bearer ')[1] : null
    if(!token){
        return res.json({
            message:"You don't have permission",
        })
    }
    try {
        const result =await verify(token,jwtSecret);
        db.query(`select * from sys_user,sys_role where sys_user.role_name = sys_role.role_name and sys_user.id='${result.userInfo.id}'`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                    err
                })
            } else {
                req.BackUserInfo=data[0];
                console.log(result);
                console.log(data);
                
                next()
            }
        })
    } catch (error) {
        return res.json({
            message:"You don't have permission R",
        })
    }

}