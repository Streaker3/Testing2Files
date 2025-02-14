import http.server
import socketserver
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"Request: {args[0]} {args[1]} {args[2]}")

Handler.extensions_map.update({
    '.js': 'application/javascript',
})

print(f"Starting server on all interfaces, port {PORT}")
print(f"Try accessing: ")
print(f"* http://localhost:{PORT}")
print(f"* http://127.0.0.1:{PORT}")

try:
    with socketserver.TCPServer(("localhost", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server")
            httpd.shutdown()
except OSError as e:
    if "Address already in use" in str(e):
        print(f"Error: Port {PORT} is already in use.")
        print("Please try a different port or stop the process using this port.")
    else:
        print(f"Error starting server: {e}")
    sys.exit(1) 