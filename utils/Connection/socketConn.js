// socketConn.js
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connection from '../../config/db.js';

const socketIdsByUserId = {}; // Map user IDs to socket IDs
const socketConn = (app) => {

    const server = new Server(app);
    const io = new SocketIOServer(server, {
        cors: {
            origin: 'http://localhost:3000',  // Replace with your client's origin
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {

        const userId = socket.handshake.auth.userId;
        console.log('->',userId)
        // Store the socket ID for the user
        socketIdsByUserId[userId] = socket.id;

        socket.on('chat message', (messageData) => {
            const recipientId = messageData.userId;
            const recipientSocketId = socketIdsByUserId[recipientId];

            if (recipientSocketId) {
              const query = 'INSERT INTO messages (user_id, content, recipient_id, created_at) VALUES (?, ?, ?, NOW())';

            connection.query(query, [socket.handshake.auth.userId, messageData.content, recipientId], (err, results) => {
            if (err) {
                console.error('Error storing message:', err);
                // Handle error gracefully
            } else {
                // Message stored successfully
                socket.to(recipientSocketId).emit('chat message', messageData);
            }
            });

            } else {
                // Handle offline or invalid recipient cases (e.g., store message for later delivery)
            }
        });

        socket.on('disconnect', (socket) => {
            //  console.log('deleted user->',userId)
            delete socketIdsByUserId[userId];
        });

    });

    return server;
};

export default socketConn;
