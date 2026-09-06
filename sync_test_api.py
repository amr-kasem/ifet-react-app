"""
Sync API tester for the React Sync LED / soft-reload logic.

Run:
  pip install fastapi uvicorn
  uvicorn sync_test_api:app --host 0.0.0.0 --port 8010 --reload

Then open:
  http://localhost:8010/docs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Sync Test API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Current sync value: 1 = green (synced), 0 = red (triggers app soft-reload once)
sync_state = {"value": 1}


class SyncBody(BaseModel):
    value: int


@app.get("/sync")
def get_sync():
    """Polled every 1s by ValvesCommon. Returns 0 or 1."""
    return sync_state["value"]


@app.put("/sync")
def set_sync(body: SyncBody):
    """Set sync from Swagger UI or curl. Example: {"value": 0}"""
    if body.value not in (0, 1):
        raise HTTPException(status_code=400, detail="value must be 0 or 1")
    sync_state["value"] = body.value
    return {"value": sync_state["value"]}


@app.post("/sync/0")
def set_sync_zero():
    """Quick helper: set Sync to 0 (red + soft reload)."""
    sync_state["value"] = 0
    return {"value": 0}


@app.post("/sync/1")
def set_sync_one():
    """Quick helper: set Sync to 1 (green)."""
    sync_state["value"] = 1
    return {"value": 1}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("sync_test_api:app", host="0.0.0.0", port=8010, reload=True)
