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

            db.query('SELECT cId,pId,quantity FROM orderr',(err7,results7)=>{
                if(err7){
                    console.log(err7);
                }
                if(results7.length>0){
                  console.log(results7);
                  //console.log(results7.length);
                  var totalItem=results7.length;
                  var cArray=[];
                  var pArray=[];
                  var qty=[];

                  for(let l=0;l<totalItem;l++){
                    //console.log(l);
                    var cid=results7[l].cId;
                    const pid=results7[l].pId;
                    const qnty=results7[l].quantity;
                    db.query('SELECT cName,cAddress,cMobile FROM customer WHERE cId=?',[cid],(err8,results9)=>{
                        if(err8){
                            console.log(err8);
                        }
                        if(results9.length>0){
                            cResult=JSON.stringify(results9);

                            var ab=JSON.parse(cResult);

                            cArray.push(ab[0]);
                            //console.log(pid);
                            db.query('SELECT pName,pPrice,pCategory FROM products WHERE pId=?',[pid],(err10,result10)=>{
                                if(err10){
                                    console.log(err10);
                                }
                                if(result10.length>0){
                                    pResult=JSON.stringify(result10);

                                    var ab2=JSON.parse(pResult);

                                    pArray.push(ab2[0]);

                                    qty.push(qnty);
                                   // console.log(l);
                                    if(l==totalItem-1){
                                        var cResToSend=JSON.stringify(cArray);
                                        var pResToSend=JSON.stringify(pArray);
                                        var qResToSend=JSON.stringify(qty);
                                        return res.render('adminMainPage',{
                                            cDetails: cResToSend,
                                            pDetails: pResToSend,
                                            qDetails: qResToSend
                                        });
                                    }
                                }
                            });

                           /* if(l==0){
                                console.log(cArray);
                            } */
                        }
                    });
                 }

                }else{
                    return res.render("adminMainPage");
                }
            });
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

                    db.query('SELECT pId FROM cart WHERE cId=?',[cId],(err12,results12)=>{
                        if(err12){
                            console.log(err12);
                        }
                        var mArra=[];
                        if(results12.length>0){
                            var ab12=JSON.stringify(results12);

                            var ab13=JSON.parse(ab12);
                            //console.log(ab13);

                            for(let x=0;x<results12.length;x++){
                                var ab14=ab13[x].pId;
                                mArra.push(ab14);

                                if(x==results12.length-1){
                                    var ab15=JSON.stringify(mArra);
                                    //console.log(ab15);
                                    return res.render("menuPage",{
                                        addedItem: ab15,
                                        message: "This item is already added"
                                    });
                                }
                            }

                        }else{
                            return res.render("menuPage",{
                            });
                        }
                    });
                }else{
                    db.query('INSERT INTO cart SET ?',{cId:cId,pId:pid},(err,results)=>{
                        if(err){
                            console.log(err);
                        }else{
                            db.query('SELECT pId FROM cart WHERE cId=?',[cId],(err12,results12)=>{
                                if(err12){
                                    console.log(err12);
                                }
                                var mArra=[];
                                if(results12.length>0){
                                    var ab12=JSON.stringify(results12);

                                    var ab13=JSON.parse(ab12);
                                    //console.log(ab13);

                                    for(let x=0;x<results12.length;x++){
                                        var ab14=ab13[x].pId;
                                        mArra.push(ab14);

                                        if(x==results12.length-1){
                                            var ab15=JSON.stringify(mArra);
                                            //console.log(ab15);
                                            return res.render("menuPage",{
                                                addedItem: ab15
                                            });
                                        }
                                    }

                                }else{
                                    return res.render("menuPage",{
                                        //send information to know which item is added or not
                                    });
                                }
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

    return addToCartFun(cEmailId,res);
    
    
}

function addToCartFun(cEmailId,res){
    db.query('SELECT cId FROM customer WHERE cEmail=?',[cEmailId],(err,results)=>{
        if(err){
            console.log(err);
        }
        if(results.length>0){
            var cId=results[0].cId;
            //console.log(cId);

            db.query('SELECT pId FROM cart WHERE cId=?',[cId],(err,result2)=>{
                if(err){
                    console.log(err);
                }
                if(result2.length>0){
                   // console.log(result2.length);
                    var totalP=result2.length;
                    var k;
                    var result3;
                    var mArr=[];
                    for(k=0;k<totalP;k++){
                       // console.log(i);
                        var pidd=result2[k].pId;
                        db.query('SELECT pId,pName,pPrice,pCategory,pImage FROM products WHERE pId=?',[pidd],(er,rsul)=>{
                            if(er){
                                console.log(er);
                            }
                            if(rsul.length>0){
                                k=k-1;
                                result3=JSON.stringify(rsul);


                                var ab=JSON.parse(result3);
                                

                                mArr.push(ab[0]);
                                //console.log(mArr);
                                
                                if(k==0){
                                    console.log(mArr);
                                    var resToSend=JSON.stringify(mArr);

                                    db.query('SELECT cName,cAddress,cMobile FROM customer WHERE cId=?',[cId],(err4,reslt4)=>{
                                        if(err4){
                                            console.log(err4);
                                        }
                                        if(reslt4.length>0){
                                            var address=JSON.stringify(reslt4);
                                            console.log(address);
                                            return res.render("addToCart",{
                                                mresult: resToSend,
                                                maddress: address
                                            });
                                        }else{
                                            return res.render("addToCart",{
                                                mresult: resToSend,
                                               // maddress: "Something went wrong..."
                                            });
                                        }
                                    });
                                }  
                            }
                        });
                    }
                }else{
                    db.query('SELECT cName,cAddress,cMobile FROM customer WHERE cId=?',[cId],(err4,reslt4)=>{
                        if(err4){
                            console.log(err4);
                        }
                        if(reslt4.length>0){
                            var address=JSON.stringify(reslt4);
                           // console.log(address);
                            return res.render("addToCart",{
                                maddress: address
                            });
                        }else{
                            return res.render("addToCart",{
                                mresult: resToSend,
                               // maddress: "Something went wrong..."
                            });
                        }
                    });
                }
            });
            //return res.render("addToCart");
        }else{
            return res.render("menuPage");
        }
    });
}



exports.enterAddress=(req,res)=>{
    var qq=url.parse(req.url,true);
    var qdat=qq.query;
    var cEmailId=qdat.id;

    var u_name=req.body.user_name;
    var u_contact=req.body.user_contact;
    var u_address=req.body.user_address;


    db.query('UPDATE customer SET cName=?,cAddress=?,cMobile=? WHERE cEmail=?',[u_name,u_address,u_contact,cEmailId],(err,resul)=>{
        if(err){
            console.log(err);
        }
        return addToCartFun(cEmailId,res);
    });
}

exports.confirmOrder=(req,res)=>{
    var q3=url.parse(req.url,true);
    var qdata3=q3.query;
    var pr_ids=qdata3.pIds;
    var cEmailId=qdata3.id;
    var pr_qty=qdata3.qty;

    var ppid=JSON.parse(pr_ids);
    //console.log(ppid.length);
    //console.log(ppid);
   // console.log(pr_qty);

    db.query('SELECT cId FROM customer WHERE cEmail=?',[cEmailId],(err,reslt5)=>{
        if(err){
            console.log(err);
        }
        if(reslt5.length>0){
            var cid=reslt5[0].cId;
            var totalProducts=ppid.length;
            //console.log(totalProducts);

            for(m=0;m<totalProducts;m++){
                var piid=ppid[m];
                db.query('INSERT INTO orderr SET ?',{cId:cid,pId:piid,quantity:pr_qty},(err6,result6)=>{
                    if(err6){
                        console.log(err6);
                       // break;
                    }else{
                        m=m-1;
                        if(m==0){
                           db.query('DELETE FROM cart WHERE cId=?',[cid],(err16,results16)=>{
                               if(err16){
                                   console.log(err16);
                               }
                               return myOrderListFun(cEmailId,res); //jump to My orders Page
                           });
                        }
                    }
                });
            }        
        }else{
            return addToCartFun(cEmailId,res);
        }
    });
}

exports.removeItem=(req,res)=>{
    var q=url.parse(req.url,true);
    var qdata=q.query;

    var prId=qdata.prdId;
    var cEmailId=qdata.id;
   // console.log(cEmailId);
   // console.log(prId);

   db.query('SELECT cId FROM customer WHERE cEmail=?',[cEmailId],(err13,result13)=>{
       if(err13){
           console.log(err13);
       }
       if(result13.length>0){
           var cid=result13[0].cId;
          // console.log(cid);
          db.query('DELETE FROM cart WHERE cId=? AND pId=?',[cid,prId],(err14,result14)=>{
              if(err14){
                  console.log(err14);
              }
              return addToCartFun(cEmailId,res);
          });
       }
   });

}

exports.myorder=(req,res)=>{
    var q=url.parse(req.url,true);
    var qdata=q.query;

    var cEmailId=qdata.cEmId;
   // console.log(cEmailId);

    return myOrderListFun(cEmailId,res);
}

function myOrderListFun(cEmailId,res){
    db.query('SELECT cId FROM customer WHERE cEmail=?',[cEmailId],(err,results)=>{
        if(err){
            console.log(err);
        }
        if(results.length>0){
            var cId=results[0].cId;
            //console.log(cId);

            db.query('SELECT pId,quantity FROM orderr WHERE cId=?',[cId],(err,result2)=>{
                if(err){
                    console.log(err);
                }
                if(result2.length>0){
                   // console.log(result2.length);
                    var totalP=result2.length;
                    var result3;
                    var mArrPr=[];
                    var mArrQty=[];

                    for(let k=0;k<totalP;k++){
                       // console.log(i);
                        var pidd=result2[k].pId;
                        var qntiy=result2[k].quantity;

                        mArrQty.push(qntiy);
    
                        db.query('SELECT pId,pName,pPrice,pCategory,pImage FROM products WHERE pId=?',[pidd],(er,rsul)=>{
                            if(er){
                                console.log(er);
                            }
                            if(rsul.length>0){
                                result3=JSON.stringify(rsul);


                                var ab=JSON.parse(result3);
                                

                                mArrPr.push(ab[0]);
                                //console.log(mArr);
                                
                                if(k==totalP-1){
                                   // console.log(mArrPr);
                                  //  console.log(mArrQty);
                                    var resToSendPr=JSON.stringify(mArrPr);
                                    var resToSendQty=JSON.stringify(mArrQty);

                                    db.query('SELECT cName,cAddress,cMobile FROM customer WHERE cId=?',[cId],(err4,reslt4)=>{
                                        if(err4){
                                            console.log(err4);
                                        }
                                        if(reslt4.length>0){
                                            var address=JSON.stringify(reslt4);
                                            console.log(resToSendPr);
                                            console.log(resToSendQty);
                                            console.log(address);
                                            return res.render("myOrderPage",{
                                                oResultPr: resToSendPr,
                                                oResultQty:resToSendQty,
                                                oResultAdd: address
                                            });
                                        }else{
                                            return res.render("myOrderPage",{
                                                oResultPr: resToSendPr,
                                                oResultQty:resToSendQty
                                               // maddress: "Something went wrong..."
                                            });
                                        }
                                    });
                                }  
                            }
                        });
                    }
                }else{
                    db.query('SELECT cName,cAddress,cMobile FROM customer WHERE cId=?',[cId],(err4,reslt4)=>{
                        if(err4){
                            console.log(err4);
                        }
                        if(reslt4.length>0){
                            var address=JSON.stringify(reslt4);
                            return res.render("myOrderPage",{
                                oResultAdd: address,
                                emptyList: "Your Order list is empty..."
                            });
                        }else{
                            return res.render("myOrderPage",{
                                emptyList: "Something went wrong..."
                            });
                        }
                    });
                }
            });
            //return res.render("addToCart");
        }else{
            return res.render("homePage");
        }
    });
}

exports.cancelOrder=(req,res)=>{
    var q=url.parse(req.url,true);
    var qdata=q.query;

    var prId=qdata.prdId;
    var cEmailId=qdata.id;

   // console.log(prId);
   // console.log(cEmailId);

   db.query('SELECT cId FROM customer WHERE cEmail=?',[cEmailId],(err15,results15)=>{
       if(err15){
           console.log(err15);
       }
       if(results15.length>0){
        var cid=results15[0].cId;

        db.query('DELETE FROM orderr WHERE cId=? AND pId=?',[cid,prId],(err14,result14)=>{
            if(err14){
                console.log(err14);
            }
            return myOrderListFun(cEmailId,res);
        });

       }
   });
}


