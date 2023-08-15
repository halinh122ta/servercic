const express = require('express')
const router = express.Router()
const user = require('../model/user')
const cic = require('../model/cic')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const verifyToken = require('../midleware/auth')
require('dotenv').config();

// Cấu hình các route cho group
router.post('/user/login',async (req, res) => {
    // Trả về danh sách người dùng
    var username = req.body.username
    var password = req.body.password
    // Tạo mã thông báo truy cập
    const users = await user.login(username)
    if(users.length == 0){
         res.send({
            success:false,
            msg:"username not true"
        }) 
        return;
    }
    let status = false
    await compare(password,users[0].password).then((result)=>{
        status = result
    }).catch(()=>{

    })
    if(status == true){
        delete users[0].password
        const payload = { user_id: users[0].id }
        const token = jwt.sign(payload, process.env.SECRET_KEY)
        res.send({
            success:true,
            token:token,
            data:users[0]
        })
    }
    else{ res.send({
        success:false,
        msg:"Tài khoản hoặc mật khẩu sai !"
    }) }
});
router.post('/user/info',verifyToken,async (req, res) => {
    // Trả về danh sách người dùng
    let users = await user.requireUser(req.user.user_id)
    if(users.length < 0){
        res.send({
            error:"not found"
        })
    }
    users = users[0]
    delete users.password
    delete users.id
    res.send({
        success:true,
        data:users
    })
});
router.post('/user/register',async (req, res) => {
    // Trả về danh sách người dùng
    var username = req.body.username
    const checks = await user.login(username)
    if(checks.length > 0){
        res.send({
            success:false,
            msg:"Tên tài khoản đã tồn tại !"
        })
        return;
    }
    var password = ""
    await encryption(req.body.password).then((result) => {
        password = result
    }).catch(()=>{})
    const users = await user.register(username,password)
    const payload = { user_id: users.insertId }
    const token = jwt.sign(payload, process.env.SECRET_KEY)
    res.send({
        success:true,
        token:token
    })
});
router.post('/cic/info',async (req, res) => {
    // Trả về danh sách người dùng
    var name = req.body.name
    var cmnd = req.body.cmnd
    var type = req.body.type
    var apikey = req.body.apikey
    var data =await user.getUserApiKey(apikey)
    if(data.length <= 0){
        res.send({
            success:false,
            data:{
                message:"Vui lòng đăng nhập tài khoản"
            }
        })
        return
    }
    let price =await cic.getPrice(type)
    if(price.length > 0){
        price = price[0]
    }else{
        res.send({
            success:false,
            data:{
                message:"error"
            }
        })
        return
    }
    data =  data[0]
    let result = ""
    let boolRessult = true
    let number = 0
    while(boolRessult){
         result = await cic.checkCic(
            name,
            cmnd,)
        number += 1;
        if(result.message.includes("không đúng hoặc đã đăng nhập") || result.message.includes("Lỗi kiểm tra thông tin")){
            
        }else{
            boolRessult = false
        }
        if(number == 50){
            res.send({
                success:false,
                data:{
                    message:"Hệ thống đang bận"
                }
            })
            return
        }
    }
    if(parseInt(data.balance) < parseInt(price.price)){
        //không đủ số dư
        res.send({
            success:false,
            data:{
                message:"Không đủ số dư"
            }
        })
        return
    }else{
        var newBalen = parseInt(data.balance) -  parseInt(price.price)
        let newup = await user.updateUser(data.id,newBalen)
    }
    // while(boolRessult){
    //      result = await cic.checkCic(
    //         name,
    //         cmnd,)
    //     if(result.)
    //      boolRessult = false
    // }
    //trừ tiền nào
    // console.log(result)
    res.send({
        success:true,
        status:"dod",
        data:result,
    })
});
router.post('/user/admin',async (req, res) => {
    //Trả về danh sách người dùng
    var apikey = req.body.apikey
    var use =await user.getUserApiKeyAdmin(apikey)
    if(use.length == 0){
        res.send({
            success:false,
            msg:"no admin"
        })
        return;
    }
    res.send({
        success:true,
        msg:"admin"
    })
});
router.post('/user/list',async (req, res) => {
    //Trả về danh sách người dùng
    var apikey = req.body.apikey
    var use = await user.getUserApiKeyAdmin(apikey)
    var list = await user.getUsers()
    if(use.length == 0){
        res.send({
            success:false,
            msg:"no admin"
        })
        return;
    }
    //thực hiện trả về 

    res.send({
        success:true,
        data:list
    })
});
router.post('/user/info-person',async (req, res) => {
    // Trả về danh sách người dùng
    var apikey = req.body.apikey
    var use =await user.getUserApiKeyAdmin(apikey)
    if(use.length == 0){
        res.send({
            success:false,
            msg:"no admin"
        })
        return;
    }
    let users = await user.requireUser(req.body.id)
    if(users.length < 0){
        res.send({
            error:"not found"
        })
    }
    users = users[0]
    delete users.password
    delete users.apikey
    delete users.role
    delete users.timestemp
    res.send({
        success:true,
        data:users
    })
});
router.post('/user/change-person',async (req, res) => {
    // Trả về danh sách người dùng
    try {
         var apikey = req.body.apikey
        var add = req.body.balance
        var newPass = req.body.newPass
        var use = await user.getUserApiKeyAdmin(apikey)
        if(use.length == 0){
            res.send({
                success:false,
                msg:"no admin"
            })
            return;
        }
        let users = await user.requireUser(req.body.id)
        if(users.length < 0){
            res.send({
                success:false,
                error:"not found"
            })
        }
        users = users[0]
        if(parseInt(add) != 0){
            var balance =  users.balance
            var newBalance = parseInt(add) + parseInt(balance)
            try{  cic.setHistorys(users.username,parseInt(add),newBalance) }catch(err) {}
            let newup = await user.updateUser(req.body.id,newBalance)
        }
        if(newPass != undefined && newPass.length > 4){
            var hash = ""
            await encryption(newPass).then((result) => {
                hash = result
            }).catch(()=>{})
            let newup = await user.updatePassUser(req.body.id,hash)
        }
        res.send({
            success:true
        })
    }catch(err){
        res.send({
            success:false
        })
    }
});
router.post('/user/info-prices',async (req, res) => {
    // Trả về danh sách người dùng
    var apikey = req.body.apikey
    var use =await user.getUserApiKeyAdmin(apikey)
    if(use.length == 0){
        res.send({
            success:false,
            msg:"no admin"
        })
        return;
    }
    let prices = await cic.listPrice()
    if(prices.length < 0){
        res.send({
            error:"not found"
        })
    }
    prices
    res.send({
        success:true,
        data:prices
    })
});
router.post('/user/change-prices',async (req, res) => {
    // Trả về danh sách người dùng
    var apikey = req.body.apikey
    var use =await user.getUserApiKeyAdmin(apikey)
    if(use.length == 0){
        res.send({
            success:false,
            msg:"no admin"
        })
        return;
    }
    let prices = await cic.listPrice()
    if(prices.length < 0){
        res.send({
            error:"not found"
        })
    }
    if(req.body.web == undefined || req.body.soft == undefined){
        res.send({
            success:false,
            error:"miss prams"
        })
    }else{
        cic.setPrice(req.body.web,'web')
        cic.setPrice(req.body.soft,'soft')
        res.send({
            success:true
        })
    
    }
});
router.post('/user/historys',async (req, res) => {
    // Trả về danh sách người dùng
    var apikey = req.body.apikey
    var use =await user.getUserApiKeyAdmin(apikey)
    if(use.length == 0){
        res.send({
            success:false,
            msg:"no admin"
        })
        return;
    }
    if(req.body.start == undefined || req.body.end == undefined || req.body.start.length < 5 || req.body.end.length < 5){
        res.send({
            success:false,
            error:"miss prams"
        })
    }else{
        var historys = await cic.getHistorys(req.body.start,req.body.end)
        res.send({
            success:true,
            data:historys
        })
    
    }
});
function encryption(password){
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                reject(err)
            } else {
                resolve(hash)
            }
          });
    });
}
function compare(password,hash){
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            
            if (err) {
                console.error(err);
            } else if (result) {
                resolve(result)
            } else {
                reject(result)
            }
        });
    });
}
// Xuất router để sử dụng
module.exports = router;
