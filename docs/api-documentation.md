# API Documentation

## REST API Endpoints

Base URL: `http://localhost:3000`

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-02-11T12:00:00Z"
}
```

### Get Statistics
```
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDetections": 42,
    "byClass": {
      "dry": 15,
      "wet": 12,
      "electronic": 8
    },
    "multiObjectEvents": 3,
    "processingChamberUsage": 3,
    "processingChamberPercentage": "7.1"
  }
}
```

### Get Detection History
```
GET /api/history?limit=10
```

**Query Parameters:**
- `limit` (optional): Number of records (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "count": 2,
      "objects": [
        {"class": "dry", "confidence": 0.91},
        {"class": "electronic", "confidence": 0.85}
      ],
      "destination": "processing",
      "timestamp": "2026-02-11T12:00:00Z"
    }
  ]
}
```

### Clear History
```
POST /api/history/clear
```

**Response:**
```json
{
  "success": true,
  "message": "History cleared"
}
```

### Reset Statistics
```
POST /api/stats/reset
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics reset"
}
```

## WebSocket Events

### Client → Server

**Request Status**
```javascript
socket.emit('request_status');
```

### Server → Client

**Connected**
```javascript
socket.on('connected', (data) => {
  // { message: "Connected to Smart Bin System", timestamp: "..." }
});
```

**Detection Update**
```javascript
socket.on('detectionUpdate', (data) => {
  // {
  //   count: 2,
  //   objects: [...],
  //   destination: "processing",
  //   timestamp: "..."
  // }
});
```

**Bin Status**
```javascript
socket.on('binStatus', (data) => {
  // {
  //   levels: {
  //     plastic: 45.2,
  //     paper: 67.8,
  //     metal: 23.1,
  //     organic: 89.5,
  //     processing: 12.0
  //   },
  //   timestamp: "..."
  // }
});
```

**System Status**
```javascript
socket.on('systemStatus', (data) => {
  // {
  //   status: "ready",
  //   message: "System online",
  //   timestamp: "..."
  // }
});
```

**Alert**
```javascript
socket.on('alert', (data) => {
  // { message: "plastic bin is full", timestamp: "..." }
});
```

## MQTT Topics

### Published by Raspberry Pi

**Detection Results**
```
Topic: smartbin/detection
Payload: {
  "count": 2,
  "objects": [
    {"class": "dry", "confidence": 0.91},
    {"class": "electronic", "confidence": 0.85}
  ],
  "destination": "processing",
  "timestamp": "2026-02-11T12:00:00Z"
}
```

**Bin Status**
```
Topic: smartbin/bin_status
Payload: {
  "levels": {
    "dry": 45.2,
    "wet": 67.8,
    "electronic": 23.1,
    "processing": 12.0
  },
  "timestamp": "2026-02-11T12:00:00Z"
}
```

**System Status**
```
Topic: smartbin/system
Payload: {
  "status": "ready|processing|error|shutdown",
  "message": "System online",
  "timestamp": "2026-02-11T12:00:00Z"
}
```

## Error Codes

- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error
