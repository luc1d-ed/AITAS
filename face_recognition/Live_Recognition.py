import cv2
import sqlite3
import numpy as np
from datetime import date
from simple_facerec import SimpleFacerec

# Encode faces from a folder
sfr = SimpleFacerec()

# Load Camera
cap = cv2.VideoCapture(0)

# Database connection details
db_file = '../database/aitas_main.db'

try:
    # Connect to the database
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    print(f"Successfully connected to the database: {db_file}")
    
    # Retrieve the images from the database
    cursor.execute("SELECT StudentID, Photo FROM Students")
    results = cursor.fetchall()
    
    # Load the images and encode them
    for result in results:
        student_id, photo_data = result
        nparr = np.frombuffer(photo_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        sfr.load_encoding_image(img, student_id)

    # Get today's date
    today = date.today().strftime("%d-%m-%Y")
    
    while True:
        ret, frame = cap.read()

        # Resize the frame
        frame = cv2.resize(frame, (640, 480))

        # Detect Faces
        face_locations, face_names = sfr.detect_known_faces(frame)
        print("Face Locations:", face_locations)
        print("Face Names:", face_names)

        for face_loc, name in zip(face_locations, face_names):
            y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]

            cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 2)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)

            # Retrieve the StudentID based on the student's name
            cursor.execute("SELECT StudentID FROM Students WHERE Name = ?", (name,))
            result = cursor.fetchone()
            
            if result:
                student_id = result[0]
                
                # Update the Attendance table
                cursor.execute("UPDATE Attendance SET Status = 1 WHERE StudentID = ? AND Date = ?", (student_id, today))
                conn.commit()

        cv2.imshow("Frame", frame)

        key = cv2.waitKey(1)
        if key == 27:
            break

except sqlite3.Error as e:
    print(f"Error connecting to the database: {e}")

finally:
    # Release the camera and close windows
    cap.release()
    cv2.destroyAllWindows()
    
    # Close the database connection
    if conn:
        conn.close()
        print("Database connection closed.")