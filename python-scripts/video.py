import numpy as np
import cv2
import zmq
import threading
import base64


class Video:
    def __init__(self):
        context = zmq.Context()

        self.__footage_socket = context.socket(zmq.PUSH)
        self.__footage_socket.bind('tcp://127.0.0.1:6666')

        self.__msg_socket = context.socket(zmq.REP)
        self.__msg_socket.bind('tcp://127.0.0.1:8888')

        self.__run = True

        play_vid_thread = threading.Thread(target=self.play_video)
        end_rec_thread = threading.Thread(target=self.end_recording)

        play_vid_thread.start()
        end_rec_thread.start()

    def send_products(self):
        self.__msg_socket.send_string()

    def play_video(self):
        cap = cv2.VideoCapture('videos\IMG_5104.MOV')

        while(self.__run):
            ret, frame = cap.read()
            if ret == True:
                frame = cv2.resize(frame, (800, 600))  # resize the frame
                encoded, buffer = cv2.imencode('.jpg', frame)
                jpg_as_text = base64.b64encode(buffer)
                self.__footage_socket.send(jpg_as_text)

    def end_recording(self):
        message = self.__msg_socket.recv_string()
        if message == "False":
            self.__run = False


Video()

# cap = cv2.VideoCapture('videos\IMG_5104.MOV')
# run = True

# # Check if camera opened successfully
# if (cap.isOpened() == False):
#     print("Error opening video stream or file")

# # Read until video is completed
# while(cap.isOpened() and run):
#     # Capture frame-by-frame
#     ret, frame = cap.read()
#     if ret == True:

#         cv2.namedWindow('Frame', cv2.WINDOW_NORMAL)
#         cv2.resizeWindow('Frame', 700, 400)

#         # Display the resulting frame
#         cv2.imshow('Frame', frame)

#         # Press Q on keyboard to  exit
#         if cv2.waitKey(25) & 0xFF == ord('q'):
#             break

#     # Break the loop
#     else:
#         break

# cap.release()
# cv2.destroyAllWindows()
