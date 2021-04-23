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

/*router.get('/addToCart',(req,res)=>{
    res.render("addToCart");
}); */

router.get('/addToCart',authController.addToCartPage);

router.get('/cart',authController.cartAdd);

router.get('/alert',(req,res)=>{
    res.render("clogin");
});

router.post('/alert',(req,res)=>{
    res.render("clogin");
});

router.get('/addAddress',(req,res)=>{
    res.render("addAddress");
});

router.get('/confirmOrder',authController.confirmOrder);

router.get('/removeItem',authController.removeItem);

router.get('/myorder',authController.myorder);

router.get('/cancelOrder',authController.cancelOrder);

module.exports=router;