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

while True:
    print("\nMenu:")
    print("1. Insert data")
    print("2. Check data")
    print("3. Exit")

    choice = input("Enter your choice (1-3): ")

    if choice == '1':
        data_insertion()
    elif choice == '2':
        check_data()
    elif choice == '3':
        print("Exiting...")
        break
    else:
        print("Invalid choice. Please try again.")