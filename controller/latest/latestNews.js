const db = require('../../config/db');
const { nanoid } = require("nanoid");
const moment = require("moment")
exports.getlatestAll = (req, res) => {
    db.query('SELECT * from news ', (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        } else {
            res.json({
                newsItem: data,
            })
        }
    })

}
exports.getlatestByid = (req, res) => {
    console.log(req.query);

    db.query(`SELECT * from news where news_id ='${req.query.news_id}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        } else {
            res.json({
                newsItem: data,
            })
        }
    })

}

exports.InsertOrUpdatelatest = (req, res) => {
    console.log(req.body);
    if (req.body.news_id) {
        db.query(`UPDATE news SET news_title="${req.body.news_title}",category="${req.body.category}" ,news_introdution="${req.body.news_introdution}",news_content=?,news_status="${req.body.news_status}" ,news_pic="${req.body.news_pic}"  WHERE news_id='${req.body.news_id}'`, req.body, (err, data) => {
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
        req.body.createdate = moment().format('DD MMMM YYYY');
        req.body.news_id = ids;
        db.query('INSERT INTO news SET ?', req.body, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    id: ids,
                    createdate: req.body.createdate
                })
            }
        })
    }

}
exports.Deletelatest = (req, res) => {
    db.query(`DELETE from news WHERE news_id='${req.query.news_id}'`, (err, data) => {
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
exports.InsertOrUpdateVideo = (req, res) => {
    console.log(req.body);
    if (req.body.video_id) {
        console.log('update');
        
        db.query(`UPDATE video SET ?  WHERE video_id='${req.body.video_id}'`, req.body, (err, data) => {
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
        console.log('insert');
        const ids = nanoid(11);
        req.body.created_time = moment().format('DD MMMM YYYY');
        req.body.video_id = ids;
        db.query('INSERT INTO video SET ?', req.body, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                })
            } else {
                res.json({
                    Operation: 'success',
                    id: ids,
                    created_time: req.body.created_time
                })
            }
        })
    }

}
exports.Deletevideo = (req, res) => {
    db.query(`DELETE from video WHERE video_id='${req.query.video_id}'`, (err, data) => {
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