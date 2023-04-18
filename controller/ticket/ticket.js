const db = require('../../config/db');

exports.getticketinfo = (req, res) => {
    db.query('select * from ticket ', (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var ticketinfo = [];
        data.forEach((value, index, array) => {
            ticketinfo.push(data[index])
        })
        res.json({
            ...ticketinfo
        })
    })

}
exports.getcheapestinfo = (req, res) => {
    db.query(`SELECT ticket_id,ticket_prix, MIN(ticket_price) AS cheapest_price FROM ticket_info GROUP BY ticket_prix `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var cheapestinfo = [];
        data.forEach((value, index, array) => {
            cheapestinfo.push(data[index])
        })
        res.json({
            ...cheapestinfo
        })
    })

}


