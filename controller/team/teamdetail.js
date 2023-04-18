const db = require('../../config/db');

exports.getteamvrcar = (req, res) => {
    const teamnames = req.query.teamname;
    db.query(`select * from vrcar where team='${teamnames}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }
        var vrcarsinfo = [];
        data.forEach((value, index, array) => {
            vrcarsinfo.push(data[index])
        })
        console.log(teamnames);
        
        res.json({
            ...vrcarsinfo
        })
    })

    
  
}
exports.getteamdetailById = (req, res) => {
    const teamnames = req.query.teamname;
    const teamId = req.query.teamId;
    db.query(`select * from team_detail where full_teamname like '%${teamnames}%' and id=${teamId}`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }
        var teaminfo = [];
        data.forEach((value, index, array) => {
            teaminfo.push(data[index])
        })      
        res.json({
            Operation:'success',
            ...teaminfo
        })
    })

    
  
}


