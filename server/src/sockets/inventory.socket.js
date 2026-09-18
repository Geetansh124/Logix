function setupInventorySocket(io, socket) {
  socket.on('subscribe:inventory', ({ stationId }) => {
    const room = `inventory:${stationId}`;
    socket.join(room);
    socket.emit('subscribed', { room, message: `Subscribed to inventory alerts for station ${stationId}` });
  });

  socket.on('unsubscribe:inventory', ({ stationId }) => {
    socket.leave(`inventory:${stationId}`);
  });
}

/**
 * Emit a depletion alert to all subscribers of a station.
 * Called from inventory service when stock drops below threshold.
 */
function emitDepletionAlert(io, stationId, data) {
  io.to(`inventory:${stationId}`).emit('inventory:depletion:alert', data);
}

/**
 * Emit an expiry alert to all subscribers of a station.
 */
function emitExpiryAlert(io, stationId, data) {
  io.to(`inventory:${stationId}`).emit('inventory:expiry:alert', data);
}

module.exports = { setupInventorySocket, emitDepletionAlert, emitExpiryAlert };
