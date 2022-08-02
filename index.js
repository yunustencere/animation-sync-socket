const { Server } = require("socket.io");

const io = new Server(2567, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const players = [];

io.on("connection", (socket) => {
    console.log("socket connected, socket.id: ", socket.id)

    socket.on("newPlayer", (data) => {
        console.log("newPlayer", data);
        const player = {
            socketId: socket.id,
            ...data
        }
        newPlayer(player);
        io.emit("newPlayer", player)
    });

    socket.on("getPlayers", () => {
        console.log("getPlayers")
        io.to(socket.id).emit("getPlayers", players);
    });

    socket.on("characterInformation", (character) => {
        // console.log("characterInformation triggered")
        console.log("characterInformation triggered", JSON.stringify(character))
        const player = players.find(player => player.socketId === socket.id)
        if (player) {
            player.character = character;
        }
    });

    socket.on("disconnect", () => {
        console.log("IO DISCONNECTED");
        removePlayer(socket.id);
        io.emit("playerLeft", socket.id);
    });



});

const tickrate = 30
setInterval(() => {
    console.log("getPlayers emmiting")
    io.emit("getPlayers", players)
}, 1000 / tickrate)

const newPlayer = (player) => {
    players.push(player);
    console.log(players);
};

const removePlayer = (id) => {
    let index = players.findIndex((user) => user.socketId === id);
    if (index !== -1) {
        console.log("USER REMOVED IO: ", players[index]);
        return players.splice(index, 1)[0];
    }
};

console.log("Listening on port 2567")