const handlelogin=async()=>{
    const useridInput=document.getElementById('user-id');
    const userpassInput=document.getElementById('password');

    const id= useridInput. value;
    const password= userpassInput.value;

    const user={
        id:id,
        password:password,
    };
    console.log(user);
    const userInfo=await fetchUserInfo(user);
    const errorElement=document.getElementById('user-login-error');

    //user data didnot match with database

    if(userInfo.length ==0)
        {
            errorElement.classList.remove("hidden");
        }
        else{
            errorElement.classList.add("hidden");

            //save user information before jumping to the next page
            localStorage.setItem("loggedInUser",JSON.stringify(userInfo[0]));

            //then make a jump to a new page
            window.location.href ="/post.html";
        }
};
const fetchUserInfo=async(user)=>{
    let data;
    try{
   const res= await fetch('http://localhost:5000/example/getuserinfo',{
    method:"POST",
    headers:{
        "content-type":"application/json",
    },
    body:JSON.stringify(user),
   });
    data=await res.json();
    }
    catch(err){
        console.log("Error connecting to the server",err);
    }
    finally{
        return data;
    }
};