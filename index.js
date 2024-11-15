const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./route/user");
const messageRoute = require('./route/message')
const cors = require("cors");
const Message = require("./model/message");
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
app.use('/api/message', messageRoute)
app.get("/", (req, res) => {
  app.send("server is running fine ");
});




const onlineUsers = {};


io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("a new user connected", (userId) => {
   // console.log(userId);
    onlineUsers[userId] = socket.id;
    console.log('all sockets we have => ', onlineUsers)
  });
  
  socket.on("send-message", async (data) => {
    // to => userId of the user to whom message to sent
    // from => userId of the sender
    
    const { message, to, from } = data;
    console.log('message from ', from);
    const newMessage = new Message({
      content: message,
      sender: from,
      receiver: to,
    });
    await newMessage.save();
    //console.log(onlineUsers[to])
    if (onlineUsers[to]) {
      io.to(onlineUsers[to]).emit('receive-message', { content: message, sender: from })
      console.log('message sent to the ', to)
    }
       
  });
  socket.on("disconnect", (reason) => {
    console.log("Disconnected from server:", reason);
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
  });
});


server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
