# Waste Categories Guide

## 🗑️ Waste Classification

This system categorizes waste into **3 main types**:

### 1. Dry Waste 💧
**Color**: Blue (#60a5fa)
**Icon**: 🗑️
**Servo Angle**: 60°
**Ultrasonic**: GPIO 23 (Trigger), GPIO 24 (Echo)

**Includes**:
- Paper and cardboard
- Plastic bottles and containers
- Metal cans and foil
- Glass bottles and jars
- Tetra packs
- Thermocol/Styrofoam
- Cloth and fabric
- Rubber items

**Examples**: Newspapers, plastic bags, tin cans, broken glass, old clothes

---

### 2. Wet Waste 🥬
**Color**: Green (#22c55e)
**Icon**: 🥬
**Servo Angle**: 120°
**Ultrasonic**: GPIO 25 (Trigger), GPIO 8 (Echo)

**Includes**:
- Food waste
- Vegetable/fruit peels
- Leftover food
- Garden waste
- Leaves and grass clippings
- Tea bags and coffee grounds
- Eggshells
- Biodegradable materials

**Examples**: Banana peels, cooked rice, rotten vegetables, plant cuttings

---

### 3. Electronic Waste ⚡
**Color**: Orange (#f97316)
**Icon**: ⚡
**Servo Angle**: 180°
**Ultrasonic**: GPIO 7 (Trigger), GPIO 1 (Echo)

**Includes**:
- Mobile phones
- Chargers and cables
- Batteries (all types)
- Computer parts
- LED/CFL bulbs
- Small appliances
- Circuit boards
- Electronic toys

**Examples**: Old phones, laptop batteries, USB cables, broken remotes

---

## 🔄 Processing Chamber
**Servo Angle**: 0°
**Ultrasonic**: GPIO 20 (Trigger), GPIO 21 (Echo)

Activated when **multiple objects** from different categories are detected together.

---

## 🎯 YOLO Model Training

Update your dataset labels:
- **Class 0**: Dry waste
- **Class 1**: Wet waste
- **Class 2**: Electronic waste

### Dataset Structure
```
dataset/
├── train/
│   ├── images/
│   └── labels/  # YOLO format: class x_center y_center width height
├── val/
└── test/
```

### Training Command
```bash
yolo detect train data=dataset/data.yaml model=yolov8n.pt epochs=100 imgsz=640
```

---

## 📊 Why These Categories?

1. **Dry Waste**: Recyclable materials that can be reprocessed
2. **Wet Waste**: Biodegradable organic matter for composting
3. **Electronic Waste**: Hazardous materials requiring special disposal

This follows **Indian waste management rules** and is easier to implement with fewer bins while maintaining effective segregation.
