const socketIo = require("socket.io");

const users = new Map();

const SocketServer = server => {
  const io = socketIo(server);

  io.on("connection", socket => {
    socket.on("join", async user => {
      let sockets = [];

      if (users.has(user.id)) {
        const existingUser = users.get(user.id);
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        users.set(user.id, existingUser);
        sockets = [...existingUser.sockets, ...[socket.id]];
      } else {
        users.set(user.id, { id: user.id, sockets: [socket.id] });
        sockets.push();
      }

      const onlineFriends = []; //ids

      const chatters = []; //query

      //notify if he is online
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i])) {
          const chatter = user.get(chatters[i]);
          chatters.sockets.forEach(socket => {
            try {
              io.to(socket).emit("online", user);
            } catch (e) {}
          });
          onlineFriends.push(chatter.id);
        }
      }

      //send to user sockets which of his friends are online
      sockets.forEach(socket => {
        try {
          io.to(socket).emit("friends", onlineFriends);
        } catch (e) {}
      });

      console.log("New user joined", user.name);

      io.to(socket.id).emit("typing", "User typing...");
    });
  });
};

const getChatters = async userId => {
  try {
  } catch (e) {
    console.log(e);
    return [];
  }
};

module.exports = SocketServer;
