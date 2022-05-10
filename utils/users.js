const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get the current user 
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chatroom
function userLeave(id) {
    // check users array for matching ID and return index
    const index = users.findIndex(user => user.id === id);
    // If the users id is there, return the array without the user so they're removed
    if (!index !== -1) {
        // need to include [0] to return user, not entire array
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    // Gets only the users with the matchind room 
    return users.filter(user => user.room === room)
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}