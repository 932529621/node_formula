const db = require('../../config/db');

exports.getteaminfo = (req, res) => {
    db.query('select * from team_detail order by points desc', (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var teambrief = [];
        data.forEach((value, index, array) => {
            teambrief.push(data[index])
        })
        res.json({
            ...teambrief
        })
    })

}

