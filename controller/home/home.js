const db = require('../../config/db');
const { nanoid } = require("nanoid");
const moment = require('moment')
exports.getTopVideo = (req, res) => {
    db.query(`select * from video where video_status='Banner' limit 1`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        // console.log(data[0].video_id);  
        res.json({
            Homestatus: 208,
            ...data[0]
        })
    })

}
exports.getTopNews = (req, res) => {
    db.query(`select * from news  limit 5 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var News = [];
        data.forEach((value, index, array) => {
            News.push(data[index])
        });
        // console.log(News[0]);

        res.json({
            Homestatus: 208,
            ...News,
        })
    })
}
exports.getTopNewsVideo = (req, res) => {
    db.query(`select * from video where video_status='Top News' limit 1`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        // console.log(data[0].video_id);  
        res.json({
            Homestatus: 208,
            ...data[0]
        })
    })

}

exports.getHightlightVideo = (req, res) => {
    db.query(`select * from video where video_status='Hight Light' limit 6`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var videos = [];
        data.forEach((value, index, array) => {
            videos.push(data[index])
        })
        // console.log(videos);  
        res.json({
            Homestatus: 208,
            ...videos
        })
    })

}

exports.getVideos = (req, res) => {
    db.query('select * from video', (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }

        // console.log(videos);  
        res.json({
            Homestatus: 208,
            videos: data
        })
    })

}
exports.getVideosByid = (req, res) => {
    db.query(`select * from video where video_id='${req.query.video_id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }

        // console.log(videos);  
        res.json({
            Homestatus: 208,
            videos: data
        })
    })

}
exports.getAllcomment = (req, res) => {
    db.query(`select * from comment where article_id='${req.query.article_id}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }
        const usersinfo = [];
        const commentNode = [];
        const commentChild = [];
        data.forEach((item, index) => {
            console.log(item);
            usersinfo.push(item.author_id);
            item.parent_id ? commentChild.push(item) : commentNode.push(item);
        })
        const uniqueUser = [...new Set(usersinfo)];
        if (uniqueUser.length) {
            db.query(`select user_id,username,avatar,user_email from user where user_id in ( ? )`, [uniqueUser], (err, data) => {
                if (err) {
                    return res.json({
                        msg: ' Error from query !',
                    })
                }
                res.json({
                    Operation: 'success',
                    commentNode,
                    commentChild,
                    userinfo: data
                })
            })
        } else {
            res.json({
                Operation: 'Fail',
                msg: '什么评论都没有'
            })
        }
    })

}
exports.commentThumbDownOrUp = (req, res) => {
    db.query(`UPDATE comment SET thumb_up='${req.body.thumbupNum}',thumb_down='${req.body.thumbdownNum}'  WHERE comment_id='${req.body.comment_id}'`, (err, data) => {
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
exports.addcomment = (req, res) => {
    const ids = nanoid(11);
    req.body.comment_id = ids;
    req.body.author_id = req.userInfo.user_id;
    req.body.comment_date = moment().format('YYYY-MM-DD');
    req.body.content = getEmojiCode(req.body.content);
    function getEmojiCode(str) {
        let code = '';
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode > 0xFFFF) {
                // 如果是Emoji字符，使用UTF-16编码（4个字节）
                const highSurrogate = (charCode - 0x10000 >> 10) + 0xD800;
                const lowSurrogate = (charCode - 0x10000 & 0x3FF) + 0xDC00;
                code += String.fromCharCode(highSurrogate, lowSurrogate);
            } else {
                code += str.charAt(i);
            }
            console.log(code);
            
        }
        return code;
    }
    console.log(req.body);

    db.query('INSERT INTO comment SET ?', req.body, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
                err,
            })
        } else {
            res.json({
                Operation: 'success',
                ids
            })
        }
    })
}







exports.getcalendar = (req, res) => {
    db.query(`select * from schedule order by sortBy`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        // console.log(schedules);  
        res.json({
            schedules: data
        })
    })

}

exports.getStanding = (req, res) => {
    db.query(`select * from driver_detail order by points desc limit 10`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var standing = [];
        data.forEach((value, index, array) => {
            standing.push(data[index])
        })
        // console.log(standing);  
        res.json({
            ...standing
        })
    })

}
exports.getpartnersinfo = (req, res) => {
    db.query(`select * from partners `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var partnersinfo = [];
        data.forEach((value, index, array) => {
            partnersinfo.push(data[index])
        })
        res.json({
            ...partnersinfo
        })
    })

}
exports.getnavinfoinfo = (req, res) => {
    db.query(`select * from nav `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var partnersinfo = [];
        data.forEach((value, index, array) => {
            partnersinfo.push(data[index])
        })
        // console.log(partnersinfo);  
        res.json({
            ...partnersinfo
        })
    })

}
exports.getStandingteam = (req, res) => {
    db.query(`select * from team_detail order by points desc limit 10 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var teamsinfo = [];
        data.forEach((value, index, array) => {
            teamsinfo.push(data[index])
        })


        res.json({
            ...teamsinfo
        })
    })

}



