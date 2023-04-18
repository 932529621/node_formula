const express = require('express');
const userValidate = require('../controller/user');
const Userauth =require('../util/Userauth');
const { validationResult } = require('express-validator');
const router = express.Router();
//邮件包
const nodemailer = require('nodemailer');
const db = require('../config/db');


//---------------------注册数据验证----------------------------------//

// 发送邮箱验证码
router.get('/getcode', userValidate.registeremail, (req, res) => {
    var code = Math.floor(Math.random() * 900000) + 100000;
    console.log(code);
    
    const now_time = new Date().getTime();
    console.log(now_time);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            title: 'This error From Register Validate',
        })
    }
    //建立smtp连接
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        secureConnerction: true,
        port: 465,
        auth: {
            user: '932529621@qq.com',
            pass: 'rbukfubsxhwnbbag',
        }
    })
    //配置相关参数
    let options = {
        from: '932529621@qq.com',
        to: req.query.email,
        subject: 'Welcome To Formula Family',//标题
        html: `<div style='width:100px,height:100px'><h2>【Formula】您正在使用邮箱认证,验证码是: ${code},请尽快完成验证 </h2></div>`,
    }


    //发送
    transporter.sendMail(options, function (err, msg) {
        // if (err) {
        //     return res.json({
        //         msg: ' Error from emailCode Transporter !',
        //         err
        //     })
        // } else {
            console.log('select');
            
            db.query(`select * from usercode where user_email= '${req.query.email}'`, (err, data) => {
                // const sql = 'INSERT INTO usercode SET ?' //sql不是 insert into tablename values(value,value)
                // const post = { user_email: req.query.email, email_code: code }
                //const sql='update usercode set email_code=? where user_email=?)'

                if (err) {
                    return  res.json({
                        msg: ' Error from query !'
                    })
                }
                if (data.length > 0) {
                    db.query(`UPDATE usercode SET email_code=${code},time_code=${now_time} WHERE user_email='${req.query.email}'`, (err, data) => { //字符串记得加 ''  ！！！！
                        console.log(req.query.email, '111111111111111111');
                        console.log(code);
                        if (err) {
                            res.json({
                                msg: ' Error from query !'
                            })
                        }
                        // console.log(update);
                        res.send('end')
                    })
                } else {
                    console.log('insert');
                    
                    const sql = 'INSERT INTO usercode SET ?'
                    const post = { user_email: req.query.email, email_code: code, time_code: now_time }
                    db.query(sql, post, (err, data) => {
                        if (err) {
                            return res.json({
                                msg: ' Error from query !'
                            })
                        }
                        res.send('end')
                    })
                }

            })
        // }
        transporter.close();
    })
})
//对比验证码=====》》并存入数据库
router.post('/emailcode', userValidate.emailCode)
//验证邮箱是否注册接口
router.post('/register/emailValidate', userValidate.emailValidate)
//验证密码
router.post('/registerpassword', userValidate.registerpassword, (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            title: 'This error From Register Validate',
        })
    }
    res.json({ msg: 'Password is Correct' })
})
//验证用户名
router.post('/registername', userValidate.registername, (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            title: 'This error From Register Validate',
        })
    }
    res.json({ msg: 'Name is Correct' })
})
router.get('/usercoding', (req, res) => {
    let code = Math.floor(Math.random() * 900000) + 100000
    const now_time = new Date().getTime();
    console.log(now_time);
    db.query(`select * from usercode where user_email= '${req.query.email}'`, (err, data) => {
        // const sql = 'INSERT INTO usercode SET ?' //sql不是 insert into tablename values(value,value)
        // const post = { user_email: req.query.email, email_code: code }const sql='update usercode set email_code=? where user_email=?)'
        if (err) {
            return  res.json({
                msg: ' Error from query !'
            })
        }
        console.log(data.length, data, req.query.email);
        if (data.length > 0) {
            db.query(`UPDATE usercode SET email_code=${code},time_code=${now_time} WHERE user_email='${req.query.email}'`, (err, data) => { //字符串记得加 ''  ！！！！
                console.log(req.query.email, '111111111111111111');
                console.log(code);
                if (err) {
                    return res.json({
                        msg: ' Error from query !'
                    })
                }
                console.log(data);
                res.send('Update usercode success')
            })
        } else {
            const sql = 'INSERT INTO usercode SET ?'
            const post = { user_email: req.query.email, email_code: code, time_code: now_time }
            db.query(sql, post, (err, data) => {
                if (err) {
                   return res.json({
                        msg: ' Error from query !'
                    })
                }
                res.send('Insert usercode success')
            })
        }

    })
})
//---------------------登录数据验证----------------------------------//
router.post('/login', userValidate.login)

//user
router.get('/getUserinfo',Userauth,userValidate.getUserInfo) 

router.get('/getUserFavourite',Userauth,userValidate.getUserFavourite) 

router.delete('/Deletefavourite',Userauth,userValidate.Deletefavourite)

router.post('/addfavourite',Userauth,userValidate.addfavourite)

router.post('/changeUserpwd',Userauth,userValidate.changeUserpwd)

router.post('/changeUserInfo',Userauth,userValidate.changeUserInfo)
router.post('/VertifyIDCard',Userauth,userValidate.VertifyIDCard)

router.get('/getEmailinfo',Userauth,userValidate.getEmailinfo) 
router.post('/addEmailinfo',Userauth,userValidate.addEmailinfo) 
router.delete('/DeleteEmailinfo',Userauth,userValidate.DeleteEmailinfo) 

router.get('/getUserTicketInfo',Userauth,userValidate.getUserTicketInfo) 

router.post('/Driverapply',Userauth,userValidate.Driverapply) 
router.post('/Teamapply',Userauth,userValidate.Teamapply) 




module.exports = router;