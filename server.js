const express = require("express");
const path = require("path");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

/* =========================
   STATIC FILES (SENİN YAPIN)
========================= */
app.use(express.static(__dirname));

/* MAIN PAGE */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "roblox.html"));
});

/* =========================
   MULTIPLAYER SYSTEM
========================= */

let players = {};

io.on("connection", (socket) => {

    socket.on("join", () => {

        players[socket.id] = {
            x: 0,
            y: 2,
            z: 0
        };

        socket.emit("init", players);
        socket.broadcast.emit("new", socket.id);
    });

    socket.on("move", (data) => {
        players[socket.id] = data;
        socket.broadcast.emit("update", {
            id: socket.id,
            data
        });
    });

    socket.on("chat", (msg) => {
        io.emit("chat", {
            id: socket.id,
            msg
        });
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("remove", socket.id);
    });

});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log("NovaBlocks running on port " + PORT);
});