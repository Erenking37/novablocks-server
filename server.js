const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let players = {};

io.on("connection",(socket)=>{

socket.on("join",()=>{

players[socket.id] = {
x:0,
y:2,
z:0,
rotY:0
};

socket.emit("init",players);
socket.broadcast.emit("newPlayer",socket.id);

});

socket.on("move",(data)=>{

if(!players[socket.id]) return;

players[socket.id] = data;

socket.broadcast.emit("update",{
id:socket.id,
data
});

});

socket.on("disconnect",()=>{

delete players[socket.id];
io.emit("remove",socket.id);

});

});

http.listen(PORT,()=>{
console.log("NovaBlocks v3.5 running:",PORT);
});