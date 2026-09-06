"""
Simple HTTP server to serve config.json for frontend
Run this script to serve the config.json file on port 8001
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import json

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Content-Type', 'application/json')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/config.json':
            try:
                config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')
                if not os.path.exists(config_path):
                    self.send_error(404, "config.json not found")
                    return
                
                with open(config_path, 'r', encoding='utf-8') as f:
                    config_data = json.load(f)
                
                # Validate config structure
                if not isinstance(config_data, list):
                    self.send_error(500, "Invalid config.json: expected array")
                    return
                
                # Log request
                print(f"[{self.log_date_time_string()}] GET /config.json - {len(config_data)} devices")
                
                self.send_response(200)
                self.end_headers()
                self.wfile.write(json.dumps(config_data).encode('utf-8'))
            except json.JSONDecodeError as e:
                self.send_error(500, f"Invalid JSON in config.json: {str(e)}")
            except Exception as e:
                self.send_error(500, f"Error reading config.json: {str(e)}")
        else:
            self.send_error(404, "File not found")

    def log_message(self, format, *args):
        # Custom logging to show requests
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == '__main__':
    port = 8001
    server_address = ('', port)
    
    # Verify config.json exists
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')
    if not os.path.exists(config_path):
        print(f"ERROR: config.json not found at {config_path}")
        print("Please make sure config.json exists in the same directory as this script")
        exit(1)
    
    # Validate config.json is valid JSON
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config_data = json.load(f)
        if not isinstance(config_data, list):
            print("ERROR: config.json must be an array of devices")
            exit(1)
        print(f"Valid config.json found with {len(config_data)} devices")
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in config.json: {e}")
        exit(1)
    except Exception as e:
        print(f"ERROR: Could not read config.json: {e}")
        exit(1)
    
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print(f"\n{'='*60}")
    print(f"Config Server running on http://localhost:{port}")
    print(f"Serving config.json from: {os.path.dirname(os.path.abspath(__file__))}")
    print(f"{'='*60}")
    print("Press Ctrl+C to stop the server\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped")
        httpd.shutdown()

