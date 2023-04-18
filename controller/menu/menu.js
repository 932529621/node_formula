const db = require('../../config/db');
const { nanoid } = require("nanoid");

exports.getMenus = (req, res) => {
    db.query('select * from sys_menu order by order_num ', (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        } else {
            var MenusNode = [];
            var MenusChild = [];
            data.forEach((value, index, array) => {
                value.type == 0 ? MenusNode.push(data[index]) : MenusChild.push(data[index])
            })
            res.json({
                MenusNode,
                MenusChild,
            })

        }

    })

}
exports.insertMenus = (req, res) => {
    if (req.body.id) {
        db.query(`UPDATE sys_menu SET ? WHERE id='${req.body.id}'`,req.body, (err, data) => {
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
        db.query('INSERT INTO sys_menu SET ?', req.body, (err, data) => {
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

    console.log(req.body);

}
exports.deleteMenus = (req, res) => {
    db.query(`DELETE from sys_menu WHERE id='${req.query.id}'`, (err, data) => {
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
exports.getBackmenuByRole = (req, res) => {
    const role_id=req.BackUserInfo.role_id;
    db.query(`select * from sys_role_permission where role_id='${role_id}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        } else {
            res.json({
               permission:data
            })

        }

    })

}