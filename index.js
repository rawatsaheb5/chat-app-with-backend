const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const path = require('path');
const authRoutes = require("./route/user");

const cors = require("cors");
const port = process.env.PORT || 8000;

dotenv.config();
connectDB();

const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});




app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req, res)=>{
  app.send('server is running fine ')
})





io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("message-from-client", (message) => {
    console.log(message);
    io.emit("message-from-server", message);
  });
  socket.on("disconnect", (reason) => {
    console.log("Disconnected from server:", reason);
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

