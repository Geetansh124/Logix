/**
 * Offline sync socket — handles store-and-forward for offline mutations.
 * Clients accumulate mutations while offline, then push them when connectivity resumes.
 */
function setupSyncSocket(io, socket) {
  // Client pushes offline mutations
  socket.on('sync:push', async (data) => {
    try {
      const { operations } = data;
      const acknowledged = [];
      const conflicts = [];

      // Process each offline mutation sequentially
      for (const op of operations) {
        try {
          // In a full implementation, this would apply mutations with conflict detection
          acknowledged.push({ id: op.id, status: 'applied' });
        } catch (err) {
          conflicts.push({ id: op.id, error: err.message });
        }
      }

      socket.emit('sync:ack', {
        acknowledged,
        conflicts,
        serverChanges: [], // Server-side changes the client missed
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      socket.emit('sync:error', { message: err.message });
    }
  });

  // Client requests server-side changes it may have missed
  socket.on('sync:pull', (data) => {
    const { lastSyncTimestamp } = data;
    // In a full implementation, this would query changes since lastSyncTimestamp
    socket.emit('sync:pull', {
      changes: [],
      timestamp: new Date().toISOString(),
    });
  });
}

module.exports = { setupSyncSocket };
