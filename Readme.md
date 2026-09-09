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
impact test  ──trials──►  attempt  ==  ONE impact (pass/fail)  ──►  photographs
```

**One attempt is one impact.** An impact test is still a **sequence** — impact 1,
impact 2, impact 3 — but the sequence is made of *attempts*, not of shots inside
one attempt. Impact N is attempt N: `shot_number` mirrors `trial_number`, so the
two ordinals always agree.

This is the backend's TC1h shape (product owner, 2026-09-08). A second impact on
one attempt is refused with **409**, and completing an attempt requires
**exactly one** impact rather than at least one.

`labos_test_id` is stable across every attempt at the same test, which is what
lets the impacts of one test be grouped.

There is no notion of re-doing impact 3: a specimen already struck cannot have
that impact repeated, so a further firing is impact 6. A *wrongly recorded*
result is superseded instead — see **Corrections** below.

### Operating it

1. **Add Impact Test** in the table. Missile and weight are both optional — the
   protocol fixes the missile, so a test with neither is valid.
2. Pick the test in the dropdown and type the **Operator** name. The name is
   remembered per device.
3. **Success / Fail** records one impact and opens its attempt. Pressing Start
   first is optional — starting is idempotent on the backend, so either route
   opens the same attempt and a double-press cannot produce two impacts.
4. The **strip below the buttons** says what that impact still needs: the
   pass/fail, then at least one photograph. **+ Photos** attaches to that
   impact. **Upload Images / Upload Folder** attach evidence to its attempt —
   the specimen before, the overall setup.
5. **Complete impact N** closes it, or aborts with a reason. Completing needs
   the impact and at least one photograph; aborting needs neither.
6. Repeat from 3 for the next impact.

Success and Fail are **disabled while an impact is open** — one attempt is one
impact, so the current one is completed or aborted before the next is recorded.

The **Impacts** grid lists the whole sequence for the selected test. The
**History** column opens the same sequence with its full detail.

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
- **Every impact needs at least one photograph**, because the impact and its
  attempt are now the same thing. A per-impact photograph carries
  `test_result_id` as well as `shot_id`, so photographing the impact satisfies
  the attempt's evidence gate with no separate upload.
- **The finish dialog no longer asks whether the specimen resisted.** The
  attempt's outcome *is* its impact's outcome — the backend derives it from the
  shot — so asking again could only produce a contradiction: a Fail impact
  inside an attempt marked as resisted.
- **API `detail` strings are shown as-is**, because they say what to do next.
- The **Custom/Preset toggle does not apply to impact** — the API has no such
  split, so every open test is listed either way.

### Backend

These routes live on the real backend (port 8000). The authoritative contract is
that service's own `openapi.json`, or `/docs` on a running instance:

| Route | |
|---|---|
| `GET,POST /projects/{pid}/impact-tests/` | list / create a test |
| `PUT /projects/{pid}/impact-tests/{id}/finish` | close the test |
| `GET,POST /projects/{pid}/impact-tests/{id}/trials` | list / start an attempt |
| `GET,POST /test-results/{aid}/shots` | list / record one impact |
| `POST /shots/{sid}/photos` | photograph one impact |
| `POST /test-results/{aid}/photos` | attempt-level evidence |
| `PUT /test-results/{aid}/finish` | complete or abort the attempt |
| `POST /test-results/{aid}/correct` | supersede a recorded result |
| `PUT /test-results/{aid}/verdict` | the reviewer's call (not sent by this UI) |

They are served by the `feature/labos-airtable` branch of `ifet-management`.
Earlier branches do not have them, and the older `missile-impact-tests` routes
are a different model — shots hang off the test with no attempt layer.

Two field placements are easy to get wrong: `labos_test_id` is on the **attempt**,
not the test, and an attempt does **not** embed its impacts — those come from
`GET /test-results/{aid}/shots`. The attempts themselves *are* embedded, though:
`GET /projects/{pid}/impact-tests/` returns each test with its full `trials`
list, which is why the panel can show the impact sequence in one request.

### Corrections

A recorded result cannot be edited or deleted — the terminal state is final by
design, and there is no edit or delete route for an attempt or an impact. So a
mis-recorded result is **superseded**: `POST /test-results/{aid}/correct`
opens a new attempt that names the one it replaces, carrying
`corrects_attempt_id` and a required `correction_reason`.

That distinction matters downstream: without the reference, a correction and a
retest are indistinguishable, and a roll-up counting attempts would be wrong
*and look right*.

The **Correct** button in the History modal does this. It is offered only on a
terminal attempt — an open one is completed correctly rather than corrected —
and the test must have no other attempt open. It is allowed on a *finished*
test, which is where a correction is most often needed.

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
