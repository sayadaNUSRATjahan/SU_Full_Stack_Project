const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const port = 5000;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// making connection with mysql server
let db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'posbook',
});
  
db.connect(err => {
    if(err){
        console.log("Something went wrong while connecting the database:", err);
        throw err;
    }
    else {
        console.log("MySQL server is connected.");
    }
});

// getting user data from server (Login)
app.post("/example/getuserinfo", (req, res) => {
    const { id, password } = req.body;
    console.log(req.body);
    const getUserInfosql = "SELECT id, name, image FROM user WHERE user.id = ? AND user.password = ?";

    let query = db.query(getUserInfosql, [id, password], (err, result) => {
        if(err){
            console.log("Error getting user info from server:", err);
            throw err;
        }
        else {
            res.send(result);
        }
    });
});

// getting all posts (Ordered by newest first)
app.get('/getAllpost', (req, res) => {
    const sqlForAllpost = `
        SELECT posts.id, user.image AS PostedUserImage, user.name AS postedUserName, posts.postedTime, posts.postTest, posts.postedImgURL 
        FROM posts 
        INNER JOIN user ON posts.postedUserID = user.id 
        ORDER BY posts.id DESC;
    `;

    db.query(sqlForAllpost, (err, result) => {
        if(err) {
            console.log("Error loading all posts from database: ", err);
            throw err;
        }
        else {
            res.send(result);
        }
    });
});

// getting comments of a single post
app.get('/getAllcommments/:id', (req, res) => {
    let ID = req.params.id;

    let sqlForAllcomments = `
        SELECT user.name AS CommentedUserName, user.image AS CommentedUserImage, comment.commentID, comment.commentofPostID, comment.commentText, comment.commentTime
        FROM comment
        INNER JOIN user ON comment.commentedUserID = user.id 
        WHERE comment.commentofPostID = ? 
        ORDER BY comment.commentID DESC;
    `;

    let query = db.query(sqlForAllcomments, [ID], (err, result) => {
        if(err) {
            console.log("Error fetching comments from the database", err);
            throw err;
        } else {
            res.send(result);
        }
    });
});

// adding new comments to a post (Using NOW() for correct time)
app.post('/postComment', (req, res) => {
    const { commentofPostID, commentedUserID, commentText } = req.body;

    let sqlForAddingNewComments = `
        INSERT INTO comment (commentID, commentofPostID, commentedUserID, commentText, commentTime) 
        VALUES (NULL, ?, ?, ?, NOW());
    `;

    let query = db.query(sqlForAddingNewComments, [
        commentofPostID,
        commentedUserID,
        commentText
    ], (err, result) => {
        if(err) {
            console.log("Error adding comment to the database", err);
        }
        else {
            res.send(result);
        }
    });
});

// adding a new post (Using NOW() for correct time)
app.post('/addNewPost', (req, res) => {
    const { postedUserID, postTest, postedImgURL } = req.body;

    let sqlQueryForAddingNewPost = `
        INSERT INTO posts (id, postedUserID, postedTime, postTest, postedImgURL) 
        VALUES (NULL, ?, NOW(), ?, ?);
    `;

    let query = db.query(sqlQueryForAddingNewPost, [
        postedUserID, 
        postTest, 
        postedImgURL
    ], (err, result) => {
        if(err){
            console.log("Error while adding a new post in database", err);
            throw err;
        }
        else {
            res.send(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});