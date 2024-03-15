const express =require("express");
const userController =require("../controllers/user.controller");
const router=express.Router();


router.post('/',userController.check)
router.post('/refresh',userController.Refresh)
router.post('/login',userController.LoginUser)
router.post('/logout',userController.Logout)

router.post('/createuser',userController.CreateNewUser)
router.delete('/:id',userController.handleDeleteUser)


module.exports =router
