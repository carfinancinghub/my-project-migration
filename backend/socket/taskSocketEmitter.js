let ioInstance = null;

const setupTaskSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Mechanic connected:', socket.id);
    const assignedTask = {
      taskId: 'task_001',
      type: 'inspection',
      vehicle: 'Toyota Camry 2020',
      status: 'assigned'
    };
    socket.emit('task-assigned', assignedTask);
    setTimeout(() => {
      socket.emit('task-completed', { ...assignedTask, status: 'completed' });
    }, 5000);
  });
};

function init(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, { cors: { origin: '*' } });
  setupTaskSocket(ioInstance);
}

function emitToAllClients(message) {
  if (ioInstance) {
    ioInstance.emit('broadcast', message);
  }
}

function closeSocketServer() {
  if (ioInstance) {
    ioInstance.close();
  }
}

module.exports = {
  init,
  emitToAllClients,
  closeSocketServer
};
