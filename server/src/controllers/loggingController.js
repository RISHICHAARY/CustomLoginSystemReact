const bcrypt = require('bcrypt');
const mailgun = require("mailgun-js");

const pool = require('../dbconfig/dbconfig');
const quries = require('../queries/loggingQueries');
const { tokenGenerator } = require('../Helpers/jwtHelpers');

const DOMAIN = "sandbox1a4c0da5377f49e69fa4a80bedb13e2d.mailgun.org";
const mg = mailgun({apiKey: "f81255058802e6cd567349e44c23576d-7ecaf6b5-ab4f90a9", domain: DOMAIN});

const registerUser = (req,res) =>{

    const { type,active,photo,firstName,lastName,dob,gender,email,mobile,address,role,status,password } = req.body;

    bcrypt.hash(password,10).then( (hashedPassword)=>{
        pool.query(quries.registerUser,[ type,active,photo,firstName,lastName,dob,gender,email,mobile,address,role,status,hashedPassword ],(err)=>{
            if(err){
                res.status(200).json({errorCode:405,message: "User already exist"});
            }
            else{
                res.status(200).json({message:"User Registerd Successfully"});
            }
        });
    } )

}

const loginUser = (req,res) =>{

    const { userName,passWord } = req.body;
    console.log(req.body);

    pool.query(quries.getLoginStatus,[ userName ],(err,result)=>{
        if(err){
            throw err;
        }
        else{
            if(result.rowCount == 0){
                res.status(200).json({errorCode:401,message: "Incorrect Username"})
            }
            else if(result.rows[0].active == false){
                res.status(200).json({errorCode:402,message: "Account not Active"})
            }
            else{
                const dbPassWord = result.rows[0].password;
                bcrypt.compare( passWord,dbPassWord ).then((match)=>{
                    if(!match){
                        res.status(200).json({errorCode:403,message: "Incorrect Password"})
                    }
                    else{
                        const accessToken = tokenGenerator(result);
                        res.cookie( "access-token",accessToken,{
                            maxAge: 60*60*24*1000,
                            secure:false
                        } );
                        res.status(200).json({data:{userName:result.rows[0].email,type:result.rows[0].type},message: "Login Success"})
                    }
                });
            }
        }
    });
}

const verifyCookie = (req,res) =>{
    res.status(200).json({data:{userName: req.userData.userName, type: req.userData.type}});
}

const getUser = (req,res) =>{
    const { userEmail } = req.body;

    pool.query(quries.getUser,[userEmail], (error,result)=>{
        if(error){
            throw error;
        }
        else{
            if(result.rowCount == 0){
                res.status(200).json({messages:"No user found"});
            }
            else{
                res.status(200).json({data:result.rows,message:"User found"});
            }
        }
    })
}

const getOtp = (req,res)=>{

    const OTP = Math.floor(Math.random() * (999999 - 111111 + 1) + 111111)
    const data = {
        from: "Mailgun Sandbox <postmaster@sandbox1a4c0da5377f49e69fa4a80bedb13e2d.mailgun.org>",
        to: req.body.userMail,
        subject: "Hello",
        template: "OTP-Mail",
        'h:X-Mailgun-Variables': JSON.stringify({firstname:req.body.userName,OTP:OTP})
    };
    mg.messages().send(data, function (error, body) {
        if(error){
            res.status(200).json({errorCode:410,message:"Mail not sent"});
        }
        else{
            res.status(200).json({message:"Mail sent", otp:OTP});
        }
    });
}

const updatePassword = (req,res)=>{
    const { email,password } = req.body

    bcrypt.hash(password,10).then( (hashedPassword)=>{
        pool.query(quries.updatePassword,[hashedPassword,email],(error,result)=>{
            console.log(result);
            if(error){
                console.log(error);
                res.status(200).json({message:error});
            }
            else{
                if(result.rowCount !== 0){
                    res.status(200).json({message:"Password Updated"});
                }
                else{
                    res.status(200).json({message:"No user found"});
                }
            }
        })
    } )

}

module.exports = {
    loginUser,
    registerUser,
    verifyCookie,
    getOtp,
    getUser,
    updatePassword
}