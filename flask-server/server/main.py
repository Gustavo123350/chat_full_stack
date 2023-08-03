from flask import Flask, render_template
from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(message):
    print('Received message:', message)
    emit('message', message, broadcast=True)


@app.route('/websocket')
def websocket():
    # Accept the WebSocket connection
    websocket = request.environ.get('wsgi.websocket')

    if websocket:
        while True:
            message = websocket.receive()
            if message is not None:
                # Do something with the received message
                print('Received message:', message)
                # You can send a response back to the client if needed
                # websocket.send('Server received: ' + message)
    else:
        raise ValueError('Failed to establish WebSocket connection.')

if __name__ == '__main__':
    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
    socketio.run(app)
