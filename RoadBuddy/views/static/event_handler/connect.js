import { onlineUsers } from "../Utils/AppClass.js";

socket.on("initialization", () => {
    socket.emit("initial_friend_status");
    socket.emit("online_friend_status");
});

socket.on("sync_online_user", (userIDArray) => {
    onlineUsers.AppendUserID(userIDArray);
})