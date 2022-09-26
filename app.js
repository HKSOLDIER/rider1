const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const client = require("twilio")("AC421691ea6a9a6a1aeb956ff0f7b12b4d","dc52221246f9050da3581105bd1d343d")



var otp = 0
var idd = 0

//app.use(bodyparser.json()) 
app.use(express.json({limit: "4mb"}))
app.use(express.urlencoded({extended: true}))
//app.use(cors)
app.use(morgan('dev'))
require('dotenv/config')

const api = process.env.API_URL

const newOTPSchema = mongoose.Schema({
    id : String,
    usernumber: String,
    otp : String,
    pin: String,
    datee: {
        type : Date,
        default : Date.now
    }
})

console.log('api is',api)
const newOTP = mongoose.model('otp', newOTPSchema)

app.get(api+'/api/login', (req,res) =>{  
    otp = generate(6)
    console.log(otp)
    const user = {
        id: 1,
        usernumber : '+919502761573',
        otp : otp
    }
    console.log('Hello '+user.id)
    res.send(user)
})

app.get(api+'/getNewOTP', async(req,res) =>{
    const otpList = await newOTP.find()
    if(!otpList)
    {
        res.status(500).json({success: false})
    }
    else if(otpList.length  == 0 )
    {
        console.log('Duud Nothing Found')
        res.status(500).json({success: false})
    }
    else
    {
        console.log(otpList)
        res.send(otpList)
    }
    
})
app.post('/api/signup', (req,res) => {

    otp = generate(6)
    idd = generate(7)
    console.log('hello Signup')
   const newSignup = new newOTP({
        //id : req.query.id,
        id : idd,
        usernumber : req.query.usernumber,
        otp : otp
   })
   newSignup.save().then((createdSignUP => {
    res.status(201).json(createdSignUP)
    console.log('Hello')
    if(client)
    {
            console.log('It is if')
    }
    else
    {
        console.log('It is else')
    }
    /*
    client.messages
      .create({body: otp, from: '+919502761573', to: '+919502761573'})//'+'+req.query.usernumber})
      .then((data)=>{
        res.status(200).json({
            message : 'It is done',
            success : true
        })
      }).catch((err) =>{
        res.status(500).json({
            error: err,
            success: false
        })
      })
      */
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
    
    
})

//const  mongoAtlasUri = "mongodb+srv://dbUser509:dbUser509@cluster0.la2wjea.mongodb.net/users?retryWrites=true&w=majority"

try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      process.env.mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'SIGNUP' },
    ).then(()=>{
        console.log("Database is ready for you man..")
    })
    .catch((err) => {
        console.log('Error at ',err)
    })

  } catch (e) {
    console.log("could not connect");
  }

app.listen(3000, () => {
    console.log(api)
    console.log("Server is running at 3000")
})




function generate(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
    
    if ( n > max ) {
            return generate(max) + generate(n - max);
    }
    
    max        = Math.pow(10, n+add);
    var min    = max/10; // Math.pow(10, n) basically
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;
    
    return ("" + number).substring(add); 
}
