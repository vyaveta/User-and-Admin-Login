const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const session = require('express-session')
const {v4:uuidv4} = require("uuid");
const path = require('path')
const fileUpload = require('express-fileupload')
const db = require('./config/connection')
const productHelper = require('./helpers/product-helpers');
const productHelpers = require('./helpers/product-helpers');
const userHelper = require('./helpers/user-helpers');
const { response } = require('express');
var flag
db.connect((err)=>{
  if(err)  console.log('an error occured while connectiong to database'+err);
  else console.log("Successfully connected to MongoDB over over!!");
})
 var errmsg=null
 var logout_msg=null
 var signup_msg=null
 var create_usermsg=null
 var edit_msg=null
const admin={
    name:"Admin",
    password:"pass@admin",
    email:'admin@gmail.com'
}
var User_Name
//  the data
const products=[
  {companyName : "Apple", 
  model : "I PHONE 13 PRO MAX",
  price : "$ 99.99",
  img  : "https://m.media-amazon.com/images/I/61i8Vjb17SL._SL1500_.jpg"
}
,
 {
  companyName : "Samsung",
  model : "S22 ultra",
  price : "$ 60.99",
  img : "https://m.media-amazon.com/images/I/81TfEXWPcIL._AC_SX342_.jpg"
 },
 {
  companyName : "Nothing",
  model : "Nothing Phone 1",
  price : "$ 40.66",
  img : "https://cdn.shopify.com/s/files/1/0583/2202/6680/products/original-imagg4xza5rehdqv_720x.jpg?v=1657829870"
 },
 {companyName : "Asus", 
 model : "Rog phone 3",
 price : "$ 70.99",
 img  : "https://www.addmecart.com/wp-content/uploads/2021/10/pq18.1.jpg"
},
{companyName : "One PLus", 
model : "10 Pro 5G",
price : "$ 24.99",
img  : "https://images-eu.ssl-images-amazon.com/images/I/418rmVFVCAL._SX300_SY300_QL70_FMwebp_.jpg"
},
{companyName : "Vivo", 
model : "Y75",
price : "$ 14.59",
img  : "https://images-eu.ssl-images-amazon.com/images/I/41eojPKNrPL._SX300_SY300_QL70_FMwebp_.jpg"
}, {companyName : "Oppo", 
model : "Reno 8",
price : "$ 39.00",
img  : "https://opsg-img-cdn-gl.heytapimg.com/epb/202207/12/QSsQmqx1E5KhUAiC.png?x-amz-process=image/format,webp/quality,Q_80"
}, {companyName : "Google", 
model : "PIxel 6 Pro 5g",
price : "$ 78.39",
img  : "https://images-eu.ssl-images-amazon.com/images/I/41r6fnFSaOL._SX300_SY300_QL70_FMwebp_.jpg"
}
]
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(express.static("img"));
app.set('view engine', 'hbs')
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false
}))
app.listen(2303,()=>{console.log("The server has started at  http://localhost:2303  over over!!")})
// caching disabled for every route
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });
   ////////////////////// SIGNUP////////////////
app.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
   console.log(response+"server")
   if(!response)  {
    signup_msg='Account or UserName already exists'
    // res.render('signup',{signup_errmsg})
    res.redirect('/signup')
   }
   else {
    signup_msg="Now login with your Account"
    console.log("server expected false res" +response)
  //  res.render('login',{signup_msg})
  res.redirect('/')
  }
 })
})
  app.get('/',(req,res)=>{
    if
    (req.session.user) res.render('home',{products,User_Name})
    else if
    (req.session.admin) res.render('adminHome',{products})
    else
    res.render('login',{errmsg,signup_msg,logout_msg,flag})
    flag=true
    logout_msg=null
    signup_msg=null
    errmsg=null;
  })
  
  app.get('/signup',(req,res)=>{
    res.render('signup',{signup_msg})
    signup_msg=null
  })

  ////////////////////////////////////////////// LOGIN ////////////////////////////////////
  app.post('/login',(req,res)=>{
    userHelper.doLogin(req.body).then((response)=>{
      if(response.status){
        req.session.loggedIn=true
        req.session.user=response.user
        User_Name =response.user
        console.log(response.user)
       res.redirect('/')
      }
      else if(response.user=="admin"){
        console.log("And the admin crossed the line!!")
        req.session.admin=true;
        res.redirect('/')
      }
      else {
        console.log("invalid!!!")
        errmsg="Can't find the entered Account"
        res.redirect('/')
      }
    })
  })
 
  app.get('/editProducts',(req,res)=>{
    console.log('edit atempt detected!! , over over!')
    productHelpers.getAllUsers().then((users)=>{  
      if (req.session.admin){ 
        res.render('editproducts',{users,edit_msg})
        edit_msg=null
      }
      else res.render('login')
    })
    ////////////////// EDIT USER DETAILS/////////////////////////////
    app.get('/editUser/:id',async(req,res)=>{
      let user =await productHelper.getUserDetails(req.params.id)
      res.render('editUsers',{user})
      console.log(user)
    })
    app.post('/editedUser/:id',(req,res)=>{
      productHelper.updateUser(req.params.id,req.body).then((response)=>{
          productHelpers.getAllUsers().then((users)=>{
            if(response){
              edit_msg='successfully edited';
            //  res.render('editProducts',{edit_succ,users}); 
            res.redirect('/editProducts')
            }
            else{
              edit_msg="Edit not possible"; res.redirect('/editProducts');  
             }
          })
      })
    })
   
   
  })
  app.get('/addProducts',(req,res)=>{
    console.log('The admin has clicked the edit products button over over!!!')
    if(req.session.admin) {res.render('addProducts',{create_usermsg});  create_usermsg=null}
    else res.render('login')
  })

  //////////////////////////////////////////// Added product////////////////////////////
  app.post('/addedProduct',(req,res)=>{
    console.log("Boss!!, we got the product information over over!!")
    console.log(req.body)
    // console.log(req.files.img)
    // productHelper.addProduct(req.body,function(result){
    //   res.render('addProducts')
    // })
    productHelper.addProduct(req.body).then((response)=>{
      if(response){
        create_usermsg='Successfully created an Account';
      //  res.render('addProducts',{create_usermsg});
      res.redirect('/addProducts')
      }
      else {
         create_usermsg='Account Aready Exits'
        // res.render('addProducts',{create_usererrmsg}); create_usererrmsg=null 
        res.redirect('/addProducts')
       
      }
    })
  })
  //////////////////////// DELETION /////////////////
  app.get('/deleteUser/:id',(req,res)=>{
    let Uid = req.params.id
    console.log(Uid)
    productHelper.deleteUser(Uid).then((response)=>{
      res.redirect('/editProducts')
    })
  })
  app.get('/logout',(req,res)=>{
    console.log("logout attempt detected, over over!! ")
    req.session.destroy(function(error){
        if(error){
            console.log(error)
            res.send(error)
        }
        else{
          flag=false
          logout_msg="Successfully Logged Out"
          res.redirect('/')
            // res.render('login',{logout_msg})
        }
    })
  })
    