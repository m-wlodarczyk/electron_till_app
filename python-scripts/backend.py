import numpy as np
import cv2
import zmq
import threading
import base64
import os

from random import random


class Camera:
    def __init__(self):
        context = zmq.Context()

        self.__footage_socket = context.socket(zmq.PUB)
        self.__footage_socket.bind('tcp://127.0.0.1:5555')

        self.__msg_socket = context.socket(zmq.REP)
        self.__msg_socket.bind('tcp://127.0.0.1:8888')

        self.__msg_socket_2 = context.socket(zmq.REP)
        self.__msg_socket_2.bind('tcp://127.0.0.1:8889')

        self.__run = True

        self.path = os.getcwd()

        self.products = np.zeros(11)

        end_rec_thread = threading.Thread(target=self.end_recording)
        end_rec_thread.start()

        self.run()

    def record_camera(self):
        self.__run = True
        camera = cv2.VideoCapture(0)

        while self.__run:
            grabbed, frame = camera.read()  # grab the current frame
            frame = cv2.resize(frame, (800, 600))  # resize the frame
            encoded, buffer = cv2.imencode('.jpg', frame)
            jpg_as_text = base64.b64encode(buffer)
            self.__footage_socket.send_multipart([b"video", jpg_as_text])
            self.detect()

    def __to_byte_list(self, np_array):
        l: List[int] = []
        for element in np_array:
            l.append(int(element))
        return bytes(l)

    def detect(self):
        r = random()
        if r < 0.05:
            self.__footage_socket.send_multipart([b'item', b'peanuts 1 5.99'])

    def play_video(self):
        self.__run = True
        vid_path = self.path + "\\videos\\IMG_5104.MOV"
        # cap = cv2.VideoCapture(
        #     'C:\\Users\\mwlodarczyk\\Desktop\\studia\\electron_till_app\\videos\\IMG_5104.MOV')

        cap = cv2.VideoCapture(vid_path)

        while self.__run:
            grabbed, frame = cap.read()
            if grabbed:
                frame = cv2.resize(frame, (800, 600))
                encoded, buffer = cv2.imencode('.jpg', frame)
                jpg_as_text = base64.b64encode(buffer)
                self.__footage_socket.send_multipart([b"video", jpg_as_text])

    def end_recording(self):
        while True:
            message = self.__msg_socket.recv_string()
            if message == "False":
                self.__run = False
                self.__msg_socket.send_string("Ending recording")

    def run(self):
        while True:
            cmd = self.__msg_socket_2.recv_string()
            if cmd == "camera":
                self.__msg_socket_2.send_string("Starting camera")
                self.record_camera()
            elif cmd == "video":
                self.__msg_socket_2.send_string("Playing video")
                self.play_video()


Camera()
