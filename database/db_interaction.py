import sqlite3

def data_insertion():
    # Connect to the database (or create it if it doesn't exist)
    conn = sqlite3.connect('aitas_main.db')
    cursor = conn.cursor()

    with open('photo.jpg', 'rb') as file:
        photo_data = file.read()

    # Insert data into the table
    cursor.execute("INSERT INTO students (index_number, name, photo, date, state) VALUES (?, ?, ?, ?, ?)",
                   (1, 'John Doe', photo_data, '2023-04-01', 'present'))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    print("Data inserted successfully.")

def check_data():
    # Connect to the database
    conn = sqlite3.connect('aitas_main.db')
    cursor = conn.cursor()

    # Retrieve all rows from the students table
    cursor.execute("SELECT * FROM students")
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