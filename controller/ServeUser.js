const db = require('../config/db');
const jwt = require('../util/jwt');
const { nanoid } = require("nanoid");
const { jwtSecret } = require('../config/jwtSecret');

exports.Servelogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query(`select * from sys_user where email='${email}' and password='${password}'`, async (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            data.length ? sendData(email, data, res) : res.json({ message: 'Login Fail', Operation: 'Fail', });
        }
    })

}
exports.getBackuser = (req, res) => {
    db.query('select * from sys_user', (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var users = [];
        data.forEach((value, index, array) => {
            users.push(data[index])
        })
        res.json({
            users
        })
    })

}
exports.getBackuserByDriverEmail = (req, res) => {
    console.log('sss');
    console.log(req.query.user_email);
    db.query(`select * from sys_user where email='${req.query.user_email}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        res.json({
            users: data[0]
        })
    })

}

exports.getChatInfo = (req, res) => {
    console.log(req.query);
    db.query(`select * from chatinfo where sender_id='${req.query.email}' or receiver_id='${req.query.email}'  and type='text' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        res.json({
            chatinfo: data
        })
    })

}
exports.InsertChatInfo = (req, res) => {
    console.log(req.body);
    req.body.id = nanoid(11);

    db.query('INSERT INTO chatinfo SET ?', req.body, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
                err
            })
        } else {
            res.json({
                Operation: 'success',
            })
        }
    })
}


exports.getBackUserInfo = (req, res) => {
    res.json({
        BackUserInfo: req.BackUserInfo,
        Operation: 'success'
    })
}

exports.insertProfileImg = (req, res) => {
    console.log(req.body);
    let values = [];
    let count = 0;
    // 获取对象的属性个数
    for (let key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            count++;
        }
    }

    // 根据命名规则将属性值组成数组
    for (let i = 1; i <= count / 3; i++) {
        let arr = [];
        if (req.body['profile' + i + 'Url']) {
            arr.push(req.body['profile' + i + 'Url']);
            arr.push(req.body['img' + i + 'intro']);
            arr.push(req.body['last_name']);
            values.push(arr);
        }
    }
    console.log(values);
    if (req.body.type === 'driver') {
        db.query('INSERT INTO detail_driver_pic (driver_detail_pic, pic_introdution, last_name) VALUES ?', [values], (err, data) => {
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
    } else {
        db.query('INSERT INTO detail_driver_pic (driver_detail_pic, pic_introdution, team_name) VALUES ?', [values], (err, data) => {
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
}
exports.InsertOrUpdateBackuser = (req, res) => {
    if (req.body.id) {
        db.query(`UPDATE sys_user SET email='${req.body.email}' ,password='${req.body.password}' ,avatar='${req.body.avatar}' ,role_name='${req.body.role_name}'  WHERE id='${req.body.id}'`, (err, data) => {
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
        const ids = nanoid(11);
        req.body.id = ids;
        db.query('INSERT INTO sys_user SET ?', req.body, (err, data) => {
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


}
exports.DeleteBackuser = (req, res) => {
    console.log(req.query);
    db.query(`DELETE from sys_user WHERE id='${req.query.id}'`, (err, data) => {
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
// role
exports.getallRoleName = async (req, res) => {
    db.query(`select * from sys_role`, async (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({ roleInfo: data, Operation: 'success', });
        }
    })

}
exports.InsertOrUpdateBackRole = (req, res) => {
    console.log(req.BackUserInfo.email);

    if (req.body.role_id) {
        db.query(`UPDATE sys_role SET role_name='${req.body.role_name}'  WHERE role_id='${req.body.role_id}'`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                db.query(`DELETE from sys_role_permission WHERE role_id='${req.body.role_id}'`, (err, data) => {
                    if (err) {
                        return res.json({
                            msg: ' Error from query !',
                        })
                    } else {
                        var query = 'INSERT INTO sys_role_permission (id,role_id,route_id) VALUES ?'
                        var values = [];
                        for (i = 0; i < req.body.role_permission.length; i++) {
                            values[i] = [nanoid(11), req.body.role_id, req.body.route_id[i]];
                        }
                        console.log(values);

                        db.query(query, [values], (err, data) => {
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
        })
    } else if (req.body.payment == 'success') {
        console.log('sss');

        db.query(`UPDATE sys_user SET role_name='${req.body.role_name}'  WHERE email='${req.BackUserInfo.email}'`, (err, data) => {
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
        const ids = nanoid(11);
        req.body.role_id = ids;
        db.query('INSERT INTO sys_role SET ?', { role_id: req.body.role_id, role_name: req.body.role_name }, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                var query = 'INSERT INTO sys_role_permission (id,role_id,route_id) VALUES ?'
                var values = [];
                for (i = 0; i < req.body.role_permission.length; i++) {
                    values[i] = [nanoid(11), req.body.role_id, req.body.route_id[i]];
                }
                console.log(values);

                db.query(query, [values], (err, data) => {
                    if (err) {
                        return res.json({
                            msg: ' Error from query !',
                        })
                    } else {
                        res.json({
                            Operation: 'success',
                            role_id: req.body.role_id
                        })
                    }
                })
            }
        })
    }


}
exports.addTeaminfo = async (req, res) => {
    if (req.body.team) {
        db.query(`UPDATE sys_user SET team='${req.body.team}'  WHERE email='${req.body.email}'`, (err, data) => {
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
    } else if (req.body.type == 'exitTeam') {
        db.query(`UPDATE sys_user SET team=null  WHERE email='${req.body.email}'`, (err, data) => {
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


}
exports.InsertOruploadschedule = async (req, res) => {
    console.log(req.body);

    if (req.body.id) {
        db.query(`UPDATE schedule SET ? WHERE id='${req.body.id}'`, req.body, (err, data) => {
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
        req.body.id = nanoid(11);
        db.query('INSERT INTO schedule SET ?', req.body, (err, data) => {
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
exports.Deleteschedule = (req, res) => {
    console.log(req.query);
    db.query(`DELETE from schedule WHERE id='${req.query.id}'`, (err, data) => {
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




exports.getscheduleResult = (req, res) => {
    console.log(req.query);
    db.query(`Select s.status,u.avatar,d.name,d.points as driver_points,d.licenseScore,d.podiums,d.season_points,d.season_champion,d.highest_race_finish,d.highest_grid_position,d.prix_entered,s.id,s.schedule_id,s.driver_email,s.type,s.team,t.points as team_points,t.world_champion,t.highest_race_finish as team_highest_race_finish,t.pole_position from team_detail as t,sys_user as u,schedule_driver as s , driver_detail as d  WHERE s.driver_email=u.email AND D.email=S.driver_email AND D.team =t.full_teamname AND s.schedule_id='${req.query.schedule_id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        } else {
            res.json({
                Operation: 'success',
                schedule: data
            })

        }

    })
}
exports.InsertscheduleResult = async (req, res) => {
    req.body.id = nanoid(11);
    console.log(req.body);
    let tableName = req.body.Insert;
    switch (req.body.Insert) {
        case "single_race":
            db.query(`UPDATE driver_detail SET points=${Number(req.body.driver_points) + Number(req.body.points)},licenseScore=${Number(req.body.licenseScore) + (20 / Number(req.body.position))}  where email='${req.body.driver_email}'`, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                        err
                    })
                }
            })
            db.query(`UPDATE team_detail SET points=${Number(req.body.team_points) + Number(req.body.points)} where full_teamname='${req.body.team}'`, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                        err
                    })
                }
            })
            break;
        default:
            db.query(`UPDATE driver_detail SET licenseScore=${Number(req.body.licenseScore) + (20 / Number(req.body.position))}  where email='${req.body.driver_email}'`, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                        err
                    })
                }
            })
            break;
    }
    db.query(`UPDATE schedule_driver SET status='已录入' where id='${req.body.schedule_id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
                err
            })
        }
    })
    delete req.body.Insert;
    delete req.body.driver_points;
    delete req.body.licenseScore;
    delete req.body.team_points;
    delete req.body.schedule_id;
    delete req.body.driver_email;

    db.query(`INSERT INTO ${tableName} SET ?`, req.body, (err, data) => {
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


exports.DeleteBackRole = (req, res) => {
    console.log(req.query);
    db.query(`DELETE from sys_role WHERE role_id='${req.query.role_id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        } else {
            if (data.affectedRows) {
                res.json({
                    Operation: 'success',
                })
            } else {
                res.json({
                    Operation: 'fail',
                })
            }

        }

    })
}
exports.getallpermission = (req, res) => {
    db.query(`SELECT name,sys_role_permission.role_id,sys_role_permission.route_id from sys_menu JOIN sys_role_permission ON sys_role_permission.route_id = sys_menu.id `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        } else {
            res.json({
                Operation: 'success',
                PermissionInfo: data
            })
        }

    })
}
//Serveemail
exports.getServeEmailinfo = (req, res) => {
    console.log(req.BackUserInfo);

    db.query(`SELECT * from chatinfo WHERE receiver_id='${req.BackUserInfo.email}' AND type='mail'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            var chatinfos = [];
            data.forEach((value, index, array) => {
                chatinfos.push(data[index])
            })
            db.query(`SELECT avatar,user_email,username FROM user WHERE user_email IN( SELECT sender_id from chatinfo WHERE receiver_id='${req.BackUserInfo.email}' AND type='mail')`, (err, data) => {
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
exports.addServeEmailinfo = (req, res) => {
    const obj = {
        id: nanoid(11),
        sender_id: req.BackUserInfo.email,
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
exports.DeleteServeEmailinfo = (req, res) => {
    console.log(req.query);
    db.query(`DELETE from chatinfo WHERE id='${req.query.id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            if (data.affectedRows) {
                res.json({
                    Operation: 'success',
                })
            } else {
                res.json({
                    Operation: 'fail',
                })
            }

        }

    })
}
//Order
exports.getOrderinfo = (req, res) => {
    console.log(req.BackUserInfo);
    db.query(`SELECT * from sys_order WHERE user_email='${req.BackUserInfo.email}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                orderinfos: data
            })
        }

    })

}

exports.addOrderinfo = (req, res) => {
    if (!req.body.id) {
        const obj = {
            id: nanoid(11),
            user_email: req.body.user_email,
            order_name: req.body.order_name,
            order_intro: req.body.order_intro,
            price: req.body.price,
            order_status: 'waitPay',
            type: req.body.type
        }
        db.query('INSERT INTO sys_order SET ?', obj, (err, data) => {
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
    } else {
        db.query(`UPDATE sys_order SET order_status='${req.body.order_status}'  where id='${req.body.id}'`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    msg: '支付成功'
                })
            }
        })
    }

}





exports.DeleteOrderinfo = (req, res) => {
    console.log(req.query);
    db.query(`DELETE from sys_order WHERE id='${req.query.id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            if (data.affectedRows) {
                res.json({
                    Operation: 'success',
                })
            } else {
                res.json({
                    Operation: 'fail',
                })
            }

        }

    })
}
//exam
exports.getExaminfo = (req, res) => {
    console.log(req.BackUserInfo);
    //拿单人
    db.query(`SELECT * from sys_theory_question order by type`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                Examinfo: data
            })
        }

    })

}
exports.addExaminfo = (req, res) => {
    const obj = {
        id: nanoid(11),
        question: req.body.question,
        answer: req.body.answer,
        options: req.body.options,
        type: req.body.type
    }
    db.query('INSERT INTO sys_theory_question SET ?', obj, (err, data) => {
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
exports.DeleteExaminfo = (req, res) => {
    console.log(req.query);
    db.query(`DELETE from sys_theory_question WHERE id='${req.query.id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            if (data.affectedRows) {
                res.json({
                    Operation: 'success',
                })
            } else {
                res.json({
                    Operation: 'fail',
                })
            }

        }

    })
}
exports.submitQuestion = (req, res) => {
    db.query('Select * from sys_theory_question ', (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
                err
            })
        } else {
            // const single=[{
            //     total: req.body.singQuestion.length,
            //     correct:0,
            //     failQuestion:[],
            // }];
            var mutiplefail = [];
            var singlefail = [];
            req.body.multipleQuestion.forEach((item, index) => {
                item.answer.sort();
                item.selectOptions.sort();
                item.answer.every((items, indexs) => {
                    if (items != item.selectOptions[indexs]) {
                        mutiplefail.push({ failQuestion: item })
                        return false;
                    }
                })
            })
            req.body.singQuestion.forEach((item, index) => {
                if (item.answer[0] != item.selectOption) {
                    singlefail.push({ failQuestion: item })
                    return false;
                }
            })
            console.log(mutiplefail.length);
            console.log(singlefail.length);
            var score = 100 - (mutiplefail.length * 2 + singlefail.length * 2);
            if (req.body.passAll === true) {
                score = 100;
            }
            const obj = {
                id: nanoid(11),
                email: req.BackUserInfo.email,
                theory: score
            }
            if (score >= 60) {
                db.query('INSERT INTO driver_train SET ?', obj, (err, data) => {
                    if (err) {
                        return res.json({
                            msg: ' Error from query !',
                        })
                    } else {
                        res.json({
                            Operation: 'success',
                            examinfo: {
                                mutiplefail: mutiplefail.length,
                                singlefail: singlefail.length,
                                score,
                                status: 'pass'
                            }
                        })
                    }
                })
            } else {
                res.json({
                    Operation: 'success',
                    examinfo: {
                        mutiplefail: mutiplefail.length,
                        singlefail: singlefail.length,
                        score,
                        status: 'fail'
                    }
                })
            }
        }
    })
}



exports.getsysticket = (req, res) => {
    console.log(req.BackUserInfo);
    //拿单人
    db.query(`SELECT * from sys_ticket`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                ticketinfo: data
            })
        }

    })

}
exports.insertsysticket = (req, res) => {
    if (req.body.id) {
        db.query(`UPDATE sys_ticket SET ?  where id='${req.body.id}'`, req.body, (err, data) => {
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
    } else {
        req.body.id = nanoid(11);
        db.query('INSERT INTO sys_ticket SET ?', req.body, (err, data) => {
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

}
exports.deletesysticket = (req, res) => {
    console.log(req.query);
    db.query(`DELETE from sys_ticket WHERE id='${req.query.id}'`, (err, data) => {
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

exports.UpdateSysTicket = (req, res) => {
    db.query(`UPDATE sys_ticket SET status='paid'  where id='${req.body.id}'`, (err, data) => {
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

// driver team
exports.getDriverTrain = (req, res) => {
    if (!req.query.user_email) {
        db.query('Select * from driver_train ', (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    trainfo: data
                })
            }
        })
    } else {
        //只拿craft
        db.query(`Select break,turn,power,gear,overtake,antiskid,emergency,stop from driver_train where email='${req.query.user_email}' `, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    trainfo: data[0]
                })
            }
        })
    }
}
exports.getDriverTrainByemail = (req, res) => {
    if (!req.query.user_email) {
        db.query(`Select * from driver_train where email='${req.BackUserInfo.email}' `, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    trainfo: data
                })
            }
        })
    }
}

exports.getDriverAchieve = (req, res) => {
    db.query(`Select podiums,season_points,season_prix,season_champion,highest_race_finish,highest_grid_position,prix_entered from driver_detail where email='${req.query.user_email}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                achieveinfo: data[0]
            })
        }
    })
}
exports.getdrivernews = (req, res) => {
    db.query(`SELECT * FROM news WHERE news_content LIKE "%${req.query.driverlastName}%" LIMIT 4 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                drivernewinfo: data
            })
        }
    })
}

exports.getDriverDetail = (req, res) => {
    console.log(req.query.user_email);
    if (req.query.user_email) {
        db.query(`Select * from driver_detail where email='${req.query.user_email}' `, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    DriverDetail: data[0]
                })
            }
        })
    } else {
        db.query(`Select * from driver_detail`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    DriverDetail: data,
                })
            }
        })
    }

}
exports.getdriverraceinfo = (req, res) => {
    db.query(`Select * from single_race where driver_name='${req.query.driver_name}' limit 30 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                Driverraceinfo: data
            })
        }
    })
}
exports.getdriverqulifyinfo = (req, res) => {
    db.query(`Select * from single_qualifying where driver_name='${req.query.driver_name}' limit 30 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                Driverqulifyinfo: data
            })
        }
    })
}
exports.getteamraceinfo = (req, res) => {
    db.query(`Select * from single_team where team='${req.query.team}' limit 30 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                teamrace: data
            })
        }
    })
}
exports.getteampointinfo = (req, res) => {
    db.query(`Select * from total_team where team='${req.query.team}' limit 30 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                teampoint: data
            })
        }
    })
}


exports.getTeamdetail = (req, res) => {
    console.log(req.query.user_email);

    if (!req.query.user_email) {
        db.query('Select * from team_detail  ORDER BY points desc ', (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    teaminfo: data
                })
            }
        })
    } else {
        console.log('ss');

        db.query(`Select * from team_detail where full_teamname='${req.BackUserInfo.team}' `, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                    err
                })
            } else {
                res.json({
                    Operation: 'success',
                    user:req.BackUserInfo.email,
                    teaminfo: data[0]
                })
            }
        })
    }

}
exports.getDriverByTeam = (req, res) => {
    console.log(req.BackUserInfo);
    db.query(`Select * from driver_detail,sys_user where sys_user.team='${req.BackUserInfo.team}' and driver_detail.email=sys_user.email`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                driverinfo: data
            })
        }
    })

}
exports.getScheduleDriver = (req, res) => {
    console.log(req.BackUserInfo);
    db.query(`Select * from schedule_driver where team='${req.BackUserInfo.team}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                ScheduleDriver: data
            })
        }
    })

}
exports.InsertDriverSchedule = (req, res) => {
    console.log(req.body);
    db.query(`DELETE from schedule_driver WHERE schedule_id='${req.body.schedule_id}' and team='${req.BackUserInfo.team}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            var query = 'INSERT INTO schedule_driver (id,schedule_id,team,driver_email,type) VALUES ?'
            db.query(query, [req.body.Insertform], (err, data) => {
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

    })

}

exports.getRaceRecordByTeam = (req, res) => {
    console.log(req.BackUserInfo);
    db.query(`Select * from single_race where team='${req.BackUserInfo.team}' ORDER BY season desc LIMIT 100 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            console.log(data);

            res.json({
                Operation: 'success',
                teamreocrdinfo: data
            })
        }
    })

}
exports.getRaceRecordByDriver = (req, res) => {
    console.log(req.BackUserInfo);
    db.query(`Select * from single_race where driver_name IN(Select name from driver_detail where email='${req.BackUserInfo.email}') ORDER BY season DESC `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
                Operation: 'success',
                driverReocrdinfo: data
            })
        }
    })

}
exports.UpdateDriverTrain = (req, res) => {
    db.query(`UPDATE driver_train SET ?  where id='${req.body.id}'`, req.body, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
                err
            })
        } else {
            res.json({
                Operation: 'success',
            })
        }
    })
}

exports.Deletetrain = (req, res) => {
    db.query(`DELETE from driver_train WHERE id='${req.query.id}'`, (err, data) => {
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

exports.addOrUpdateDriverdetail = (req, res) => {
    if (!req.body.id) {
        req.body.id = nanoid(11);
        console.log(req.body);

        db.query('INSERT INTO driver_detail SET ?', req.body, (err, data) => {
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
    } else {
        console.log(req.body);
        db.query(`UPDATE driver_detail SET ?  where id='${req.body.id}'`, req.body, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                    err
                })
            } else {
                res.json({
                    Operation: 'success',
                })
            }
        })
    }

}
exports.updateDriverLicensePoint = (req, res) => {
    console.log(req.body);
    db.query(`Select * from driver_detail where email='${req.body.email}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            console.log(Number(data[0].licenseScore) - Number(req.body.licenseScore));

            db.query(`UPDATE driver_detail SET licenseScore='${Number(data[0].licenseScore) - Number(req.body.licenseScore)}'  where email='${req.body.email}'`, (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                        err
                    })
                } else {
                    res.json({
                        Operation: 'success',
                    })
                }
            })
        }

    })
}
exports.addOrUpdateTeamdetail = (req, res) => {
    if (!req.body.id) {
        req.body.id = nanoid(11);
        console.log(req.body);
        db.query('INSERT INTO team_detail SET ?', req.body, (err, data) => {
            if (err) {
                return res.json({
                    e: err,
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                })
            }
        })
    } else {
        console.log('up');

        db.query(`UPDATE team_detail SET ?  where id='${req.body.id}'`, req.body, (err, data) => {
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

}

exports.DeleteScheduleDriver = (req, res) => {
    console.log(req.query);

    db.query(`DELETE from schedule_driver WHERE driver_email='${req.query.driver_email}'`, (err, data) => {
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


async function sendData(email, data, res) {
    delete data[0].password;
    const userInfo = { ...data[0] };
    const ServeToken = await jwt.sign({
        userInfo,
    }, jwtSecret, { expiresIn: '365d' });
    userInfo.ServeToken = ServeToken;
    res.status(200).json({
        userInfo,
        Operation: 'success',
    })
}