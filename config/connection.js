// const mongoClient= require('mongodb').MongoClient
// var state={
//     db:null
// }
// module.exports.connect= (done)=> {
//     // const url="mongodb://0.0.0.0:27017/"
//     // const url='mongodb://localhost:27017'
//     const url="localhost:2701"
//     const dbname='Shopping'
//     mongoClient.connect(url,(err,data)=>{
//         if (err)  return done(err)
//             state.db=data.db(dbname)
//             console.log("got this far")
//     })
//     done()
// }
// module.exports.get= function(){
//     return state.db
// }  
   
const mongoClient= require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=function (done) {
        const url="mongodb://0.0.0.0:27017/"
    // const url='mongodb://localhost:27017'
    // const url="localhost:2701"
    const dbname='SignUp'
    mongoClient.connect(url,(err,data)=>{
        if (err) {
            console.log("error!!!")
            return done(err)
            
        }
        state.db=data.db(dbname)
    })
    done()
}
module.exports.get=function () {
    return state.db
}
