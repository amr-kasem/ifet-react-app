# New Devices Simulation Setup

This folder contains configuration and simulation files for devices 3 and 4.

## Files

- `config.json` - Device configuration file with 4 devices (device1, device2, device3, device4)
- `serve_config.py` - Simple HTTP server to serve config.json for frontend
- `device3_simulator.py` - MQTT simulator for device3
- `device4_simulator.py` - MQTT simulator for device4
- `run_all_single_window.py` - Main script to start all simulators and config server together

## Setup Instructions

### 1. Serve the config.json file

**IMPORTANT**: You MUST run this server before starting the frontend!

Run the HTTP server to serve the config.json file:

```bash
cd backend_simulation/new_devices
python serve_config.py
```

This will:
- Start a server on `http://localhost:8001`
- Validate that config.json exists and is valid JSON
- Serve the config.json file with proper CORS headers
- Show request logs when config.json is accessed

**Expected output:**
```
✓ Valid config.json found with 4 devices

============================================================
Config Server running on http://localhost:8001
Serving config.json from: /path/to/backend_simulation/new_devices
============================================================
Press Ctrl+C to stop the server
```

### 2. Frontend Configuration

The frontend is configured to fetch config.json from:
- `http://hostname:8001/config.json`

**Make sure the server is running BEFORE starting the frontend**, otherwise you'll see errors about devices not being found.

### 3. Troubleshooting

**Error: "Device with ID X not found in state.devices"**
- This happens when `fetchTurboData` completes before `fetchDeviceData` finishes loading
- **Solution**: Make sure `serve_config.py` is running and accessible before starting the frontend
- Check browser console for any fetch errors to `http://localhost:8001/config.json`
- Verify the server is running by visiting `http://localhost:8001/config.json` in your browser

**Error: "Failed to fetch config.json"**
- Check that `serve_config.py` is running
- Check that port 8001 is not already in use
- Verify firewall/antivirus isn't blocking the connection
- Check browser console for CORS errors

**Config.json not loading**
- Verify `config.json` exists in the same directory as `serve_config.py`
- Check that `config.json` is valid JSON (use a JSON validator)
- Look at the server console for error messages

### 4. Running All Simulators

Run all simulators and config server together:

```bash
cd backend_simulation/new_devices
python run_all_single_window.py
```

This will:
- Start the config server on `http://localhost:8001`
- Start Device 3 simulator (publishes MQTT messages)
- Start Device 4 simulator (publishes MQTT messages)
- Show combined output from all processes in one window
- **Press Ctrl+C to stop all processes** (works properly in single window mode)

**Alternative: Run Individually**

If you prefer to run each process separately:

**Terminal 1 - Config Server:**
```bash
cd backend_simulation/new_devices
python serve_config.py
```

**Terminal 2 - Device 3 Simulator:**
```bash
cd backend_simulation/new_devices
python device3_simulator.py
```

**Terminal 3 - Device 4 Simulator:**
```bash
cd backend_simulation/new_devices
python device4_simulator.py
```

**Note:** Make sure your MQTT broker is running before starting the simulators. The default broker is `localhost:1883`. You can modify the `MQTT_BROKER` and `MQTT_PORT` variables in the simulator files if needed.

**What the simulators do:**
- Subscribe to command topics to receive commands from frontend
- Publish sensor readings every 2 seconds
- Publish valve status when valves are controlled
- Publish VFD feedback when speed is changed
- Publish device status updates
- Respond to test commands, emergency stops, etc.

## Config.json Structure

Each device in config.json contains:
- `device_id`: Device identifier (e.g., "device1", "device2", "device3", "device4")
- `status`: Device status (e.g., "idle", "running")
- `toggleBtn`: Default toggle button state
- `current_speed`: Current VFD speed (as string)
- `sensors`: Object containing sensor definitions with `address` and `name`
- `valves`: Object containing valve definitions with `name`, `address`, `role`, and `value`
- `valves_status`: Object containing current valve states (key-value pairs)

## Notes

- The config.json file includes all 4 devices (device1, device2, device3, device4)
- Frontend will automatically load all devices from this config
- MQTT topics are generated dynamically based on device configuration
- The server validates config.json on startup and shows errors if the file is invalid

