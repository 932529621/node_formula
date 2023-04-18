const { body, query } = require('express-validator');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('../util/jwt');
const { nanoid } = require("nanoid");

//---------------------注册数据验证----------------------------------//
exports.registername = [
    // 1.配置验证规则  .bail发现错误后不执行后续
    // body('user.username')==req.body.user.username  withmessage 自定义错误消息   custom 自定义处理函数
    body('name').notEmpty().withMessage('Name is required'),

],
    exports.registerpassword = [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please Input Correct Email'),
        body('password').notEmpty().withMessage('Password is required'),
        body('Confirmpassword').notEmpty().withMessage('Password is required').custom(async (Confirmpassword, { req }) => {
            if (Confirmpassword !== req.body.password) {
                return Promise.reject('The PassWord is Different!')
            }
        })
    ],
    exports.registeremail = [
        query('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please Input Correct Email'),
    ],

    exports.emailCode = (req, res) => {
        const input_name = req.body.name;
        const input_password = req.body.password;
        const input_time = new Date().getTime();
        // const input_time = req.body.time_code;
        let input_code = req.body.emailCode;
        const input_email = req.body.email;

        db.query(`select * from usercode where user_email='${input_email}'`, (err, data) => {
            if (err) {
                res.json({
                    msg: ' Error from query !'
                })
            }
            var salt = bcrypt.genSaltSync(10);  //随机字符串
            const bcrypt_password = bcrypt.hashSync(input_password, salt);//对密码加密
            // const result=bcrypt.compareSync('login_pwd',db_pwd) 验证密码

            console.log(bcrypt_password);

            // data返回RowDataPacket对象
            const data_code = data[0].email_code;
            let data_time = Number(data[0].time_code);
            let validatetime = Math.floor(input_time - data_time) / 1000;
            console.log('inputtime:' + input_time, 'datatime:' + data_time, validatetime);
            console.log('inputcode:' + input_code, 'datacode:' + data_code, input_email, data_code === input_code);
            console.log(validatetime > 302222);
            // 获取验证码时保存时间戳与输入验证时间戳比较
            if (validatetime > 302222) {
                res.json({
                    msg: 'The Vertify Code Has Expired!',
                    vertifyStatus: 407
                })

            }
            else if (data_code === input_code && validatetime < 302222) {
                console.log('insert code');
                const ids = nanoid(11)
                db.query(`insert into user set user_id='${ids}',username='${input_name}',userpassword='${bcrypt_password}',user_email='${input_email}'`, (err, data) => {
                    if (err) {
                        res.json({
                            msg: ' Error from query !',
                            err
                        })
                    } else {
                        res.json({
                            msg: 'Vertify Email Code Success!',
                            vertifyStatus: 206
                        })
                    }
                })

            } else {
                res.json({
                    msg: 'Please Input Correct Code!',
                    vertifyStatus: 406
                })
            }
        }
        )
    }
exports.emailValidate = (req, res, next) => {
    const input_email = req.body.email;
    const sql = 'select * from user where user_email=?'
    db.query(sql, input_email, (err, data) => {
        if (err) {
            res.json({
                msg: ' Error from query !'
            })
        }
        if (data.length > 0) {
            res.json({
                msg: 'The Email has been Registered',
                Registerstatus: 405,
            })
        }
        else {
            res.json({
                msg: "'The Email haven't Register",
                Registerstatus: 205,
            })
        }
    })
}
//---------------------登录数据验证----------------------------------//

exports.login = (req, res) => {
    if (!req.body.email && !req.body.password) {
        res.json({ msg: 'Email and Password is Required!', Loginstatus: 408 })
    }
    const input_email = req.body.email;
    const input_password = req.body.password
    db.query(`select * from user where user_email='${input_email}'`, async (err, data) => {
        if (err) {
            res.json({
                msg: ' Error from query !'
            })
        }
        console.log(data[0]);
        if (typeof (data[0]) === 'undefined') {
            res.json({
                msg: "Unregistered Account"
            })
            return false
        }
        const db_pwd = data[0].userpassword
        //比对输入密码与加密密码

        const pwd_result = await bcrypt.compare(`${input_password}`, db_pwd);
        console.log('pwd_res:' + pwd_result, 'db_pwd:' + db_pwd);

        if (pwd_result) {
            const jwtSecret = 'linweibo';
            const token = await jwt.sign({
                email: input_email
            }, jwtSecret, { expiresIn: '365d' })
            res.json({
                msg: 'Login Success',
                Loginstatus: 208,
                token: token
            })
        } else {
            res.json({
                msg: 'Login fail',
                Loginstatus: 408
            })
        }
        console.log(data, db_pwd);
    })
}
exports.getUserInfo = (req, res) => {
    const userInfo = req.userInfo;
    if (userInfo) {
        delete userInfo['userpassword'];
        res.json({
            userInfo,
            Operation: 'success',
        })
    } else {
        res.json({
            Operation: "fail",
        })
    }

}
exports.getUserFavourite = (req, res) => {
    if (req.query.favoType == 'news') {
        db.query(`SELECT * FROM news WHERE news_id IN (SELECT news_id FROM user_favourite WHERE user_id='${req.userInfo.user_id}' and type='news')`, async (err, data) => {
            if (err) {
                res.json({
                    msg: ' Error from query !'
                })
            } else {
                const favoArr = [];
                data.forEach((item, index) => {
                    console.log(item);

                    const favoInfo = {
                        news_introdution: '',
                        news_pic: '',
                        news_id: '',
                        type: '',
                    }
                    Object.keys(favoInfo).forEach((keys) => {
                        favoInfo[keys] = item[keys];
                    })
                    favoInfo.isfavourite = true;
                    favoInfo.user_id = req.userInfo.user_id;
                    favoInfo.type = 'news'
                    favoArr.push(favoInfo);

                })
                res.json({
                    Operation: 'success',
                    favoArr
                })
            }
        })
    } else if (req.query.favoType == 'video') {
        db.query(`SELECT * FROM video WHERE news_id IN (SELECT news_id FROM user_favourite WHERE user_id='${req.userInfo.user_id}' and type='video')`, async (err, data) => {
            if (err) {
                res.json({
                    msg: ' Error from query !'
                })
            } else {
                const favoArr = [];
                data.forEach((item, index) => {
                    const favoInfo = {
                        news_introdution: '',
                        news_pic: '',
                        news_id: '',
                        type: '',
                    }
                    Object.keys(favoInfo).forEach((keys) => {
                        favoInfo[keys] = item[keys];
                    })
                    favoInfo.isfavourite = true;
                    favoInfo.user_id = req.userInfo.user_id;
                    favoInfo.type = 'video'
                    favoArr.push(favoInfo);
                })
                res.json({
                    Operation: 'success',
                    favoArr
                })
            }
        })
    } else {
        console.log('ss');
        db.query(`SELECT * FROM news WHERE news_id IN (SELECT news_id FROM user_favourite WHERE user_id='${req.userInfo.user_id}' and type='news')`, async (err, data) => {
            if (err) {
                res.json({
                    msg: ' Error from query !'
                })
            } else {
                const NewsfavoArr = [];
                data.forEach((item, index) => {
                    const NewsfavoInfo = {
                        news_introdution: '',
                        news_pic: '',
                        news_id: '',
                        type: '',
                    }
                    Object.keys(NewsfavoInfo).forEach((keys) => {
                        NewsfavoInfo[keys] = item[keys];
                    })
                    NewsfavoInfo.isfavourite = true;
                    NewsfavoInfo.user_id = req.userInfo.user_id;
                    NewsfavoInfo.type = 'news'
                    NewsfavoArr.push(NewsfavoInfo);
                })
                db.query(`SELECT * FROM video WHERE video_id IN (SELECT news_id FROM user_favourite WHERE user_id='${req.userInfo.user_id}' and type='videos')`, async (err, data) => {
                    if (err) {
                        res.json({
                            msg: ' Error from query !'
                        })
                    } else {
                        const VideofavoArr = [];
                        data.forEach((item, index) => {
                            console.log(item);

                            const VideofavoInfo = {
                                video_title: '',
                                video_pic: '',
                                video_id: '',
                                type: '',
                            }
                            Object.keys(VideofavoInfo).forEach((keys) => {
                                VideofavoInfo[keys] = item[keys];
                            })
                            VideofavoInfo.isfavourite = true;
                            VideofavoInfo.user_id = req.userInfo.user_id;
                            VideofavoInfo.type = 'video'
                            VideofavoArr.push(VideofavoInfo);
                        })
                        res.json({
                            Operation: 'success',
                            VideofavoArr,
                            NewsfavoArr
                        })
                    }
                })
            }
        })
    }


}
exports.Deletefavourite = (req, res) => {
    db.query(`DELETE from user_favourite WHERE user_id='${req.userInfo.user_id}' and news_id='${req.query.news_id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
            })
        }

    })

}
exports.addfavourite = (req, res) => {
    const ids = nanoid(11);
    req.body.id = ids;
    req.body.user_id = req.userInfo.user_id;
    db.query('INSERT INTO user_favourite SET ?', req.body, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                id: ids,
            })
        }
    })
}
exports.changeUserpwd = (req, res) => {
    const input_password = req.body.password;
    const confirm_password = req.body.confirm;
    var salt = bcrypt.genSaltSync(10);  //随机字符串
    const bcrypt_password = bcrypt.hashSync(input_password, salt);//对密码加密
    if (input_password == confirm_password) {
        db.query(`UPDATE user SET userpassword='${bcrypt_password}' WHERE user_id='${req.userInfo.user_id}'`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success'
                })
            }
        })
    } else {
        res.json({
            Operation: 'fail',
            msg: 'password is valid !'
        })
    }

}
exports.VertifyIDCard = (req, res) => {
    db.query(`SELECT * from license WHERE LicenseID='${req.body.LicenseID}' and LicenseName='${req.body.LicenseName}' `, (err, data, fields) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }

        if (data[0] === undefined) {
            res.json({
                Operation: 'fail',
                msg: 'License info is Not Found!'
            })
        } else {
            db.query(`UPDATE user SET VertifyID='${req.body.LicenseID}',VertifyName='${req.body.LicenseName}' WHERE user_id='${req.userInfo.user_id}'`, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                    })
                } else {
                    res.json({
                        Operation: 'success'
                    })
                }
            })
        }

    })
}
exports.changeUserInfo = (req, res) => {
    db.query(`UPDATE user SET ? WHERE user_id='${req.userInfo.user_id}'`, req.body.editedItem, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success'
            })
        }
    })
}
exports.getEmailinfo = (req, res) => {
    db.query(`SELECT * from chatinfo WHERE receiver_id='${req.userInfo.user_email}' AND type='mail'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            var chatinfos = [];
            data.forEach((value, index, array) => {
                chatinfos.push(data[index])
            })
            db.query(`SELECT avatar,email FROM sys_user WHERE email IN( SELECT sender_id from chatinfo WHERE receiver_id='${req.userInfo.user_email}' AND type='mail')`, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                    })
                }
                var avatarinfo = [];
                data.forEach((value, index, array) => {
                    avatarinfo.push(data[index])
                })
                res.json({
                    Operation: 'success',
                    chatinfos,
                    avatarinfo
                })
            })
        }

    })

}
exports.addEmailinfo = (req, res) => {
    const obj = {
        id: nanoid(11),
        sender_id: req.userInfo.user_email,
        receiver_id: req.body.receiver_id,
        content: req.body.content,
        title: req.body.title,
        type: req.body.type
    }
    db.query('INSERT INTO chatinfo SET ?', obj, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                obj
            })
        }
    })
}
exports.DeleteEmailinfo = (req, res) => {
    db.query(`DELETE from chatinfo WHERE id='${req.query.id}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
            })
        }

    })

}
exports.getUserTicketInfo = (req, res) => {
    db.query(`SELECT * from ticket_sold,user,ticket_info,schedule WHERE ticket_sold.ticket_id=ticket_info.ticket_id  
    AND ticket_sold.user_email = user.user_email AND ticket_sold.user_email='${req.userInfo.user_email}' 
    AND schedule.nation_name=ticket_sold.ticket_prix`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
                err
            })
        }
        res.json({
            Operation: 'success',
            UserTicketInfo: data
        })
    })

}
exports.Driverapply = (req, res) => {
    const ids = nanoid(11);
    req.body.id = ids;
    req.body.user_id = req.userInfo.user_id;
    req.body.username = req.userInfo.username;
    const LicenseName = req.body.LicenseName;
    const LicenseID = req.body.LicenseID;
    req.body.email = req.userInfo.user_email;
    console.log(req.body);

    db.query('INSERT INTO driver_apply SET ?', req.body, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            db.query(`UPDATE user as u SET u.LicenseID='${LicenseID}',u.LicenseName='${LicenseName}' WHERE u.user_id='${req.body.user_id}'`, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                        err
                    })
                } else {
                    res.json({
                        Operation: 'success',
                        id: ids,
                    })
                }
            })
        }
    })

}

exports.Teamapply = (req, res) => {
    req.body.user_id = req.userInfo.user_id;
    req.body.username = req.userInfo.username;
    if (req.userInfo.VertifyID) {
        if (!req.body.id) {
            const ids = nanoid(11);
            req.body.id = ids;
            console.log(req.body);

            db.query('INSERT INTO team_apply SET ?', req.body, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                    })
                } else {
                    res.json({
                        Operation: 'success',
                        id: ids,
                    })
                }
            })
        } else {
            console.log(req.body);
            req.body.status = 'will check';
            db.query(`UPDATE team_apply SET ? WHERE user_id=${req.body.user_id}`, req.body, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                    })
                } else {
                    res.json({
                        Operation: 'success',
                    })
                }
            })
        }

    } else {
        res.json({
            Operation: 'fail',
        })
    }

}




