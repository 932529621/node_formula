const db = require('../../config/db');

exports.getdriverbrief = (req, res) => {
    db.query('select * from driver_detail order by points desc', (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var driverbrief = [];
        data.forEach((value, index, array) => {
            driverbrief.push(data[index])
        })
        res.json({
            ...driverbrief
        })
    })

}

