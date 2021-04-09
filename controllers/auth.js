var mysql=require('mysql');

var db=mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'password',
    database: 'restaurant'
});

exports.adminLogin=(req,res)=>{
    var mAdminId=req.body.email;
    var mAdminPwd=req.body.password;

    db.query('SELECT admin_id, admin_pwd FROM admin WHERE admin_id=? AND admin_pwd=?',[mAdminId,mAdminPwd],(err,results)=>{
        if(err){
            console.log(err);
        }
        if(!mAdminPwd || !mAdminPwd){
            return res.status(400).render('homePage',{
                message: "Please fill id and password"
            });
        }
        if(results.length>0){
            return res.render('adminMainPage');
        }else{
            return res.render('homePage',{
                message: "Wrong Id or Password..."
            });
        }
    });
}

exports.customerLogin=(req,res)=>{
    var mCustomerEmail=req.body.user_id;
    var mCustomerPassword=req.body.user_pwd;

    db.query('SELECT cEmail, cPassword FROM customer WHERE cEmail=? AND cPassword=?',[mCustomerEmail,mCustomerPassword],(err,results)=>{
        if(err){
            console.log(err);
        }
        if(!mCustomerEmail || !mCustomerPassword){
            return res.status(400).render('clogin',{
                message: "Please fill id and password"
            });
        }
        if(results.length>0){
            return res.render('homePage');
        }else{
            return res.render('clogin',{
                message: "Wrong Id or Password..."
            });
        }
    });
}