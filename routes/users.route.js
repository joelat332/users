const express =require("express");
const userController =require("../controllers/user.controller");
const router=express.Router();


router.post('/refresh',userController.Refresh)
router.post('/login',userController.LoginUser)
router.post('/logout',userController.Logout)

router.post('/add/create',userController.CreateNewUser)
router.delete('/add/:id',userController.handleDeleteUser)


module.exports =router
