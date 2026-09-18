function setupCargoSocket(io, socket) {
  // Subscribe to cargo updates for an expedition
  socket.on('subscribe:cargo', ({ expeditionId }) => {
    const room = `cargo:${expeditionId}`;
    socket.join(room);
    socket.emit('subscribed', { room, message: `Subscribed to cargo updates for expedition ${expeditionId}` });
  });

  // Handle cargo location update (from GPS devices or manual input)
  socket.on('cargo:location:update', (data) => {
    const room = `cargo:${data.expeditionId}`;
    io.to(room).emit('cargo:location:update', {
      cargoId: data.cargoId,
      location: {
        lat: data.lat,
        lng: data.lng,
        hub: data.hub || null,
        timestamp: data.timestamp || new Date().toISOString(),
      },
    });
  });

  // Handle cargo status update
  socket.on('cargo:status:update', (data) => {
    const room = `cargo:${data.expeditionId}`;
    io.to(room).emit('cargo:status:update', {
      cargoId: data.cargoId,
      status: data.status,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('unsubscribe:cargo', ({ expeditionId }) => {
    socket.leave(`cargo:${expeditionId}`);
  });
}

module.exports = { setupCargoSocket };
