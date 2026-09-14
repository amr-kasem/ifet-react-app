/* Dev server only.
 *
 * Create React App loads this file when you run `npm start` and ignores it
 * completely when you run `npm run build`, so nothing here can reach the rig.
 *
 * THE PROBLEM IT SOLVES. The three bootstrap config files are served from the
 * web root - port 80 - and the app fetches them from its own origin. On the rig
 * the app IS on port 80, so that is the same origin and it works. On a dev
 * server at :3000 it is not, and the web root sends no CORS headers, so the
 * fetches are blocked and no devices ever load.
 *
 * Putting copies in `public/` would fix the dev server and break the rig: CRA
 * copies `public/` into `build/`, so a developer's local config would ship
 * inside the bundle and shadow the real one at the web root.
 *
 * So the dev server fetches them from port 80 itself and passes them through.
 * Server-to-server, no CORS involved, and the browser only ever talks to its
 * own origin. Nothing is written to disk and nothing enters the build.
 */
const http = require("http");

// Served from the web root on the rig; the dev server borrows them from there.
const CONFIG_FILES = [
  "/config.json",
  "/configCommonValves.json",
  "/configCommonSensors.json",
];

// Port 80 on this machine, which is where the config lives in every
// deployment - the ui container on a workstation, the web root on the rig.
const ORIGIN = { host: "127.0.0.1", port: 80 };

module.exports = function (app) {
  CONFIG_FILES.forEach((route) => {
    app.get(route, (req, res) => {
      const upstream = http.get(
        { ...ORIGIN, path: route, headers: { Accept: "application/json" } },
        (r) => {
          if (r.statusCode !== 200) {
            r.resume();
            res.status(502).json({
              error: `config proxy: ${route} returned ${r.statusCode} from ` +
                     `port ${ORIGIN.port}. Is the web root serving it?`,
            });
            return;
          }
          res.type("application/json");
          r.pipe(res);
        }
      );

      // A dev convenience must not take the dev server down with it.
      upstream.on("error", (err) => {
        res.status(502).json({
          error: `config proxy: could not reach port ${ORIGIN.port} for ` +
                 `${route} (${err.code || err.message}). Start whatever serves ` +
                 "the config there, or open the app on port 80 directly.",
        });
      });
    });
  });
};
