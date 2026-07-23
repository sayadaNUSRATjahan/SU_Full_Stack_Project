const showloggedUserName=()=>{
    const userNameElement=document.getElementById('logged-username');

    //find username from local storage
    let user=localStorage.getItem('loggedInUser');
    if(user)
    {
        user=JSON.parse(user);
    }

    //show username in the webpage
    userNameElement.innerHTML=user.name;
}

const checkloggedInUser=()=>{
    let user=localStorage.getItem('loggedInUser');

    if(user)
    {
        user=JSON.parse(user);
    }
    else{
        window.location.href= "/index.html";
    }

}
const logOut=()=>{
    //clearinng the local storage
    localStorage.clear();
    checkloggedInUser();
}

const fetchAllpost = async () => {
    let data;


    try {
        const res = await fetch("http://localhost:5000/getAllpost");
        data = await res.json();
        console.log(data);
        showAllpost(data);
    }
    catch (err) {
        console.log("Error fetching data from sever");
    }
}

const showAllpost = async (allPost) => {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = "";

    allPost.forEach(async (post) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
            <div class="post-header">
                <div class="post-user-image">
                    <img src=${post.PostedUserImage}>
                </div>
                <div class="post-username-time">
                    <p class="user-name">${post.postedUserName}</p>
                    <div class="posted-time">
                        <span>${post.postedTime}</span>
                        <span>hours ago</span>
                    </div>

                </div>
            </div>
            <div class="post-text">
                <p class="post-text-content">
                ${post.postTest}
                </p>
            </div>
            <div class="post-image">
                <img src=${post.postedImgURL} alt="post image">

            </div>
`;
        postContainer.appendChild(postDiv);
        //comments under a post
        let postComments = await fetchAllCommentsOfaPost(post.id);
        console.log("Post comment:", postComments);

        postComments.forEach((comment) => {
            const commentholderDiv = document.createElement('div');
            commentholderDiv.classList.add('comment-holder');
            commentholderDiv.innerHTML = `
                            <div class="comment">
                    <div class="user-comment-image">
                        <img src=${comment.CommentedUserImage} comment-user-image">
                    </div>
                    <div class="comment-text-container">
                        <h4>${comment.CommentedUserName}</h4>
                        <p class="comment-text">
                        ${comment.commentText}
                        </p>

                    </div>
                </div>
`;
            postDiv.appendChild(commentholderDiv);

        });
        //adding a new comment of a post
        const addnewCommentDiv = document.createElement('div');
        addnewCommentDiv.classList.add('post-comment-holder');

        addnewCommentDiv.innerHTML = `
                <div class="post-comment-inputfield-holder">
                    <input type="text" placeholder="Post your comment" class="post-comment-inputholder"
                        id="postCommentInput-forPostId${post.id}">
                </div>

                <div class="comment-btn-holder">
                    <button onClick=handlePostComment(${post.id}) id="comment-btn" class="post-comment-btn">Comment</button>
                </div>

`
        postDiv.appendChild(addnewCommentDiv);
    });
};

const handlePostComment = async (postID) => {
    //collecting logged in user ID from local storage
    let user = localStorage.getItem('loggedInUser');
    if (user) {
        user = JSON.parse(user)
    }
    console.log("User:", user);

    const commentedUserID = user.id;

    //getting comment text from input
    const commentTextElement = document.getElementById(`postCommentInput-forPostId${postID}`);
    const commentText = commentTextElement.value;

    //current time of the comment
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    console.log("comment time:", now)
    let timeOfComment = now.toISOString();

    const CommentObject = {
        commentofPostID: postID,
        commentedUserID: commentedUserID,
        commentText: commentText,
        commentTime: timeOfComment,
    };

    try {
        const res = await fetch('http://localhost:5000/postComment', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(CommentObject),
        });
        const data = await res.json();
    }
    catch (err) {
        console.log("Error while sending data to the server ", err);
    }
    finally
    {
        location.reload();
    }

};
// comments under a post
const fetchAllCommentsOfaPost = async (id) => {
    let CommentOfpost = [];
    try {
        const res = await fetch(`http://localhost:5000/getAllcommments/${id}`);
        CommentOfpost = await res.json();

    }
    catch (err) {
        console.log("Error fetching comments from the server:", err);
    }
    finally {
        return CommentOfpost;
    }
}

//this function automatically runs
fetchAllpost(); 
// showloggedUserName();
// checkloggedInUser();