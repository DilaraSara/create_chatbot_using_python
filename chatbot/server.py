from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import json
from chatbot import predict_class, get_response, intents

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'

        try:
            file_path = os.getcwd() + self.path
            with open(file_path, 'rb') as file:
                if self.path.endswith('.html'):
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                elif self.path.endswith('.css'):
                    self.send_response(200)
                    self.send_header('Content-type', 'text/css')
                elif self.path.endswith('.js'):
                    self.send_response(200)
                    self.send_header('Content-type', 'application/javascript')
                elif self.path.endswith('.png'):
                    self.send_response(200)
                    self.send_header('Content-type', 'image/png')
                self.end_headers()
                self.wfile.write(file.read())
        except FileNotFoundError:
            self.send_error(404, 'File Not Found: %s' % self.path)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        message = data['message']
        try:
            prediction = predict_class(message)
            response = get_response(prediction, intents)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'response': response}).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, addr="localhost", port=8000):
    server_address = (addr, port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on http://{addr}:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
