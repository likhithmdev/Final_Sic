"""
Laptop-side script (prototype)
------------------------------

- Uses a face-recognition model to identify who is at the bin
- Logs that user into the Smart AI Bin backend
- Calls /api/rewards/check-in so Pi detections auto-credit their account

NOTE:
- You still need to implement the actual face recognition in `recognize_person(frame)`
- Install requirements on the laptop:
    pip install opencv-python face_recognition requests
"""

import time
from typing import Optional

import cv2
import requests

# === CONFIGURE THIS FOR YOUR SERVER ===
# If server runs on the same laptop: "http://localhost:3000/api"
# If it's on another machine: "http://<server-ip>:3000/api"
API_BASE = "http://localhost:3000/api"

# Map recognized person names -> login credentials in your system
USER_MAP = {
    "sanjay": {"email": "sanjay@01", "password": "123456"},
    "prekshith": {"email": "prekshith@02", "password": "123456"},
    "mourya": {"email": "mourya@03", "password": "123456"},
    "koushik": {"email": "koushik@04", "password": "123456"},
}


def login_and_check_in(person_key: str) -> None:
    """Log in as the given user and call /rewards/check-in."""
    creds = USER_MAP[person_key]

    # 1) Login
    r = requests.post(f"{API_BASE}/auth/login", json={
        "email": creds["email"],
        "password": creds["password"],
    })
    r.raise_for_status()
    data = r.json()
    token = data["token"]

    # 2) Check in
    r2 = requests.post(
        f"{API_BASE}/rewards/check-in",
        headers={"Authorization": f"Bearer {token}"},
    )
    r2.raise_for_status()

    print(f"[INFO] Checked in as {person_key} ({creds['email']})")


def recognize_person(frame) -> Optional[str]:
    """
    TODO: Implement real face recognition here.

    This function should:
      - Detect faces in `frame`
      - Compare against stored encodings for your 4 users
      - Return one of: 'sanjay', 'prekshith', 'mourya', 'koushik'
        or None if no confident match

    For now this is a stub that always returns None.
    """
    # Example stub: always return None (no detection)
    return None


def main():
    print("[INFO] Starting laptop face check-in prototype")
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("[ERROR] Cannot open camera")
        return

    current_user: Optional[str] = None

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("[WARN] Failed to grab frame")
                time.sleep(0.1)
                continue

            # Resize for faster processing if needed
            small = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)

            person = recognize_person(small)

            if person and person in USER_MAP:
                if person != current_user:
                    # New person recognized -> check them in
                    try:
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

