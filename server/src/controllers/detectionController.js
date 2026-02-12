class DetectionController {
  constructor() {
    this.detectionHistory = [];
    this.maxHistory = 100;
    this.stats = {
      totalDetections: 0,
      byClass: {
        dry: 0,
        wet: 0,
        electronic: 0
      },
      multiObjectEvents: 0,
      processingChamberUsage: 0
    };
  }
  
  processDetection(data) {
    // Add to history
    this.addToHistory(data);
    
    // Update statistics
    this.updateStats(data);
    
    return {
      success: true,
      data: data,
      stats: this.getStats()
    };
  }
  
  addToHistory(detection) {
    this.detectionHistory.unshift(detection);
    
    // Keep only last N detections
    if (this.detectionHistory.length > this.maxHistory) {
      this.detectionHistory.pop();
    }
  }
  
  updateStats(detection) {
    this.stats.totalDetections++;
    
    // Count by class
    detection.objects.forEach(obj => {
      if (this.stats.byClass[obj.class] !== undefined) {
        this.stats.byClass[obj.class]++;
      }
    });
    
    // Multi-object events
    if (detection.count > 1) {
      this.stats.multiObjectEvents++;
    }
    
    // Processing chamber usage
    if (detection.destination === 'processing') {
      this.stats.processingChamberUsage++;
    }
  }
  
  getStats() {
    return {
      ...this.stats,
      processingChamberPercentage: this.stats.totalDetections > 0
        ? ((this.stats.processingChamberUsage / this.stats.totalDetections) * 100).toFixed(1)
        : 0
    };
  }
  
  getHistory(limit = 10) {
    return this.detectionHistory.slice(0, limit);
  }
  
  clearHistory() {
    this.detectionHistory = [];
  }
  
  resetStats() {
    this.stats = {
      totalDetections: 0,
      byClass: {
        dry: 0,
        wet: 0,
        electronic: 0
      },
      multiObjectEvents: 0,
      processingChamberUsage: 0
    };
  }
}

module.exports = new DetectionController();
