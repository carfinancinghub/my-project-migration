var taskSocketEmitter = require('./taskSocketEmitter');

module.exports = {
  init: taskSocketEmitter.init,
  emitToAllClients: taskSocketEmitter.emitToAllClients,
  closeSocketServer: taskSocketEmitter.closeSocketServer
};






