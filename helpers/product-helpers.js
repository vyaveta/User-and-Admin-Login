var db = require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const { ObjectID } = require('bson')
const objectId= require('mongodb').ObjectId
module.exports={
    // addProduct:(users,callback)=>{
    //     console.log(users.password);
    //     users.password=bcrypt.hash(users.password,10)
    //     console.log("evdem vare vann");
    //     db.get().collection('users').insertOne(users).then((data)=>{
    //         console.log("I have come this far")
    //         callback(data)
    //         console.log(data)
    //         console.log(data.insertedId)
    //         // console.log(data.ops[0]._id)
    //     })
    // }
    addProduct:(users)=>{
        return new Promise(async(resolve,reject)=>{
            var success=null
            var isthere=await db.get().collection(collection.USERS_COLLECTION).findOne({$or:[{name:users.name},{email:users.email}]})
            if(users.name==collection.adminName||users.email==collection.adminEmail){
                success=false
                resolve(success)
             }
             else if(!isthere){
                success=true
                users.password= await bcrypt.hash(users.password,10)
                db.get().collection('users').insertOne(users)
                resolve(success)
            } 
            else{
                success=false
                resolve(success)
            }
           
        })
        
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let Users= await db.get().collection(collection.USERS_COLLECTION).find().toArray()
                resolve(Users)       
        })
    },
    deleteUser:(Uid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USERS_COLLECTION).deleteOne({_id:objectId(Uid)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    },
    getUserDetails:(Uid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USERS_COLLECTION).findOne({_id:objectId(Uid)}).then((user)=>{
                resolve(user)
            })
        })
    },
    updateUser:(Uid,userDetails)=>{
        var check= null
        return new Promise(async(resolve,reject)=>{
            var is_there = await db.get().collection(collection.USERS_COLLECTION).findOne({name:userDetails.name},{email:userDetails.email})
            if(userDetails.name==collection.adminName||userDetails.email==collection.adminEmail){
                var check=false
                resolve(check)
            }
            else if(!is_there){
                check=true
                let newp= await bcrypt.hash(userDetails.password,10)
                db.get().collection(collection.USERS_COLLECTION).updateOne({_id:objectId(Uid)},{$set:{name:userDetails.name,email:userDetails.email,password:newp}}).then((response)=>{
                    resolve(check)
                })
            }
            else{
                check=false
                resolve(check)
            }
            
        })
    }
}
