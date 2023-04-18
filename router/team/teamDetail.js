const express =require('express')
const router = express.Router();
const teamdetail=require('../../controller/team/teamdetail')

router.get('/teamdetail/getteamvrcar',teamdetail.getteamvrcar) //req.query
router.get('/teamdetail/getteamdetailById',teamdetail.getteamdetailById) 
module.exports = router;