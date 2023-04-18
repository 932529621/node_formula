const express =require('express')
const router = express.Router();
const latest=require('../../controller/latest/latestNews')
const ossUpload=require("../../util/Ossupload")
const ossDelete=require("../../util/OssDelete")
const auth =require('../../util/auth');
const multer = require('multer'); //读取上传文件
const upload = multer({ dest: './upload' }); //设置存储路径，没有文件夹会自动创建
// router.get('/getlatestswiper',latest.getlatestswiper);

//backGetLatest
router.get('/getlatestAll',latest.getlatestAll);
router.get('/getlatestByid',latest.getlatestByid)
router.post('/AdminNews/InsertOrUpdatelatest',auth,latest.InsertOrUpdatelatest);
router.delete('/AdminNews/Deletelatest',auth,latest.Deletelatest);
router.post('/AdminNews/InsertOrUpdateVideo',auth,latest.InsertOrUpdateVideo);
router.delete('/AdminNews/Deletevideo',auth,latest.Deletevideo);

router.post('/AdminNews/OssuploadNewsImg',auth,upload.single('file'),ossUpload.ossUpload);
router.post('/AdminNews/OssDeleteNewsImg',auth,ossDelete.deleteMulti);
module.exports = router;
