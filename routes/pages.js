const express=require('express');
const router=express.Router();

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

module.exports=router;