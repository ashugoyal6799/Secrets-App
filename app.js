const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs  = require('ejs');
const encrypt = require('mongoose-encryption');


const app=express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true , useUnifiedTopology: true});

// user defined schema for using encryption
const userSchema = new mongoose.Schema({
    email:String,
    password : String
});

//add plugin before creating the model 
const secret ="ThisisAshuGoyal";
userSchema.plugin(encrypt,{secret : secret, encryptedFields: ['password']});

const User  = new mongoose.model("User",userSchema);

app.get('/',function(req,res){
    res.render('home');
});
app.get('/register',function(req,res){
    res.render('register');
});
app.get('/login',function(req,res){
    res.render('login');
});

app.post('/register',function(req,res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post('/login',function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    
    //while findOne mongoose automatically decrypt passoword so that we can match with input password
    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    res.send("Invalid Email id or password");
                }
            }
        }
    })
});

app.listen(3000,function(req,res){
    console.log("server is listening at port 3000");
});