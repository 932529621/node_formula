const db = require('../../config/db');

exports.getdriverdetail = (req, res) => {
    const driverId=req.query.driverId;
    console.log(req.query);
    
    const driverlastName=req.query.driverlastName;
    console.log(driverId,driverlastName);
    
    db.query(`select * from driver_detail where id='${driverId}' and last_name='${driverlastName}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var driverdetail = [];
        data.forEach((value, index, array) => {
            driverdetail.push(data[index])
        })
        res.json({
            ...driverdetail
        })
    })

}
//Team and driver Swiper
exports.getdriverSWiper = (req, res) => {
    const driverlastName=req.query.driverlastName;
    const teamName=req.query.teamName;
    if(teamName){
        db.query(`select * from detail_driver_pic where team_name='${teamName}'`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var driverSWiper = [];
        data.forEach((value, index, array) => {
            driverSWiper.push(data[index])
        })
        res.json({
            ...driverSWiper
        })
    })
    }else{
        db.query(`select * from detail_driver_pic where last_name='${driverlastName}'`, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
    
                })
            }
            var driverSWiper = [];
            data.forEach((value, index, array) => {
                driverSWiper.push(data[index])
            })
            res.json({
                ...driverSWiper
            })
        })
    }
    

}
exports.getdriverAlsoLike = (req, res) => {
    const driverId=req.query.driverId;
    const team=req.query.team;
    const driverlastName=req.query.driverlastName;
    var num=[];
    for(var i = 0; i < 4; i++){
        num[i] = Math.floor(Math.random()*20) + 1;  
        for(var j = 0; j < i; j++){
            if(num[i] == num[j] || num[i] == Number(driverId)){
                i--
            }
        }
        var SQLId1=num[0];
        var SQLId2=num[1];
        var SQLId3=num[2];
        var SQLId4=num[3];
    }
    console.log(SQLId1,SQLId2,SQLId3,SQLId4,driverId,typeof(driverId),team,driverlastName)
    
  
    
    db.query(`select * from driver_detail where team='${team}' and last_name !='${driverlastName}' OR id IN(${SQLId1},${SQLId2},${SQLId3},${SQLId4}) limit 4 `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var driverAlsoLike = [];
        data.forEach((value, index, array) => {
            driverAlsoLike.push(data[index])
        })
        res.json({
            ...driverAlsoLike
        })
    })

}
