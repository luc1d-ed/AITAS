import sqlite3

def data_insertion():
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
    print("Data inserted successfully.")


def check_data():
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


def insert_status():
    # Connect to the database
    conn = sqlite3.connect('aitas_main.db')
    cursor = conn.cursor()

    date = '2023-04-07'  # Specify the date
    status_list = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1]  # Add the status for each student (1 for present, 0 for absent)

    # Get the list of StudentIDs from the Students table
    cursor.execute("SELECT StudentID FROM Students")
    student_ids = [row[0] for row in cursor.fetchall()]

    for student_id, status in zip(student_ids, status_list):
        cursor.execute("INSERT INTO Attendance (StudentID, Date, Status) VALUES (?, ?, ?)",
                       (student_id, date, status))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    print("Status inserted successfully.")


def check_status():
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


while True:
    print("\nMenu:")
    print("1. Insert students")
    print("2. Check students")
    print("3. Insert attendance")
    print("4. Check attendance")
    print("5. Exit")

    choice = input("\nEnter your choice (1-5): ")

    if choice == '1':
        data_insertion()
    elif choice == '2':
        check_data()
    elif choice == '3':
        insert_status()
    elif choice == '4':
        check_status()
    elif choice == '5':
        print("Exiting...")
        break
    else:
        print("Invalid choice. Please try again.")