var mysql=require('mysql');
var url=require('url');

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
            return res.render('homePage',{
                confirmation: results[0].cEmail
            });
        }else{
            return res.render('clogin',{
                message: "Wrong Id or Password..."
            });
        }
    });
}

exports.cartAdd=(req,res)=>{
    var q=url.parse(req.url,true);
    var qdata=q.query;
    
    var cEmailId=qdata.id;
    var pid=qdata.pId;
   /* console.log(qdata.pId);
    console.log(qdata.id); */

    db.query('SELECT cId FROM customer where cEmail=?',[cEmailId],(err,results)=>{
        if(err){
            console.log(err);
        }
        if(results.length>0){
            var cId=results[0].cId;
            db.query('SELECT pId FROM cart WHERE cId=? AND pId=?',[cId,pid],(err,results)=>{
                if(err){
                    console.log(err);
                }
                if(results.length>0){
                    return res.render("menuPage",{
                        message: "This item is already added"  //JSON.stringify(results[0])
                    });
                }else{
                    db.query('INSERT INTO cart SET ?',{cId:cId,pId:pid},(err,results)=>{
                        if(err){
                            console.log(err);
                        }else{
                            return res.render("menuPage",{
                                
                            });
                        }
                    });
                }
            });
        }else{
            return res.render("menuPage");
        }
    });
}

exports.addToCartPage=(req,res)=>{
    var q=url.parse(req.url,true);
    var qdata=q.query;
    var cEmailId=qdata.cEmId;

    db.query('SELECT cId FROM customer WHERE cEmail=?',[cEmailId],(err,results)=>{
        if(err){
            console.log(err);
        }
        if(results.length>0){
            var cId=results[0].cId;
            //console.log(cId);

            db.query('SELECT pId FROM cart WHERE cId=?',[cId],(err,results)=>{
                if(err){
                    console.log(err);
                }
                if(results.length>0){
                    console.log(results.length);
                    var totalP=results.length;

                    console.log(results[0]);
                   // var result='{"a":"b","c":"d"}';
                   var result=JSON.stringify(results);
                    return res.render("addToCart",{
                        result: result
                    });
                }
            });


            //return res.render("addToCart");
        }else{
            return res.render("menuPage");
        }
    });
}

