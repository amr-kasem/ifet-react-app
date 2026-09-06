"""
MQTT Simulator for Device 3
Simulates device3 by publishing sensor readings, valve status, VFD feedback, and device status
Subscribes to command topics to receive control commands from frontend
"""
import paho.mqtt.client as mqtt
import json
import time
import random
import threading
import os
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [DEVICE3] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)
from datetime import datetime

def log(message, level="INFO"):
    """Logging function with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [{level}] Device3: {message}")

# Device configuration
DEVICE_ID = 3
MQTT_BROKER = "localhost"  # Change to your MQTT broker IP
MQTT_PORT = 1883
MQTT_KEEPALIVE = 60

# Device state
device_state = {
    "status": "idle",
    "current_speed": 0,
    "current_test_index": 0,
    "valves": {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0
    },
    "sensors": {
        "1": 0.0,
        "2": 0.0,
        "3": 0.0,
        "11": 0.0  # Flow sensor
    }
}

# Load device config to get sensor/valve info
def load_device_config():
    """Load device configuration from config.json"""
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')
    log(f"Loading config from: {config_path}")
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
        log(f"Config loaded: {len(config)} devices found")
        for device in config:
            if device.get('device_id') == f'device{DEVICE_ID}':
                sensors_count = len(device.get('sensors', []))
                valves_count = len(device.get('valves', []))
                log(f"Device {DEVICE_ID} config found: {sensors_count} sensors, {valves_count} valves")
                return device
        log(f"Device {DEVICE_ID} not found in config.json", "WARNING")
        return None
    except Exception as e:
        log(f"Could not load config.json: {e}", "ERROR")
        return None

device_config = load_device_config()

# MQTT Client - will be initialized after function definitions
client = None

def on_connect(client, userdata, flags, rc):
    """Callback when connected to MQTT broker"""
    if rc == 0:
        log(f"Connected to MQTT broker successfully (rc={rc})")
        
        # Subscribe to command topics
        subscribe_topics = [
            f"device{DEVICE_ID}/valves/+",  # Subscribe to all valve commands
            f"device{DEVICE_ID}/vfd/command",
            f"device{DEVICE_ID}/command",
            f"device{DEVICE_ID}/emergency_stop"
        ]
        
        log(f"Subscribing to {len(subscribe_topics)} topics...")
        for topic in subscribe_topics:
            result = client.subscribe(topic, qos=1)
            log(f"Subscribed to: {topic} (mid={result[1]})")
        
        # Publish initial status
        log("Publishing initial status...")
        publish_initial_status()
        log("Initial status published")
    else:
        log(f"Failed to connect to MQTT broker, return code {rc}", "ERROR")

def on_message(client, userdata, msg):
    """Callback when message is received"""
    topic = msg.topic
    payload = msg.payload.decode('utf-8')
    
    log(f"Message received - Topic: {topic}, Payload: {payload}")
    
    # Handle valve commands
    if topic.startswith(f"device{DEVICE_ID}/valves/"):
        valve_name = topic.split('/')[-1]
        try:
            value = int(json.loads(payload))
            if valve_name in device_state["valves"]:
                device_state["valves"][valve_name] = value
                log(f"Valve {valve_name} set to {value}")
                # Publish updated valve status
                publish_valve_status()
            else:
                log(f"Valve {valve_name} not found in device state", "WARNING")
        except Exception as e:
            log(f"Error processing valve command: {e}", "ERROR")
    
    # Handle VFD command
    elif topic == f"device{DEVICE_ID}/vfd/command":
        try:
            cmd = json.loads(payload)
            if cmd.get("command") == "set_frequency":
                speed = cmd.get("parameter", 0)
                device_state["current_speed"] = speed
                log(f"VFD speed set to {speed}")
                # Publish VFD feedback
                publish_vfd_feedback()
            else:
                log(f"Unknown VFD command: {cmd.get('command')}", "WARNING")
        except Exception as e:
            log(f"Error processing VFD command: {e}", "ERROR")
    
    # Handle test command
    elif topic == f"device{DEVICE_ID}/command":
        try:
            cmd = json.loads(payload)
            if cmd.get("command") == "start":
                mode = cmd.get("mode", "manual")
                device_state["status"] = "running" if mode == "cyclic" else "tuning"
                log(f"Test started: mode={mode}, status={device_state['status']}")
                publish_status()
            else:
                log(f"Unknown test command: {cmd.get('command')}", "WARNING")
        except Exception as e:
            log(f"Error processing test command: {e}", "ERROR")
    
    # Handle emergency stop
    elif topic == f"device{DEVICE_ID}/emergency_stop":
        device_state["status"] = "idle"
        device_state["current_speed"] = 0
        log("Emergency stop activated")
        publish_status()
        publish_vfd_feedback()

def on_disconnect(client, userdata, rc):
    """Callback when disconnected from MQTT broker"""
    log(f"Disconnected from MQTT broker (rc={rc})")

def publish_status():
    """Publish device status"""
    topic = f"device{DEVICE_ID}/status"
    payload = device_state["status"]
    result = client.publish(topic, payload, qos=1, retain=False)
    log(f"Published status - Topic: {topic}, Payload: {payload}, Mid: {result.mid}")

def publish_sensor_readings():
    """Publish sensor readings periodically"""
    if not device_config:
        log("Device config not loaded, skipping sensor readings", "WARNING")
        return
    
    sensors = device_config.get("sensors", [])
    log(f"Publishing readings for {len(sensors)} sensors")
    for sensor in sensors:
        if sensor.get("active", True):
            address = sensor.get("address")
            if address:
                # Simulate sensor reading (pressure sensors: 0-100, flow: 0-50)
                if sensor.get("role") == "pressure":
                    value = round(random.uniform(0, 100), 2)
                elif sensor.get("role") == "flow":
                    value = round(random.uniform(0, 50), 2)
                else:
                    value = round(random.uniform(0, 100), 2)
                
                device_state["sensors"][address] = value
                topic = f"device{DEVICE_ID}/sensors/{address}"
                result = client.publish(topic, str(value), qos=1, retain=False)
                log(f"Published sensor - Topic: {topic}, Value: {value}, Mid: {result.mid}")

def publish_valve_status():
    """Publish valve status"""
    topic = f"device{DEVICE_ID}/valves/status"
    # Convert valve names to match frontend expectations
    valves_status = {}
    if device_config:
        valves = device_config.get("valves", [])
        for valve in valves:
            valve_name = valve.get("name")
            if valve_name:
                # Use valve name directly (e.g., "1", "2", "3", "4")
                valves_status[valve_name] = device_state["valves"].get(valve_name, 0)
    else:
        # Fallback if config not loaded - use numeric strings
        valves_status = {str(i): device_state["valves"].get(str(i), 0) for i in range(1, 5)}
    
    payload = json.dumps(valves_status)
    result = client.publish(topic, payload, qos=1, retain=False)
    log(f"Published valve status - Topic: {topic}, Payload: {payload}, Mid: {result.mid}")

def publish_vfd_feedback():
    """Publish VFD speed feedback"""
    topic = f"device{DEVICE_ID}/vfd/feedback"
    payload = str(device_state["current_speed"])
    result = client.publish(topic, payload, qos=1, retain=False)
    log(f"Published VFD feedback - Topic: {topic}, Payload: {payload}, Mid: {result.mid}")

def publish_current_test_index():
    """Publish current test index"""
    topic = f"device{DEVICE_ID}/current_test_index"
    payload = str(device_state["current_test_index"])
    result = client.publish(topic, payload, qos=1, retain=False)
    log(f"Published test index - Topic: {topic}, Payload: {payload}, Mid: {result.mid}")

def publish_initial_status():
    """Publish initial device status"""
    logger.info("Publishing initial status messages...")
    publish_status()
    time.sleep(0.1)
    publish_valve_status()
    time.sleep(0.1)
    publish_vfd_feedback()
    time.sleep(0.1)
    publish_current_test_index()
    logger.info("Initial status publishing complete")

def periodic_publisher():
    """Periodically publish sensor readings and status updates"""
    log("Periodic publisher started")
    iteration = 0
    while True:
        try:
            iteration += 1
            log(f"Periodic publish iteration #{iteration}")
            publish_sensor_readings()
            # Update status if running
            if device_state["status"] in ["running", "tuning"]:
                # Simulate status changes during test
                pass
            time.sleep(2)  # Publish every 2 seconds
        except Exception as e:
            log(f"Error in periodic publisher: {e}", "ERROR")
            import traceback
            log(traceback.format_exc(), "ERROR")
            time.sleep(2)

def main():
    """Main function"""
    global client
    log("="*60)
    log(f"Starting Device {DEVICE_ID} Simulator")
    log(f"MQTT Broker: {MQTT_BROKER}:{MQTT_PORT}")
    log("="*60)
    
    # Initialize MQTT client
    client_id = f"device{DEVICE_ID}_simulator"
    log(f"Creating MQTT client with ID: {client_id}")
    client = mqtt.Client(client_id=client_id)
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    
    # Enable debug logging
    client.on_log = lambda client, userdata, level, buf: log(f"MQTT: {buf}", "DEBUG")
    
    try:
        log(f"Connecting to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}...")
        # Connect to MQTT broker
        client.connect(MQTT_BROKER, MQTT_PORT, MQTT_KEEPALIVE)
        
        # Start periodic publisher in background thread
        log("Starting periodic publisher thread...")
        publisher_thread = threading.Thread(target=periodic_publisher, daemon=True)
        publisher_thread.start()
        
        # Start MQTT loop
        log("Device simulator running. Press Ctrl+C to stop.")
        log("="*60)
        client.loop_forever()
        
    except KeyboardInterrupt:
        log("\nStopping device simulator...")
        client.disconnect()
    except Exception as e:
        log(f"Error: {e}", "ERROR")
        import traceback
        log(traceback.format_exc(), "ERROR")

if __name__ == "__main__":
    main()

