var db = require('../config/connection')
var collection=require('../config/collection')
const bcrypt = require('bcrypt')
const { USERS_COLLECTION } = require('../config/collection')
const { resolve } = require('path')
const { rejects } = require('assert')
const admin={
    name:'Admin',
    email:'admin@gmail.com',
    password:'pass@admin'
}
module.exports = {
    doSignup:(userData)=>{
        var isUnique=null
        return new Promise(async(resolve,reject)=>{                     
            let user = await db.get().collection(collection.USERS_COLLECTION).findOne({$or: [{email:userData.email},{name:userData.name}]});
            if(userData.name==admin.name||userData.email==admin.email){
                isUnique=false
                resolve(isUnique)
            }
           else if(!user){     
                userData.password = await bcrypt.hash(userData.password,10)
                console.log(isUnique)
                db.get().collection(collection.USERS_COLLECTION).insertOne(userData)
                isUnique=true
                resolve(isUnique)        
            }
            else if(user){   
                isUnique=false
                resolve(isUnique)
            }
             
        })   
    },
    doLogin:(userData)=>{
        let loginStatus=false;
        let response={}
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USERS_COLLECTION).findOne({email:userData.email,name:userData.name})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("login success")
                        response.user = user.name
                        response.status = true
                        resolve(response)
                        
                    }
                    else {
                        console.log("login failed")
                        response.status = false
                        resolve(response)
                    }
                })
            }else if(userData.email==admin.email&&userData.password==admin.password&&userData.email==admin.email) {
                console.log('Its the ADMIN!!!!!!')
                response.user="admin"
                resolve(response)
            }
            else {
                response.user=false
                resolve(response)
            }
        })
    }
}