import os
import csv
import sqlite3
from openpyxl import Workbook

def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

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
    print("1. Export CSV")
    print("2. Export Excels")
    print("3. Exit")

    choice = input("\nEnter your choice (1-3): ")

    if choice == '1':
        csv_export()
    elif choice == '2':
        excel_export()
    elif choice == '3':
        print("Exiting...")
        break
    else:
        print("Invalid choice. Please try again.")