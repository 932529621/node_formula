const {verify} =require('../util/jwt') 
const db = require('../config/db');
const {jwtSecret} =require('../config/jwtSecret')
module.exports =async (req,res,next)=>{
    let token=req.headers['authorizations'];
    token = token ? token.split('Bearer ')[1] : null
    if(!token){
        return res.json({
            message:"You don't have permission",
        })
    }
    try {
        const result =await verify(token,jwtSecret);
        db.query(`select * from user where user_email='${result.email}'`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                console.log(data);
                req.userInfo=data[0];
                next()
            }
        })
    } catch (error) {
        return res.json({
            message:"You don't have permission R",
        })
    }

}