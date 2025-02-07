import cv2
import face_recognition

def encode_image(image_path):
    img = cv2.imread(image_path)
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_encoding = face_recognition.face_encodings(rgb_img)[0]
    print(f"{image_path} has been encoded")
    return img_encoding

def compare_faces(img_encoding1, img_encoding2):
    results = face_recognition.compare_faces([img_encoding1], img_encoding2)
    if results[0]:
        print("They are the same person")
    else:
        print("They are different persons")

img_encoding = encode_image("face_recognition/images/Sergio_Canu.jpg")
img_encoding2 = encode_image("face_recognition/images/Liam.jpg")

compare_faces(img_encoding, img_encoding2)