const express =require('express')
const router = express.Router();
const team=require('../../controller/team/teambrief')

router.get('/team/getteaminfo',team.getteaminfo) //req.query

module.exports = router;