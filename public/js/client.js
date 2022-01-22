const socket=io();

var username;
var chats=document.querySelector(".chats");
var users_list=document.querySelector(".users-list");
var users_count=document.querySelector(".users-count");
var msg_send=document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg");


do{
    username=prompt("Enter your name");
}while(!username);

/* It is called when new user joins */
socket.emit("new user joined", username);

/* Notifying the user has joined */
socket.on('user-connected',(socket_name)=>{
    userJoinleft(socket_name,'joined');
});

/* function to create join/left status */
function userJoinleft(name,status){
    let div=document.createElement("div");
    div.classList.add('user-join');
    let content=`<p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

/* Notifying the user has left */
socket.on('user-discon',(user)=>{
    userJoinleft(user,'left')
});

/* updating users list and count */
socket.on('user-list',(users)=>{
    users_list.innerHTML="";
    users_arr=Object.values(users);
    for(i=0;i<users_arr.length;i++){
        let p=document.createElement('p');
        p.innerText=users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML=users_arr.length;
});

/* For sending the msgs */

/*msg_send.addEventListener('click',()=>{
    let data={
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value='';
    }
});*/

function msg(){
    let data={
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value='';
    }
}

msg_send.addEventListener('click',()=>{
    msg();
});
user_msg.addEventListener('keyup',(event)=>{
    if(event.which === 13){
        msg();
    }
});



function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content=`
        <h5>${data.user}</h5>
        <p>${data.msg}</p>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming');
});
