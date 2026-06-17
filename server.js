const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};

io.on("connection",(socket)=>{

socket.on("join",(name)=>{

players[socket.id] = {
x:0,
y:2,
z:0
};

socket.emit("init",players);
socket.broadcast.emit("new",socket.id);

});

socket.on("move",(data)=>{
players[socket.id] = data;
socket.broadcast.emit("update",{id:socket.id,data});
});

socket.on("chat",(msg)=>{
io.emit("chat",{id:socket.id,msg});
});

socket.on("disconnect",()=>{
delete players[socket.id];
io.emit("remove",socket.id);
});

});

http.listen(process.env.PORT || 3000,()=>{
console.log("NovaBlocks v3.7 running");
});