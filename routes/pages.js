const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth');


router.get('/',(req,res)=>{
    res.render("homePage");
});

router.get('/home',(req,res)=>{
    res.render("homePage");
});

router.get('/menu',(req,res)=>{
    res.render("menuPage");
});

router.get('/customerlogin',(req,res)=>{
    res.render("clogin");
});

router.get('/cart',authController.cartAdd);

router.get('/alert',(req,res)=>{
    res.render("clogin");
});

module.exports=router;