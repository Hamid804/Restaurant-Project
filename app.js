const express=require('express');
const bodyparser=require('body-parser');
const app=express();
var path=require('path');


var publicDirectory=path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.set('view engine','hbs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(8084, ()=>{
    console.log("Server started on port 8084");
});