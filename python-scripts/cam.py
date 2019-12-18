import numpy as np
import cv2
import zmq
import threading
import base64


class Camera:
    def __init__(self):
        context = zmq.Context()

        self.__footage_socket = context.socket(zmq.PUSH)
        self.__footage_socket.bind('tcp://127.0.0.1:5555')

        self.__msg_socket = context.socket(zmq.REP)
        self.__msg_socket.bind('tcp://127.0.0.1:8888')

        self.__run = True

        record_thread = threading.Thread(target=self.record)
        end_rec_thread = threading.Thread(target=self.end_recording)

        record_thread.start()
        end_rec_thread.start()

    def send_products(self):
        self.__msg_socket.send_string()

    def record(self):
        camera = cv2.VideoCapture(0)

        while self.__run:
            grabbed, frame = camera.read()  # grab the current frame
            frame = cv2.resize(frame, (800, 600))  # resize the frame
            encoded, buffer = cv2.imencode('.jpg', frame)
            jpg_as_text = base64.b64encode(buffer)
            self.__footage_socket.send(jpg_as_text)

    def end_recording(self):
        message = self.__msg_socket.recv_string()
        if message == "False":
            self.__run = False


Camera()
