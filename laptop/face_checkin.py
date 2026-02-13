"""
Laptop-side Face Recognition Check-in System
----------------------------------------------

This script:
- Uses face recognition to identify users at the bin
- Automatically logs them in and checks them in via the Smart Bin API
- Publishes check-in status so users earn points for waste disposal
- Works alongside the Raspberry Pi waste detection system

SETUP INSTRUCTIONS:
1. Install face_recognition and opencv:
   pip install opencv-python face_recognition numpy requests python-dotenv

2. Create a 'faces' directory with subdirectories for each user:
   faces/
   ├── sanjay/
   │   ├── photo1.jpg
   │   ├── photo2.jpg
   │   └── ...
   ├── prekshith/
   │   ├── photo1.jpg
   │   └── ...
   └── ... (other users)

3. Set API_BASE URL to match your server

4. Update USER_CREDENTIALS with your actual user credentials

5. Run: python face_checkin.py

USAGE:
- Position face in frame to check in
- System will recognize and automatically log you in
- You'll have 30 seconds to position waste before needing re-authentication
- Press 'q' to quit
"""

import time
import os
from pathlib import Path
from typing import Optional, Dict
import json

import cv2
import face_recognition
import requests
import numpy as np

# === CONFIGURE THIS FOR YOUR SERVER ===
# If server runs on the same laptop: "http://localhost:3000/api"
# If it's on another machine: "http://<server-ip>:3000/api"
API_BASE = os.getenv('SMART_BIN_API', 'http://localhost:3000/api')

# === USER CREDENTIALS ===
# Map recognized person names -> login credentials in your system
USER_CREDENTIALS = {
    "sanjay": {"email": "sanjay@01", "password": "123456"},
    "prekshith": {"email": "prekshith@02", "password": "123456"},
    "mourya": {"email": "mourya@03", "password": "123456"},
    "koushik": {"email": "koushik@04", "password": "123456"},
}

# Check-in timeout: how long before user needs to scan again (seconds)
CHECKIN_TIMEOUT = 30

# Face recognition tolerance (lower = stricter)
FACE_RECOGNITION_TOLERANCE = 0.6


class FaceCheckInSystem:
    """Manages face recognition and user check-in"""
    
    def __init__(self):
        self.known_face_encodings: Dict[str, list] = {}
        self.known_face_names: Dict[str, str] = {}
        self.current_user: Optional[str] = None
        self.current_token: Optional[str] = None
        self.last_checkin_time: Optional[float] = None
        
        print("[INFO] Initializing face recognition system...")
        self._load_known_faces()
        print(f"[INFO] Loaded faces for {len(self.known_face_encodings)} users")
    
    def _load_known_faces(self):
        """Load face encodings from faces directory"""
        faces_dir = Path('faces')
        
        if not faces_dir.exists():
            print(f"[WARN] {faces_dir} directory not found. Creating...")
            faces_dir.mkdir(exist_ok=True)
            for username in USER_CREDENTIALS.keys():
                (faces_dir / username).mkdir(exist_ok=True)
            print(f"[WARN] Please add face photos to {faces_dir}/username/ directories")
            return
        
        for person_dir in faces_dir.iterdir():
            if not person_dir.is_dir():
                continue
            
            person_name = person_dir.name
            if person_name not in USER_CREDENTIALS:
                continue
            
            face_encodings = []
            image_count = 0
            
            for image_path in person_dir.glob('*.jpg'):
                try:
                    image = face_recognition.load_image_file(str(image_path))
                    encodings = face_recognition.face_encodings(image)
                    if encodings:
                        face_encodings.extend(encodings)
                        image_count += 1
                except Exception as e:
                    print(f"[WARN] Failed to load {image_path}: {e}")
            
            if face_encodings:
                self.known_face_encodings[person_name] = face_encodings
                print(f"[✓] Loaded {image_count} images for {person_name}")
            else:
                print(f"[!] No valid face encodings found for {person_name}")
    
    def recognize_person(self, frame) -> Optional[str]:
        """
        Detect and recognize faces in frame
        
        Returns:
            Person name if recognized, None otherwise
        """
        # Resize for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        
        try:
            # Find all faces and encodings
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
            
            if not face_encodings:
                return None
            
            # Compare with known faces
            for face_encoding in face_encodings:
                best_match = None
                best_distance = float('inf')
                
                for person_name, known_encodings in self.known_face_encodings.items():
                    distances = face_recognition.face_distance(known_encodings, face_encoding)
                    min_distance = np.min(distances)
                    
                    if min_distance < best_distance:
                        best_distance = min_distance
                        best_match = person_name
                
                # If match is within tolerance, return person name
                if best_distance < FACE_RECOGNITION_TOLERANCE:
                    return best_match
            
            return None
            
        except Exception as e:
            print(f"[ERROR] Face recognition error: {e}")
            return None
    
    def login_and_check_in(self, person_key: str) -> bool:
        """
        Log in user and check them in via API
        
        Returns:
            True if successful, False otherwise
        """
        if person_key not in USER_CREDENTIALS:
            print(f"[ERROR] Unknown user: {person_key}")
            return False
        
        try:
            creds = USER_CREDENTIALS[person_key]
            
            # 1) Login to get token
            print(f"[...] Logging in {person_key}...")
            response = requests.post(
                f"{API_BASE}/auth/login",
                json={"email": creds["email"], "password": creds["password"]},
                timeout=5
            )
            response.raise_for_status()
            data = response.json()
            
            if not data.get('success'):
                print(f"[ERROR] Login failed: {data.get('message', 'Unknown error')}")
                return False
            
            token = data.get('token')
            if not token:
                print("[ERROR] No token received from server")
                return False
            
            # 2) Check in (set as active user)
            print(f"[...] Checking in {person_key}...")
            response = requests.post(
                f"{API_BASE}/rewards/check-in",
                headers={"Authorization": f"Bearer {token}"},
                timeout=5
            )
            response.raise_for_status()
            
            print(f"[✓] Checked in as {person_key}")
            self.current_user = person_key
            self.current_token = token
            self.last_checkin_time = time.time()
            
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] API request failed: {e}")
            return False
        except Exception as e:
            print(f"[ERROR] Check-in failed: {e}")
            return False
    
    def check_out(self) -> bool:
        """Check out current user"""
        if not self.current_user or not self.current_token:
            return False
        
        try:
            response = requests.post(
                f"{API_BASE}/rewards/check-out",
                headers={"Authorization": f"Bearer {self.current_token}"},
                timeout=5
            )
            response.raise_for_status()
            
            print(f"[✓] Checked out: {self.current_user}")
            self.current_user = None
            self.current_token = None
            self.last_checkin_time = None
            
            return True
        except Exception as e:
            print(f"[WARN] Check-out failed: {e}")
            return False
    
    def is_checkin_expired(self) -> bool:
        """Check if check-in timeout has expired"""
        if not self.last_checkin_time:
            return False
        
        elapsed = time.time() - self.last_checkin_time
        return elapsed > CHECKIN_TIMEOUT


def main():
    """Main application loop"""
    print("[INFO] Starting Smart Bin Face Check-In System")
    print(f"[*] API Endpoint: {API_BASE}")
    print(f"[*] Press 'q' to quit\n")
    
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("[ERROR] Cannot open camera. Make sure a webcam is connected.")
        return
    
    system = FaceCheckInSystem()
    
    if not system.known_face_encodings:
        print("[ERROR] No face encodings loaded. Please add training images to faces/ directory")
        cap.release()
        return
    
    frame_count = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("[WARN] Failed to read frame")
                time.sleep(0.1)
                continue
            
            frame_count += 1
            
            # Process every 3rd frame for better performance
            if frame_count % 3 == 0:
                person = system.recognize_person(frame)
                
                # Auto check-in if new person recognized
                if person and person != system.current_user:
                    system.login_and_check_in(person)
                
                # Auto check-out if timeout expired
                if system.current_user and system.is_checkin_expired():
                    print(f"[*] Check-in timeout for {system.current_user}")
                    system.check_out()
            
            # Display status on frame
            status_text = ""
            status_color = (0, 0, 255)  # Red default
            
            if system.current_user:
                elapsed = time.time() - system.last_checkin_time
                remaining = max(0, CHECKIN_TIMEOUT - elapsed)
                status_text = f"✓ Checked in: {system.current_user} ({remaining:.0f}s)"
                status_color = (0, 255, 0)  # Green
            else:
                status_text = "Looking for face..."
                status_color = (0, 165, 255)  # Orange
            
            cv2.putText(
                frame,
                status_text,
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.0,
                status_color,
                2,
            )
            
            # Show frame
            cv2.imshow("Smart Bin Face Check-In", frame)
            
            if cv2.waitKey(1) & 0xFF == ord("q"):
                print("[*] Quitting...")
                if system.current_user:
                    system.check_out()
                break
    
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Face check-in system stopped")


if __name__ == "__main__":
    main()

                        login_and_check_in(person)
                        current_user = person
                    except Exception as e:
                        print(f"[ERROR] Failed to check in {person}: {e}")

                cv2.putText(
                    frame,
                    f"Recognized: {person}",
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    (0, 255, 0),
                    2,
                )
            else:
                cv2.putText(
                    frame,
                    "No known user",
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.0,
                    (0, 0, 255),
                    2,
                )

            cv2.imshow("Face Check-In", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Exiting")


if __name__ == "__main__":
    main()

