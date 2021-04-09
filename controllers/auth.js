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