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
| REST API | `http://<hostname>:8000` | Devices, projects, test results, trial images, cyclic reports, impact tests, `/sync/status` |
| Config files | `http://<hostname>/config.json` | Device, sensor, valve and VFD definitions |

If any of these is unreachable the UI will load but stay empty or stuck on `connecting ...`.

> **The app must be served from the same origin as the config files** — port 80,
> which is where the backend's `ui` container serves them. Running the app on
> another port (`npm start` on 3000, say) makes the three `config*.json` fetches
> cross-origin, and the `ui` container sends no CORS headers, so they are
> blocked and no devices appear.

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
    ├── impact/                Impact panel, tests table, photographs, impact API
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

## Impact tests

Selecting **Impact** in a device's load-type dropdown replaces the pressure
controls with the manual impact workflow. The frequency slider, current-speed
readout and the sensor / setpoint / hold-time row are hidden, and the project's
pressure table is replaced by an **Impact Tests** table.

Impact never touches the rig — no VFD, no valves, no pressure, no MQTT. It is a
form, so there is no running state to poll.

### The shape of an impact test

```
impact test  ──trials──►  attempt  ──►  numbered impacts (shots)  ──►  photographs
```

An impact test is a **sequence**: impact 1, impact 2, impact 3 — each numbered,
each with its own pass/fail, each with its own photographs. `labos_test_id` is
stable across every attempt at the same test, which is what lets "attempt 2 of
the same test" be expressed.

### Operating it

1. **Add Impact Test** in the table. Missile and weight are both optional — the
   protocol fixes the missile, so a test with neither is valid.
2. Pick the test in the dropdown, type the **Operator** name, press **Start**.
   That starts an *attempt*; the operator name is remembered per device.
3. **Success / Fail** records one impact each. **+ Photos** on any impact row
   attaches photographs to that impact specifically.
4. **Upload Images / Upload Folder** attach attempt-level evidence — the
   specimen before, the overall setup. **Preview** shows everything grouped by
   where it belongs.
5. **Finish Attempt** asks whether the specimen resisted, or aborts with a
   reason. Completing needs at least one impact and at least one photograph;
   aborting needs neither.

The **History** column opens every attempt at that test, each expandable to its
numbered impacts.

### Things the UI deliberately does

- **"Completed" next to "Pending" is correct.** `result` is the operator's call
  at finish; `test_result` is the reviewer's verdict afterwards. Separate
  columns on purpose — collapsing them would let an operator certify their own
  work. The operator panel never sends a verdict.
- **No result is preselected** in the finish dialog. Missing data is never a
  pass.
- **`retest_required` renders as "not yet reviewed"** while it is null, never as
  an unchecked box.
- **Photographs are append-only** — there is no delete, and they freeze once the
  attempt has been reviewed.
- **Zero photographs on an impact is normal.** Only the attempt as a whole needs
  at least one.
- **API `detail` strings are shown as-is**, because they say what to do next.
- The **Custom/Preset toggle does not apply to impact** — the API has no such
  split, so every open test is listed either way.

### Backend

These routes live on the real backend (port 8000) and are documented in
[real_backend/MANUAL_TESTS_API.md](real_backend/MANUAL_TESTS_API.md):

| Route | |
|---|---|
| `GET,POST /projects/{pid}/impact-tests/` | list / create a test |
| `PUT /projects/{pid}/impact-tests/{id}/finish` | close the test |
| `GET,POST /projects/{pid}/impact-tests/{id}/trials` | list / start an attempt |
| `GET,POST /test-results/{aid}/shots` | list / record one impact |
| `POST /shots/{sid}/photos` | photograph one impact |
| `POST /test-results/{aid}/photos` | attempt-level evidence |
| `PUT /test-results/{aid}/finish` | complete or abort the attempt |
| `PUT /test-results/{aid}/verdict` | the reviewer's call (not sent by this UI) |

They are served by the `feature/labos-airtable` branch of `ifet-management`.
Earlier branches do not have them, and the older `missile-impact-tests` routes
are a different model — shots hang off the test with no attempt layer.

> **Photographs upload but cannot be displayed.** The API stores each file under
> a generated uuid and keeps that in the model's `path` column, but
> `PhotoSchema` returns only `id`, `filename` (the *original* upload name),
> `note`, `created_at` and `shot_id`, and there is no GET route for a photo.
> `/uploads/<uuid>.png` serves the file, but nothing in the response says what
> the uuid is. The gallery therefore lists photographs by name instead of
> showing them. `impactPhotoUrl` in
> [impactApi.js](src/componants/impact/impactApi.js) resolves as soon as the API
> exposes `url`, `path` or `stored_filename`.

Not yet built **in the UI**: **Forced Entry** and **ANSI Z97.1**. The backend
serves their `manual-tests` routes; both remain disabled in the load-type
dropdown.

---

## Sync LED

The **Sync** cell in the header polls `GET /sync/status` every second — the
backend's Airtable outbox health, not a rig signal. The response carries a
purpose-built `led` field:

| `led` | Shown | `status` |
|---|---|---|
| `green` | green | `Synced` — nothing open, nothing failed |
| `amber` | amber | `Pending` — queued; testing continues normally |
| `red` | red | `Sync Failed` or `Retry Required` |

Hovering shows the `status` word. A spinner means the endpoint could not be
reached. The soft reload of cached config now fires when `revision` changes —
the signal that a pull brought new data down. The previous endpoint was a bare
`0`/`1` test stub with no equivalent, so it reloaded whenever the LED went red;
if that behaviour is wanted back, it is a few lines in
[ValvesCommon.js](src/componants/Status/ValvesCommon.js).

Note that `led: "red"` with `worker_alive: false` is expected whenever
`AIRTABLE_SYNC_ENABLED=false` — the worker has no heartbeat because it is not
meant to be running.

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
