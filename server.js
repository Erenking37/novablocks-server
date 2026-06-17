const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req,res)=>{
res.send("NovaBlocks Server Online");
});

/* SAFE START */
http.listen(PORT, ()=>{
console.log("Server running on", PORT);
});