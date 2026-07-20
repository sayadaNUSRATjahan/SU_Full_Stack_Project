const express= require('express');
const mysql =require('mysql');
const cors =require('cors');

const port =5000;

const app=express();

//middlewares
app.use(cors());
app.use(express.json());

// app.get(`/example`,(req,res)=>{
//     res.send("Hello Nusrat!");
// })

//making connection with mysql server
let db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'posbook',
});
 
db.connect(err=>{
    if(err){
        console.log("Something went on while connecting the database:",err);
        throw err;
    }
    else
        console.log("MySQL server is connected.");
});

//getting user data from server
app.post("/example/getuserinfo",(req,res)=>{

    const {id,password} =req.body;

    console.log(req.body);
    const getUserInfosql ="SELECT id, name, image FROM user WHERE user.id=? AND user.password=?";

    let query=db.query(getUserInfosql,[id ,password],(err,result)=>{
        if(err){
            console.log("Error getting user info from server :",err);
            throw err;
        }
        else{
            res.send(result);
        }
    })
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})