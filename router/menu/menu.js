const express =require('express')
const router = express.Router();
const menu=require('../../controller/menu/menu');
const auth =require('../../util/auth');
//menu
// router.get('/Backmenu/getBackmenu',menu.getMenus) 
// router.post('/Backmenu/insertmenus',menu.insertMenus) 
// router.delete('/Backmenu/deleteBackmenu',menu.deleteMenus) 

router.get('/Adminmenu/getBackmenu',auth,menu.getMenus) 
router.get('/Adminmenu/getBackmenuByRole',auth,menu.getBackmenuByRole) 
router.post('/Adminmenu/insertmenus',auth,menu.insertMenus) 
router.delete('/Adminmenu/deleteBackmenu',auth,menu.deleteMenus) 


module.exports = router;