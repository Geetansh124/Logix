import { io } from 'socket.io-client';

let socket = null;

export function connectSocket(token) {
  if (socket?.connected) return socket;

  const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || window.location.origin;

  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('✓ Socket.io connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket.io disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket.io connection error:', err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
