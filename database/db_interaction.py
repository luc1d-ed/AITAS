import os
import csv
import random
import sqlite3
from datetime import datetime, timedelta
from openpyxl import Workbook

def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

def students_insertion():
    # Connect to the database (or create it if it doesn't exist)
    conn = sqlite3.connect('aitas_main.db')
    cursor = conn.cursor()

    # List of student names and corresponding photo paths
    student_names = ['Anthony', 'Collin', 'David', 'Duncan', 'Ella', 'Irene', 'Julian', 'Liam', 'Sam', 'Yvonne']  # Add your student names here
    photo_paths = ['photos/Anthony.jpg', 'photos/Collin.jpg', 'photos/David.jpg', 'photos/Duncan.jpg', 'photos/Ella.jpg', 'photos/Irene.jpg', 'photos/Julian.jpg', 'photos/Liam.jpg', 'photos/Sam.jpeg', 'photos/Yvonne.jpg']  # Add your photo paths here

    # Insert data into the table
    for student_id, (name, photo_path) in enumerate(zip(student_names, photo_paths), start=101):
        with open(photo_path, 'rb') as file:
            photo_data = file.read()

        cursor.execute("INSERT INTO Students (StudentID, Name, Photo) VALUES (?, ?, ?)",
                       (student_id, name, photo_data))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    print("Student data inserted successfully.")

def students_check():
    # Connect to the database
    conn = sqlite3.connect('aitas_main.db')
    cursor = conn.cursor()

    # Retrieve specific columns from the students table
    cursor.execute("SELECT StudentID, Name FROM Students")
    rows = cursor.fetchall()

    # Print the retrieved rows
    for row in rows:
        print(row)

    # Close the connection
    conn.close()
    
def generate_attendance_records():
    # Connect to the existing database
    conn = sqlite3.connect('aitas_main.db')
    cursor = conn.cursor()

    # Set the custom start date
    start_date = datetime(2023, 1, 1)  # Example: January 1, 2023
    end_date = start_date + timedelta(days=90)

    # Retrieve the list of student IDs from the Students table
    cursor.execute("SELECT StudentID FROM Students")
    student_ids = [row[0] for row in cursor.fetchall()]

    current_date = start_date
    while current_date <= end_date:
        for student_id in student_ids:
            # Generate random attendance status (0: absent, 1: present)
            status = random.randint(0, 1)
            cursor.execute("INSERT INTO Attendance (StudentID, Date, Status) VALUES (?, ?, ?)", (student_id, current_date.strftime("%d-%m-%Y"), status))
        current_date += timedelta(days=1)

    # Commit the changes and close the database connection
    conn.commit()
    conn.close()

def attendance_check():
    # Connect to the database
    conn = sqlite3.connect('aitas_main.db')
    cursor = conn.cursor()

    # Retrieve all columns from the Attendance table
    cursor.execute("SELECT * FROM Attendance")
    rows = cursor.fetchall()

    # Print the retrieved rowdb to 
    for row in rows:
        print(row)

    # Close the connection
    conn.close()

def csv_export():
    conn = sqlite3.connect('aitas_main.db')
    c = conn.cursor()
    c.execute('SELECT * FROM Attendance')
    data = c.fetchall()

    ensure_dir("exports/")
    with open('exports/aitas.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data)

    print("Data exported to exports/aitas.csv")

def excel_export():
    conn = sqlite3.connect('aitas_main.db')
    c = conn.cursor()
    c.execute('SELECT * FROM Attendance')
    data = c.fetchall()

    wb = Workbook()
    ws = wb.active
    for row in data:
        ws.append(row)

    ensure_dir("exports/")
    wb.save('exports/aitas.xlsx')
    print('Data exported to exports/aitas.xlsx')


while True:
    print("\nMenu:")
    print("1. Insert students")
    print("2. Check students")
    print("3. Generate attendance records")
    print("4. Check attendance")
    print("5. Export CSV")
    print("6. Export Excel")
    print("7. Exit")

    choice = input("\nEnter your choice (1-7): ")

    if choice == '1':
        students_insertion()
    elif choice == '2':
        students_check()
    elif choice == '3':
        generate_attendance_records()
    elif choice == '4':
        attendance_check()
    elif choice == '5':
        csv_export()
    elif choice == '6':
        excel_export()
    elif choice == '7':
        print("Exiting...")
        break
    else:
        print("Invalid choice. Please try again.")