const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Socket Layer over Http Server
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
// On every Client Connection
io.on('connection', socket => {
    console.log('Socket: client connected',socket.id);
    // io.emit('notification', {
    //   _id:"11",
    //   typeMessage:"text",
    //   message:"test message ba3ed 10 secondes",
    //   date:new Date(),
    //   action:"5fc136fab57e714cecea5eb6",
    //   member:"5fc12ab9b57e714cecea5ead",
    //   nameOfSender:"Tarek Bjaoui",
    //   urlImageOfSender:"http://localhost:3000/api/user/app/images/5fc437a1ca5b6b002497da84.jpeg"
    // });
    socket.broadcast.emit('test:1',{test:'project updated'});
    socket.on("notification",val=>{
      socket.broadcast.emit('notification',val);
    });
    socket.on("notification:typing",(user,message)=>{
      socket.broadcast.emit('notification:typing',user,message);
    });
});

server.listen(port);
