const db = require('../../config/db');
const { nanoid } = require("nanoid");

exports.getreviewinfo = (req, res) => {
    console.log(req.query);

    if (req.query.user_email) {
        db.query(`select * from driver_apply,user where driver_apply.user_id=user.user_id and user.user_email='${req.query.user_email}'  ORDER BY driver_apply.create_time `, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            }
            res.json({
                reviewinfo: data[0],
            })
        })
    } else {
        console.log(req.BackUserInfo);
        if (req.BackUserInfo.role_name == '管理员') {
            db.query(`select * from driver_apply,user where driver_apply.user_id=user.user_id and type='enroll'  ORDER BY driver_apply.create_time `, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                    })
                }
                var reviewinfo = [];
                data.forEach((value, index, array) => {
                    reviewinfo.push(data[index])
                })
                res.json({
                    reviewinfo
                })
            })
        } else if (req.BackUserInfo.role_name == '车队') {
            db.query(`select * from driver_apply where full_teamname='${req.BackUserInfo.team}'  `, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                        err
                    })
                }
                var reviewinfo = [];
                data.forEach((value, index, array) => {
                    reviewinfo.push(data[index])
                })
                res.json({
                    reviewinfo,
                })
            })
        } else if (req.BackUserInfo.role_name == '车手') {
            db.query(`SELECT * FROM driver_apply WHERE email ='${req.BackUserInfo.email}' OR username='${req.BackUserInfo.email}'  `, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                        err
                    })
                }
                var reviewinfo = [];
                data.forEach((value, index, array) => {
                    reviewinfo.push(data[index])
                })
                res.json({
                    reviewinfo,
                })
            })


        }

    }

}
exports.getDriverReviewByID = (req, res) => {
    db.query(`select * from driver_apply where user_id='${req.query.user_id}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }
        res.json({
            driverReview: data
        })
    })

}
exports.getDriverReviewByemail = (req, res) => {
    db.query(`select * from driver_apply where email='${req.query.email}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }
        res.json({
            driverReview: data
        })
    })

}

exports.DriverEnterapply = (req, res) => {
    const ids = nanoid(11);
    req.body.id = ids;
    console.log(req.BackUserInfo.email);

    db.query(`select * from driver_apply where email='${req.BackUserInfo.email}' and type='enterTeam' and full_teamname='${req.body.full_teamname}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            if (data.length > 0) {
                return res.json({
                    Operation: 'repeat',
                    msg: '请勿重复申请！',
                })
            } else {
                db.query(`select * from driver_detail where email='${req.BackUserInfo.email}'`, (err, data) => {
                    if (err) {
                        return res.json({
                            msg: ' Error from query !',
                        })
                    } else {
                        var driverinfo = data[0];
                        console.log(driverinfo);
                        req.body.email = req.BackUserInfo.email
                        req.body.username = driverinfo.name;
                        req.body.user_id = driverinfo.id;
                        db.query('INSERT INTO driver_apply SET ?', req.body, (err, data) => {
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

        }
    })



}
exports.InviteDriverapply = (req, res) => {
    const ids = nanoid(11);
    req.body.id = ids;
    console.log(req.BackUserInfo.email);
    //email user_id 是被邀请人信息！
    db.query(`select * from driver_apply where email='${req.BackUserInfo.email}' and username='${req.body.username}' and type='inviteDriver' and full_teamname='${req.body.full_teamname}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            if (data.length > 0) {
                return res.json({
                    Operation: 'repeat',
                    msg: '请勿重复申请！',
                })
            } else {
                db.query(`select * from driver_detail where email='${req.BackUserInfo.email}'`, (err, data) => {
                    if (err) {
                        return res.json({
                            msg: ' Error from query !',
                        })
                    } else {
                        var driverinfo = data[0];
                        console.log(driverinfo);
                        req.body.email = req.BackUserInfo.email
                        // req.body.username = req.body.username;
                        // req.body.user_id = driverinfo.id;
                        db.query('INSERT INTO driver_apply SET ?', req.body, (err, data) => {
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

        }
    })



}
exports.DriverExitapply = (req, res) => {
    const ids = nanoid(11);
    req.body.id = ids;
    db.query(`select * from driver_apply where email='${req.BackUserInfo.email}' and type='exitTeam'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            if (data.length > 0) {
                return res.json({
                    Operation: 'repeat',
                    msg: '请勿重复申请！',
                })
            } else {
                db.query(`select * from driver_detail where email='${req.BackUserInfo.email}'`, (err, data) => {
                    if (err) {
                        return res.json({
                            msg: ' Error from query !',
                        })
                    } else {
                        var driverinfo = data[0];
                        req.body.email = driverinfo.email;
                        req.body.username = driverinfo.name;
                        req.body.user_id = driverinfo.id;
                        req.body.full_teamname = req.BackUserInfo.team;
                        db.query('INSERT INTO driver_apply SET ?', req.body, (err, data) => {
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
                })
            }

        }
    })



}
exports.deletedriverDetailTeam = (req, res) => {
    db.query(`UPDATE driver_detail  SET team=null WHERE email='${req.body.email}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
                err
            })
        } else {
            res.json({
                Operation: 'success'
            })
        }
    })
}
exports.passedriverDetailTeam = (req, res) => {
    db.query(`UPDATE driver_detail  SET team='${req.body.team}' WHERE email='${req.body.email}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
                err
            })
        } else {
            res.json({
                Operation: 'success'
            })
        }
    })
}
exports.UpdateReviewInfo = (req, res) => {
    console.log(req.body);
    const LicenseName = req.body.LicenseName;
    const LicenseID = req.body.LicenseID;
    if (req.body.state == 'fail') {
        db.query(`UPDATE driver_apply as d,user as u SET  d.state='${req.body.state}',d.LicenseName='${LicenseName}',d.LicenseID='${LicenseID}',
        u.LicenseID=NULL,u.LicenseName=NULL,u.VertifyID='${req.body.VertifyID}' ,u.VertifyName='${req.body.VertifyName}'  
        WHERE d.user_id=u.user_id AND d.user_id="${req.body.user_id}"`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                    err
                })
            } else {
                
                res.json({
                    Operation: 'success'
                })
            }
        })
    } else {
        db.query(`UPDATE driver_apply as d,user as u SET  d.state='${req.body.state}',d.LicenseName='${LicenseName}',d.LicenseID='${LicenseID}',
            u.LicenseID='${LicenseID}',u.LicenseName='${LicenseName}',u.VertifyID='${req.body.VertifyID}' ,u.VertifyName='${req.body.VertifyName}'  
            WHERE d.user_id=u.user_id AND d.user_id='${req.body.user_id}'`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                    err
                })
            } else {
                res.json({
                    Operation: 'success'
                })
            }
        })

    }

}
exports.DeleteReview = (req, res) => {
    db.query(`DELETE from driver_apply WHERE id='${req.query.id}'`, (err, data) => {
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
exports.DeleteReviewAfterEnter = (req, res) => {
    db.query(`DELETE from driver_apply WHERE email='${req.query.email}' and full_teamname!='${req.query.team}' and type='${req.query.type}'`, (err, data) => {
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
exports.DeleteDriverAcceptEnter = (req, res) => {
    db.query(`DELETE from driver_apply WHERE username='${req.query.email}' and full_teamname!='${req.query.team}' and type='${req.query.type}'`, (err, data) => {
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
exports.TeamExitreview = (req, res) => {
    console.log(req.body);
    db.query(`UPDATE driver_apply  SET state='${req.body.state}' WHERE id='${req.body.id}'`, (err, data) => {
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

exports.getTeamreview = (req, res) => {
    db.query(`select * from team_apply,user where team_apply.user_id=user.user_id ORDER BY team_apply.create_time`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }
        var teamreviewinfo = [];
        data.forEach((value, index, array) => {
            teamreviewinfo.push(data[index])
        })
        res.json({
            teamreviewinfo
        })
    })

}
exports.getTeamreviewByIdInfo = (req, res) => {
    console.log(req.userInfo.user_id);

    db.query(`select * from team_apply where user_id='${req.userInfo.user_id}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }
        res.json({
            TeamreviewByIdInfo: data
        })
    })

}
exports.UpdateTeamReview = (req, res) => {
    const id = req.body.id;
    delete req.body.id;
    console.log(req.body);
    console.log(id);
    db.query(`UPDATE team_apply SET ? WHERE id='${id}'`, req.body, (err, data) => {
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
exports.DeleteTeamReview = (req, res) => {
    db.query(`DELETE from team_apply WHERE id='${req.query.id}'`, (err, data) => {
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
exports.addOfflineReview = (req, res) => {
    req.body.id = nanoid(11);
    db.query(`INsert offline_review SET ? `, req.body, (err, data) => {
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
exports.UploadDriverDetail = (req, res) => {
    req.body.id = nanoid(11);
    req.body.user_id = req.BackUserInfo.id;
    req.body.full_teamname = req.BackUserInfo.team;
    req.body.type = 'uploadDriver';
    console.log(req.body);

    db.query(`INSERT team_apply SET ? `, req.body, (err, data) => {
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
exports.UploadDriverDetails = (req, res) => {
    console.log(req.body);
    db.query(`UPDATE driver_detail SET driver_pic='${req.body.avatarUrl}',driver_pic='${req.body.halfpicUrl}',driver_half_pic='${req.body.avatarUrl}',driver_number='${req.body.driver_number}',driver_number_icon='${req.body.NumberIconUrl}',driver_helmet='${req.body.helmetUrl}' where email='${req.body.driver_email}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            db.query(`UPDATE sys_user SET avatar='${req.body.avatarUrl}' where email='${req.body.driver_email}' `, (err, data) => {
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

