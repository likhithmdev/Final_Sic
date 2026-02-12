class Detection {
  constructor(data) {
    this.count = data.count || 0;
    this.objects = data.objects || [];
    this.destination = data.destination || 'none';
    this.timestamp = data.timestamp || new Date().toISOString();
  }
  
  validate() {
    if (typeof this.count !== 'number') {
      throw new Error('Invalid count');
    }
    
    if (!Array.isArray(this.objects)) {
      throw new Error('Objects must be an array');
    }
    
    const validDestinations = ['plastic', 'paper', 'metal', 'organic', 'processing', 'none'];
    if (!validDestinations.includes(this.destination)) {
      throw new Error('Invalid destination');
    }
    
    return true;
  }
  
  toJSON() {
    return {
      count: this.count,
      objects: this.objects,
      destination: this.destination,
      timestamp: this.timestamp
    };
  }
}

module.exports = Detection;
