import os
import cv2
import json
from simple_facerec import SimpleFacerec

# Check if detected_list.json exists
if os.path.isfile('front_end/detected_list.json'):
    # Delete the existing detected_list.json
    os.remove('front_end/detected_list.json')
    print('Deleted previous detected_list.json')
    
# Encode faces from a folder
sfr = SimpleFacerec()
sfr.load_encoding_images("face_recognition/images/")

# Load Camera
cap = cv2.VideoCapture(0)

# Initialize an empty dictionary to store face names
face_names_dict = {}

# Load existing face names from JSON file if it exists
try:
    with open('front_end/detected_list.json', 'r') as f:
        face_names_dict = json.load(f)
        print('Created new detected_list.json')
except FileNotFoundError:
    pass

while True:
    ret, frame = cap.read()

    #Resize the frame
    frame = cv2.resize(frame, (640, 480))
    
    # Detect Faces
    face_locations, face_names = sfr.detect_known_faces(frame)
    print("Face Locations:", face_locations)
    print("Face Names:", face_names)

    for face_loc, name in zip(face_locations, face_names):
        y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]

        if name != "Unknown":
            cv2.putText(frame, name,(x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 255, 0), 2)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 0), 4)
        else:
            cv2.putText(frame, name,(x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 2)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)

        if name != "Unknown" and name not in face_names_dict:
            face_names_dict[name] = True  # Add face name to dictionary
            with open('face_recognition/detected_list.json', 'w') as f:
                json.dump(face_names_dict, f)  # Write dictionary to JSON file

    cv2.imshow("Frame", frame)

    key = cv2.waitKey(1)
    if key == 27:
        break

cap.release()
cv2.destroyAllWindows()
