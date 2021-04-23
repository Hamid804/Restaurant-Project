const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth');

router.post('/adminLogin',authController.adminLogin)

router.post('/customerLogin',authController.customerLogin)

router.post('/enterAddress',authController.enterAddress)

module.exports=router;