const db = require('../../config/db');
const alipaySdk = require('../../util/alipay');
const AlipayFormData = require('alipay-sdk/lib/form').default;
const { nanoid } = require("nanoid");

//作废 与schedule表合并 2023-4-10
exports.getticketdetailinfo = (req, res) => {
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
exports.getsingleticketinfo = (req, res) => {
    const prixName = req.query.prixName;
    console.log(prixName);

    db.query(`select * from ticket_info where ticket_prix='${prixName}' ORDER BY FIELD(ticket_type,'VIP','Grandstand','Grassland')`, (err, data) => {
        if (err) {
            return res.json({
                msg: ' Error from query !',
            })
        }
        var singleticketinfo = [];
        data.forEach((value, index, array) => {
            singleticketinfo.push(data[index])
        })
        res.json({
            ...singleticketinfo,
        })
    })

}
exports.GoToPay = async (req, res) => {
    let order_id = req.body.order_id;
    let price = req.body.price;
    let OrderName = req.body.OrderName;
    let OrderIntro = req.body.OrderIntro;
    let returnUrl = req.body.returnUrl;
    const formData = new AlipayFormData();
    formData.setMethod('get');
    // formData.addField('notifyUrl', 'http://2kst9f.natappfree.cc');//支付成功后的接口
    formData.addField('returnUrl', returnUrl);//支付成功后跳转的页面
    formData.addField('bizContent', {
        outTradeNo: order_id,
        productCode: 'FAST_INSTANT_TRADE_PAY',
        totalAmount: price,
        subject: OrderName,
        body: OrderIntro,
        //   time_expire:'2023-2-20 17:50:00'
    });
    // mrquie3270@sandbox.com  
    // 111111
    const result = await alipaySdk.exec(
        'alipay.trade.page.pay',
        {},
        { formData: formData },
    );

    // result 为 form 表单
    console.log(result);
    res.json({
        Operation: 'success',
        result
    })

}

exports.DeleteticketInfo = (req, res) => {
    console.log(req.query);
    db.query(`DELETE from ticket_info WHERE ticket_id='${req.query.ticket_id}'`, (err, data) => {
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

exports.InsertUserTicket = (req, res) => {
    req.body.order_id=nanoid(11);
    db.query('INSERT INTO ticket_sold SET ?', req.body, (err, data) => {
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

exports.InsertOrUpdateTicketInfo = (req, res) => {

    if (req.body.ticket_id) {
        db.query(`UPDATE ticket_info SET ?  WHERE ticket_id='${req.body.ticket_id}'`, req.body, (err, data) => {
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

        const ids = nanoid(11);
        req.body.ticket_id = ids;
        req.body.ticket_surplus = Number(req.body.ticket_surplus);
        req.body.ticket_price = Number(req.body.ticket_price);
        console.log(req.body);

        db.query('INSERT INTO ticket_info SET ?', req.body, (err, data) => {
            if (err) {
                return res.json({
                    msg: ' Error from query !',
                    err
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
