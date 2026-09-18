const emergencyService = require('../services/emergency.service');

function setupEmergencySocket(io, socket) {
  // Subscribe to emergency broadcasts
  socket.on('subscribe:emergency', ({ stationId }) => {
    socket.join(`emergency:${stationId}`);
    socket.join('emergency:global'); // All emergencies broadcast globally too
    socket.emit('subscribed', { room: `emergency:${stationId}` });
  });

  // One-click emergency trigger
  socket.on('emergency:trigger', async (data) => {
    try {
      const result = await emergencyService.trigger(data.stationId, {
        level: data.level,
        type: data.type,
        description: data.description,
        triggeredBy: socket.user.name,
      });

      // Acknowledge to triggering client
      socket.emit('emergency:acknowledged', {
        emergencyId: result.emergency.id,
        notificationsSent: result.notifications.map((n) => ({
          recipient: n.recipient,
          channel: n.channel,
          status: n.status,
        })),
      });

      // Broadcast to all connected clients
      io.to('emergency:global').emit('emergency:broadcast', {
        emergencyId: result.emergency.id,
        stationId: data.stationId,
        level: data.level,
        type: data.type,
        rollCallSnapshot: result.emergency.roll_call_snapshot,
        inventorySnapshot: result.emergency.inventory_snapshot,
        triggeredAt: result.emergency.triggered_at,
        triggeredBy: socket.user.name,
      });
    } catch (err) {
      socket.emit('emergency:error', { message: err.message });
    }
  });

  socket.on('unsubscribe:emergency', ({ stationId }) => {
    socket.leave(`emergency:${stationId}`);
  });
}

module.exports = { setupEmergencySocket };
