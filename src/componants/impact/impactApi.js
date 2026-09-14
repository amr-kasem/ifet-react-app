import axios from "axios";

// ONE ATTEMPT IS ONE IMPACT (backend TC1h, 2026-09-08).
//
//   impact test  ──►  attempts  ──►  each attempt is exactly ONE impact
//                                    (its pass/fail, its photographs)
//
// The sequence — impact 1, 2, 3 — is made of attempts, not of shots inside one
// attempt. `shot_number` mirrors `attempt.trial_number`, a second impact on an
// attempt is refused with 409 by `uq_shots_attempt_number`, and the finish gate
// requires exactly one impact rather than at least one.
//
// The impact routes live on the same backend as everything else (port 8000).
export const IMPACT_API_PORT = 8000;

export const impactApiBase = () =>
  `http://${window.location.hostname}:${IMPACT_API_PORT}`;

// Photographs cannot be displayed yet.
//
// The API stores each upload under a generated uuid filename and keeps that in
// the model's `path` column, but PhotoSchema exposes only `id`, `filename`
// (the ORIGINAL upload name), `note`, `created_at` and `shot_id` — and there is
// no GET route for a photo. /uploads/<uuid>.png serves the file, but nothing in
// the response says what that uuid is, so the URL cannot be built.
//
// Written to work the moment the backend exposes it: if a record ever carries
// `url`, `path` or `stored_filename`, this resolves. Until then it returns null
// and the gallery renders a placeholder rather than a broken image.
export const impactPhotoUrl = (photo) => {
  if (!photo) return null;
  const path = photo.url || photo.path || photo.stored_filename || "";
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${impactApiBase()}/${path.replace(/^\/+/, "")}`;
};

// "Errors are meant to be shown. The detail strings say what to do next."
export const impactError = (error, fallback = "Request failed.") => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    // FastAPI validation errors arrive as a list of objects.
    return detail.map((d) => d.msg || JSON.stringify(d)).join("; ");
  }
  return error?.message || fallback;
};

const json = { headers: { "Content-Type": "application/json" } };

// --- the test -------------------------------------------------------------

export const listImpactTests = async (projectId) => {
  const { data } = await axios.get(
    `${impactApiBase()}/projects/${projectId}/impact-tests/`
  );
  return data;
};

// Everything is optional — the protocol fixes the missile, so {} is valid.
export const createImpactTest = async (projectId, body = {}) => {
  const { data } = await axios.post(
    `${impactApiBase()}/projects/${projectId}/impact-tests/`,
    body,
    json
  );
  return data;
};

// --- the test's own classification (TC5) ---------------------------------
//
// The vocabularies, mirrored from the API's IMPACT_FAMILIES / IMPACT_LEVELS.
// Anything else is refused with 422.
export const IMPACT_FAMILIES = ["SMI", "LMI"];
export const IMPACT_LEVELS = ["D", "E"];

// An imported test is bound to an Airtable Protocol Section, and its family is
// that section's Requirement Code (IMPACT_SMI / IMPACT_LMI), frozen at import.
// PATCHing the family on one is a 400 - so never offer the choice.
export const isAirtableBound = (test) => !!test?.airtable_section_id;

// `impact_classification` is DERIVED on the server - "SMI", "LMI Level D",
// "LMI Level E", or null when the family (or an LMI level) is missing. Render
// it; never compute it and never send it.
export const impactClassification = (test) => test?.impact_classification || null;

// Family: write-once, and only ever on a LabOS-only test. Any attempt at all,
// aborted included, fixes it - it is the context that attempt ran in.
export const familyIsLocked = (test) =>
  isAirtableBound(test) || (test?.trials || []).length > 0;

// **The family locks at the first ATTEMPT; the classification is only demanded
// when one COMPLETES.** Starting without a family used to land between those
// two deadlines with no way forward - PATCH 409, finish 400, abort the only
// exit. The API now closes that by refusing the start itself, for ANY impact
// test, bound or not. Mirrored here so the operator is stopped at the button
// rather than by a 400.
export const familyUnset = (test) => !!test && !test.impact_family;

// Bound to Airtable but unclassified: the import that owns the family did not
// supply one, so it cannot be chosen here - the requirement has to be re-run.
export const familyNeedsReimport = (test) =>
  familyUnset(test) && isAirtableBound(test);

// Unbound, unclassified, and attempts already exist: it can never acquire a
// family now, so its impacts can only be aborted. Only reachable on tests made
// before the API's start guard existed.
export const familyStranded = (test) =>
  familyUnset(test) && !isAirtableBound(test) && (test?.trials || []).length > 0;

// Why the screen refuses to start an impact, in the API's own terms - or null
// when nothing is in the way.
//
// `attemptOpen` matters: the API skips its guard while an attempt is open, so
// that a test stranded by the old behaviour still answers Start with that
// attempt. It is the id the operator needs in order to abort it.
export const impactStartBlock = (test, attemptOpen) => {
  if (!test || attemptOpen || !familyUnset(test)) return null;
  if (familyNeedsReimport(test)) {
    return (
      `This test is bound to Airtable section ${test.airtable_section_id} but ` +
      "carries no missile family. Re-run the requirement import before starting."
    );
  }
  if (familyStranded(test)) {
    return (
      "This test has impacts but no missile family, and can no longer be given " +
      "one - its impacts can only be aborted. Create a new test."
    );
  }
  return (
    "Set the missile family below before the first impact. An attempt fixes it " +
    "permanently, so the API refuses to start without one."
  );
};

// Level and target velocity stay editable until an attempt COMPLETES, because
// until then nothing has been claimed.
export const levelAndVelocityAreLocked = (test) =>
  (test?.trials || []).some((t) => t.status === "Completed");

// Set the classification and the target velocity. Unknown keys are 422, so
// only send what changed.
export const updateImpactTest = async (projectId, testId, body) => {
  const { data } = await axios.patch(
    `${impactApiBase()}/projects/${projectId}/impact-tests/${testId}`,
    body,
    json
  );
  return data;
};

// What `PUT /test-results/{aid}/finish` will refuse for lack of test setup.
// The API is the authority; this only lets the screen say so before the call.
export const impactSetupMissing = (test) => {
  const missing = [];
  if (!test) return missing;
  if (!test.impact_classification) {
    missing.push(
      test.impact_family === "LMI"
        ? "the impact level (D or E)"
        : "the impact family"
    );
  }
  if (test.target_velocity === null || test.target_velocity === undefined) {
    missing.push("the target velocity");
  }
  return missing;
};

// Closes the TEST to further impacts. Not the same operation as finishing one
// impact (PUT /test-results/{aid}/finish) - after this, starting an attempt is
// a 400, so the two must never share the word "Finish" in the UI.
export const finishImpactTest = async (projectId, testId) => {
  const { data } = await axios.put(
    `${impactApiBase()}/projects/${projectId}/impact-tests/${testId}/finish`
  );
  return data;
};

// --- attempts -------------------------------------------------------------

// POST .../trials STARTS an attempt here; it does not post a finished one.
export const startImpactAttempt = async (projectId, testId, operatorName) => {
  const { data } = await axios.post(
    `${impactApiBase()}/projects/${projectId}/impact-tests/${testId}/trials`,
    { operator_name: operatorName },
    json
  );
  return data;
};

export const listImpactAttempts = async (projectId, testId) => {
  const { data } = await axios.get(
    `${impactApiBase()}/projects/${projectId}/impact-tests/${testId}/trials`
  );
  return data;
};

export const getAttempt = async (attemptId) => {
  const { data } = await axios.get(
    `${impactApiBase()}/test-results/${attemptId}`
  );
  return data;
};

export const finishAttempt = async (attemptId, body) => {
  const { data } = await axios.put(
    `${impactApiBase()}/test-results/${attemptId}/finish`,
    body,
    json
  );
  return data;
};

export const abortAttempt = (attemptId, abortReason) =>
  finishAttempt(attemptId, { abort_reason: abortReason });

// Supersede a recorded result: a new OPEN attempt naming the one it replaces.
// There is no edit or delete route for an attempt or an impact — by design, the
// terminal state is final — so this is the only way to repair a mis-recorded
// result. `reason` is required.
//
// Refused when the original is still open (400 — an open attempt is completed
// correctly, not corrected), when the test already has an open attempt (409),
// or when the reason is empty (400). Allowed on a finished test.
export const correctAttempt = async (attemptId, { reason, operatorName }) => {
  const { data } = await axios.post(
    `${impactApiBase()}/test-results/${attemptId}/correct`,
    { reason, operator_name: operatorName || null },
    json
  );
  return data;
};

// The reviewer's call, not the operator's. Kept here so the review screen has
// it; nothing in the operator panel should send it.
export const setVerdict = async (attemptId, body) => {
  const { data } = await axios.put(
    `${impactApiBase()}/test-results/${attemptId}/verdict`,
    body,
    json
  );
  return data;
};

// --- the impact (one per attempt) ----------------------------------------

// Records THIS attempt's impact. A second call on the same attempt is a 409:
// one attempt is one impact, so the next impact is the next attempt.
//
// shot_number is allocated server-side — never send one. It now mirrors the
// attempt's trial_number, so the impact ordinal and the attempt ordinal agree.
//
// `velocity` here is the ACHIEVED velocity of this one impact, and it is not
// the test's `target_velocity`. Different fields, different meanings - they
// must not share a control.
export const recordShot = async (attemptId, { result, area, velocity, note }) => {
  const num = (v) => (v === undefined || v === null || v === "" ? null : Number(v));
  const { data } = await axios.post(
    `${impactApiBase()}/test-results/${attemptId}/shots`,
    {
      result,
      // area and velocity are numbers on the wire, not strings.
      area: num(area),
      velocity: num(velocity),
      note: note ?? null,
    },
    json
  );
  return data;
};

export const listShots = async (attemptId) => {
  const { data } = await axios.get(
    `${impactApiBase()}/test-results/${attemptId}/shots`
  );
  return data;
};

// --- photographs (POST only; there is no delete) -------------------------

const postPhoto = async (url, file, note) => {
  const formData = new FormData();
  formData.append("file", file);
  if (note) formData.append("note", note);

  const { data } = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const uploadShotPhoto = (shotId, file, note) =>
  postPhoto(`${impactApiBase()}/shots/${shotId}/photos`, file, note);

export const uploadAttemptPhoto = (attemptId, file, note) =>
  postPhoto(`${impactApiBase()}/test-results/${attemptId}/photos`, file, note);

// One call per photograph, so a multi-file pick becomes several requests.
// Reports per-file outcomes rather than failing the whole batch on one bad file.
export const uploadPhotos = async (target, files, onProgress) => {
  const upload = target.shotId
    ? (file) => uploadShotPhoto(target.shotId, file)
    : (file) => uploadAttemptPhoto(target.attemptId, file);

  const list = Array.from(files);
  const saved = [];
  const failed = [];

  for (let i = 0; i < list.length; i += 1) {
    try {
      saved.push(await upload(list[i]));
    } catch (error) {
      failed.push({ filename: list[i].name, reason: impactError(error) });
    }
    if (onProgress) onProgress(Math.round(((i + 1) * 100) / list.length));
  }

  return { saved, failed };
};
