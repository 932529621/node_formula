const db = require('../../config/db');


exports.getstandingItems = (req, res) => {
    const year = req.query.year;
    const require = req.query.require;
    if (require === 'RACE') {
        var tableName = 'total_race'
        var items = 'grand_prix'
    } else if (require === 'DRIVERS') {
        var tableName = 'total_driver'
        var items = 'driver'
    } else if (require === 'TEAMS') {
        var tableName = 'total_team'
        var items = 'team'
    } else if (require === 'FASTLAP') {
        var tableName = 'total_fastlap'
        var items = '*'
    }
    console.log(year, require);

    db.query(`select ${items} from ${tableName} where season='${year}' `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }


        var Itemsinfo = [];
        data.forEach((value, index, array) => {
            if (require === 'RACE') {
                Itemsinfo.push(data[index].grand_prix)
            } else if (require === 'DRIVERS') {
                Itemsinfo.push(data[index].driver)
            } else if (require === 'TEAMS') {
                Itemsinfo.push(data[index].team)
            }
        })
        res.json({
            ...Itemsinfo
        })
    })
}
exports.getstandingTotal = (req, res) => {
    const year = req.query.year;
    const require = req.query.require;
    if (require === 'RACE') {
        var tableName = 'total_race'
    } else if (require === 'DRIVERS') {
        var tableName = 'total_driver'
    } else if (require === 'TEAMS') {
        var tableName = 'total_team'
    } else if (require === 'FASTLAP') {
        var tableName = 'total_fastlap'
    }
    console.log(year, require);

    db.query(`select * from ${tableName} where season='${year}'   `, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var StandingTotalinfo = [];
        data.forEach((value, index, array) => {
            StandingTotalinfo.push(data[index])
        })
        StandingTotalinfo.push(tableName)
        res.json({
            ...StandingTotalinfo,
        })
    })
}
exports.getStandingSingle = (req, res) => {
    const year = req.query.year;
    const require = req.query.require;
    const items = req.query.items;

    var Querylastname = items.split(" ");//数据库中total和single名字不对应，只能截取total车手全名与single相匹配
    // console.log(Querylastname[1]);

    if (require === 'RACE') {
        var tableName = 'single_race'
        var SQLitems = 'grand_prix'
        var SQL=`select * from ${tableName} where season='${year}' and ${SQLitems}='${require == 'DRIVERS' ? Querylastname[1] : items}'  `
    } else if (require === 'DRIVERS') {
        var tableName = 'single_driver'
        var SQLitems = 'last_name'
        var SQL=`select * from ${tableName} where season='${year}' and ${SQLitems}='${require == 'DRIVERS' ? Querylastname[1] : items}'  `
    } else if (require === 'TEAMS') {
        var tableName = 'single_team'
        var SQLitems = 'team'
        var SQL=`select * from ${tableName} where season='${year}' and ${SQLitems}='${require == 'DRIVERS' ? Querylastname[1] : items}'  `
    } 
    
    //  else if (require === 'FASTLAPS') {
    //     var tableName = 'single_fastlap'
    //     var SQLitems = 'grand_prix'
    // } else if (require === 'QUALIFYING') {
    //     var tableName = 'single_qualifying'
    //     var SQLitems = 'grand_prix'

    // } else if (require === 'PRATICE1') {
    //     var tableName = 'single_pratice1'
    //     var SQLitems = 'grand_prix'

    // } else if (require === 'PRATICE2') {
    //     var tableName = 'single_pratice2'
    //     var SQLitems = 'grand_prix'

    // } else if (require === 'PRATICE3') {
    //     var tableName = 'single_pratice3'
    //     var SQLitems = 'grand_prix'

    // }


    //选择年份-----》选择条件-----》点击ALL时
    if (require === 'RACE' && items==='ALL') {
        var tableName = 'total_race'
        var SQLitems = 'grand_prix'
        var SQL=`select * from ${tableName} where season='${year}'`

    } else if (require === 'DRIVERS'&& items==='ALL') {
        var tableName = 'total_driver'
        var SQLitems = 'last_name'
        var SQL=`select * from ${tableName} where season='${year}'`

    } else if (require === 'TEAMS'&& items==='ALL') {
        var tableName = 'total_team'
        var SQLitems = 'team'
        var SQL=`select * from ${tableName} where season='${year}'`

    } else if(require === 'FASTLAP'&& items==='ALL'){
        var tableName = 'total_fastlap'
        var SQLitems = 'team'
        var SQL=`select * from ${tableName} where season='${year}'`

        
    }
    console.log(year, require, items);
    console.log(require == 'DRIVERS' ? Querylastname : items);
    db.query(SQL, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var StandingSingleinfo = [];
        data.forEach((value, index, array) => {
            StandingSingleinfo.push(data[index])
        })
        StandingSingleinfo.push(tableName)
        res.json({
            ...StandingSingleinfo,
        })
    })
}
exports.getStandingSingleRace=(req,res)=>{
    const year = req.query.year;
    const require = req.query.require;
    const items = req.query.items;
    if (require === 'FASTLAP' ) {
        var tableName = 'single_fastlap'
        var SQLitems = 'grand_prix'
        var SQL=`select * from ${tableName} where season='${year}' and ${SQLitems}='${items}'`

    } else if (require === 'PRATICE1') {
        var tableName = 'single_pratic1'
        var tableNames = 'single_pratic'
        var SQLitems = 'grand_prix'
        var SQL=`select * from ${tableNames} where season='${year}' and ${SQLitems}='${items}' and type='${require}'`
    } else if(require === 'PRATICE2'){
        var tableName = 'single_pratic2'
        var tableNames = 'single_pratic'
        var SQLitems = 'grand_prix'
        var SQL=`select * from ${tableNames} where season='${year}' and ${SQLitems}='${items}' and type='${require}'`
    }else if(require === 'PRATICE3'){
        var tableName = 'single_pratic3'
        var tableNames = 'single_pratic'
        var SQLitems = 'grand_prix'
        var SQL=`select * from ${tableNames} where season='${year}' and ${SQLitems}='${items}' and type='${require}'`
    }else if(require ==='QUALIFYING'){
        var tableName = 'single_qualifying'
        var SQLitems = 'grand_prix'
        var SQL=`select * from ${tableName} where season='${year}' and ${SQLitems}='${items}'`
    }

    db.query(SQL,(err,data)=>{
        if (err) {
            return res.json({
                msg: ' Error from query !',

            })
        }
        var StandingSingleRaceinfo = [];
        data.forEach((value, index, array) => {
            StandingSingleRaceinfo.push(data[index])
        })
        StandingSingleRaceinfo.push(tableName);
        console.log(tableName);
        
        res.json({
            ...StandingSingleRaceinfo,
        })
    })
}