# IFET React App

A React frontend for controlling and monitoring pressure / flow test rigs in real time.

The app connects to test devices over **MQTT (via WebSocket)** to stream live sensor readings and drive valves and VFD motors, and talks to a **REST backend** to store projects, tests, trials, deflections, and generated reports.

---

## Tech stack

| Concern | Library |
|---|---|
| UI framework | React 18 (Create React App / `react-scripts` 5) |
| State | Redux Toolkit + React-Redux |
| Routing | React Router v6 |
| Realtime | `mqtt` v5 over WebSocket |
| HTTP | axios |
| Components | Material-UI v4, Bootstrap, jQuery |
| Camera capture | `react-webcam` |

---

## Requirements

- **Node.js 16+** and npm
- A reachable **MQTT broker with WebSocket enabled** on port `8084`
- The **backend REST API** running on port `8000`
- Config JSON files served over HTTP (see [Configuration](#configuration))

---

## Getting started

```bash
npm install
```

```bash
npm start
```

The dev server runs at `http://localhost:3000` and reloads on save.

> **Note:** the app resolves every backend address from `window.location.hostname`. Opening it at `localhost` makes it look for the broker and API on `localhost`. To drive a real rig, open the app using the rig's IP (e.g. `http://10.1.10.185:3000`) so all services resolve to that machine.

### Other commands

```bash
npm run build
```
Produces an optimized bundle in `build/`, ready to be served by any static web server.

```bash
npm test
```
Runs the test watcher.

---

## Services the app expects

| Service | Address | Purpose |
|---|---|---|
| MQTT over WebSocket | `ws://<hostname>:8084/mqtt` | Live sensor data, valve/VFD commands, device status |
| REST API | `http://<hostname>:8000` | Devices, projects, test results, trial images, cyclic reports |
| Config files | `http://<hostname>/config.json` | Device, sensor, valve and VFD definitions |
| Simulation config server | `http://<hostname>:8001/config.json` | Only for local simulation — see [Local simulation](#local-simulation) |

If any of these is unreachable the UI will load but stay empty or stuck on `connecting ...`.

---

## Configuration

On startup `reloadBootstrapData()` ([src/store/sensors-slice.js](src/store/sensors-slice.js)) fetches three JSON files from the web root:

- `config.json` — the device list: MQTT broker host/port, sensors (Modbus address, baudrate, role), VFD, valves and their GPIO pins
- `configCommonValves.json` — shared valves across devices
- `configCommonSensors.json` — shared sensors across devices

A complete example of the `config.json` shape is in [for_test_only/config.json](for_test_only/config.json).

Each sensor carries a `role` (`pressure`, `flow`, …) that determines how the UI renders and charts it. Each valve carries a `role` array (`ACTIVE`, `POSITIVE`, `NEGATIVE`, `POSITIVE_RELEASE`, `NEGATIVE_RELEASE`) that determines which control buttons operate it.

> The fetch URLs in `sensors-slice.js` have several commented-out alternatives (local, ngrok, simulation). Switch the active line to match your deployment.

---

## MQTT topics

`<N>` is the device number. Subscriptions and publishes live in [src/componants/Mqtt1/Receiver.js](src/componants/Mqtt1/Receiver.js).

| Topic | Direction | Meaning |
|---|---|---|
| `device<N>/status` | in | Device connection / run state |
| `device<N>/sensors/<address>` | in | Live reading from one Modbus sensor |
| `device<N>/vfd/feedback` | in | Motor speed feedback |
| `device<N>/valves/status` | in | Combined valve state |
| `device<N>/valves/valve<i>` | in / out | Read and command a single valve |
| `device<N>/resume_status` | in | Resume state after reconnect |
| `device<N>/initial_value` | in | Baseline values at test start |
| `device<N>/notify` | in | Alarms and notifications (plays `alarm.wav`) |
| `device<N>/current_test_index` | in / out | Which step of the test sequence is active |
| `user_index_<N>` | in / out | Operator-selected step index |
| `turbo/valves/status` | in | Shared turbo valve block |
| `sick/sensors/<id>` | in | SICK sensor readings |

---

## Routes

| Path | Page |
|---|---|
| `/` | Main control dashboard (`static_load`) |
| `/devices` | Device selection |
| `/devices/:deviceName/parents` | Project groups for a device |
| `/devices/:deviceName/parents/:parentName/projects` | Projects in a group |
| `/projects/:projectName/tests/select-type` | Choose test type |
| `/projects/:projectName/tests` | Tests in a project |
| `/projects/:projectName/tests/:testId/trials` | Trials in a test |
| `/projects/:projectName/tests/:testId/trials/:trialId/deflections` | Deflection readings |
| `/report/device/:deviceID/project/:projectID` | Generated report |

---

## Project structure

```
src/
├── App.js                     Router and route table
├── index.js                   Entry point, Redux Provider
├── store/
│   ├── index.js               Store setup — general, devices, tests
│   ├── sensors-slice.js       Devices, sensors, valves, VFD, bootstrap loading
│   ├── general-slice.js       Incoming MQTT payload fan-out
│   └── testsSlice.js          Test/trial state
└── componants/
    ├── Mqtt1/                 MQTT client, subscriptions, message routing
    ├── static_load/           Main control dashboard
    ├── adjustForm/            Valve and VFD control panels
    ├── devices/               Device cards and selection
    ├── DisplayPages/          Projects, tests, trials, deflections pages
    ├── CyclicStaticPressureTable/         Standard test tables
    ├── CyclicStaticPressureTableCustom/   Custom test tables
    ├── commonSensorsTable/    Shared-sensor readouts
    ├── tablesForm/            Test sequence entry forms
    ├── Report/                Report generation and export
    ├── Modals/                Trial entry and image capture dialogs
    ├── Status/                Connection and valve status indicators
    ├── Project_Information_table/
    ├── ButtonWithChoices/
    └── ToggleButtonGeneral/
```

Note: `componants` is the actual spelling used throughout the codebase.

---

## Local simulation

`backend_simulation/new_devices/` provides Python simulators so the UI can be exercised without physical hardware.

```bash
cd backend_simulation/new_devices && python run_all_single_window.py
```

This starts a config server on port `8001` plus MQTT publishers for the simulated devices. Full instructions are in [backend_simulation/new_devices/README_new_devices.md](backend_simulation/new_devices/README_new_devices.md).

To point the app at the simulation, switch the active fetch URL in [src/store/sensors-slice.js](src/store/sensors-slice.js) to the `:8001` variant.

---

## Contributing

See [GIT_GUIDE.md](GIT_GUIDE.md) for the step-by-step workflow on committing, naming, and pushing changes — and how to recover an earlier version.
