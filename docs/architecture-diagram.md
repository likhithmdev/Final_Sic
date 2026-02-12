# System Architecture

## Overview
Smart AI Waste Segregation System using Edge AI, IoT sensors, and real-time dashboard.

## Architecture Flow

```
┌─────────────────┐
│  Raspberry Pi   │
│   (Edge AI)     │
│                 │
│  ┌──────────┐   │
│  │  Camera  │   │
│  └────┬─────┘   │
│       │         │
│  ┌────▼─────┐   │
│  │  YOLOv8  │   │
│  │ Detection│   │
│  └────┬─────┘   │
│       │         │
│  ┌────▼─────┐   │
│  │  Servo   │   │
│  │ Control  │   │
│  └──────────┘   │
│       │         │
│  ┌────▼─────┐   │
│  │ Sensors  │   │
│  └──────────┘   │
└────────┬────────┘
         │
         │ MQTT
         │
    ┌────▼────┐
    │  MQTT   │
    │ Broker  │
    └────┬────┘
         │
    ┌────▼────────┐
    │   Node.js   │
    │   Server    │
    │             │
    │  ┌────────┐ │
    │  │  MQTT  │ │
    │  │Service │ │
    │  └───┬────┘ │
    │      │      │
    │  ┌───▼────┐ │
    │  │Socket  │ │
    │  │  .IO   │ │
    │  └───┬────┘ │
    └──────┬──────┘
           │
           │ WebSocket
           │
    ┌──────▼──────┐
    │   React     │
    │  Dashboard  │
    │             │
    │  Live Feed  │
    │  Detection  │
    │  Bin Status │
    │  Statistics │
    └─────────────┘
```

## Components

### 1. Raspberry Pi (Edge Device)
- **Detection Module**: YOLOv8 object detection
- **Hardware Control**: Servo motors, sensors
- **MQTT Publisher**: Sends detection results

### 2. Node.js Server
- **MQTT Subscriber**: Receives data from Pi
- **WebSocket Server**: Real-time updates to clients
- **REST API**: Statistics and history endpoints

### 3. React Dashboard
- **Live Feed**: Camera feed visualization
- **Detection Display**: Real-time object detection
- **Bin Monitoring**: Fill level tracking
- **Statistics**: Analytics and trends

## Data Flow

1. IR Sensor detects object
2. Camera captures frame
3. YOLO runs detection
4. Servo rotates to correct bin
5. Detection data published to MQTT
6. Server receives and processes data
7. Dashboard updates in real-time

## Communication Protocols

- **MQTT**: Raspberry Pi ↔ Server
- **WebSocket**: Server ↔ Dashboard
- **REST API**: Dashboard ↔ Server (stats)

## Detection Logic

### Single Object
- Direct routing to appropriate bin
- Servo rotates to bin angle

### Multiple Objects
- Route to processing chamber
- Sequential segregation
- Individual bin sorting

## Technologies

- **Edge AI**: Python, YOLOv8, OpenCV
- **Backend**: Node.js, Express, MQTT, Socket.IO
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Hardware**: Raspberry Pi, Servos, Ultrasonic, IR sensors
