const { Server } = require('socket.io');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedClients = new Set();
  }
  
  initialize(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    });
    
    this.setupConnectionHandlers();
    console.log('Socket.IO initialized');
  }
  
  setupConnectionHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.connectedClients.add(socket.id);
      
      // Send current stats on connection
      socket.emit('connected', {
        message: 'Connected to Smart Bin System',
        timestamp: new Date().toISOString()
      });
      
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });
      
      socket.on('request_status', () => {
        socket.emit('system_status', {
          status: 'online',
          clients: this.connectedClients.size
        });
      });
    });
  }
  
  emitDetectionUpdate(data) {
    if (this.io) {
      this.io.emit('detectionUpdate', data);
      console.log('Emitted detection update to', this.connectedClients.size, 'clients');
    }
  }
  
  emitBinStatus(data) {
    if (this.io) {
      this.io.emit('binStatus', data);
    }
  }
  
  emitSystemStatus(data) {
    if (this.io) {
      this.io.emit('systemStatus', data);
    }
  }
  
  emitAlert(data) {
    if (this.io) {
      this.io.emit('alert', data);
    }
  }

  emitCreditUpdate(data) {
    if (this.io) {
      this.io.emit('creditUpdate', data);
    }
  }
  
  getConnectedClientsCount() {
    return this.connectedClients.size;
  }
}

module.exports = new SocketService();
