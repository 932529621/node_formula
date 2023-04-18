const express =require('express')
const router = express.Router();
const standing=require('../../controller/standingDetail/standingDetail.js')

//standing
router.get('/standingdetail/getstandingItems',standing.getstandingItems) //req.query
router.get('/standingdetail/getstandingTotal',standing.getstandingTotal) //req.query
router.get('/standingdetail/getStandingSingle',standing.getStandingSingle)
router.get('/standingdetail/getStandingSingleRace',standing.getStandingSingleRace)
// router.get('/standingdetail/getstandingdetail/:year/:require/:items',standing.getstandingdetail) //req.params

module.exports = router;