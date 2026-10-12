from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import subprocess
import sys
import tempfile
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
app = FastAPI(title="Python Code Visualizer")
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")

class RunRequest(BaseModel):
    code: str
    inputs: list[str] = []

TRACE_RUNNER = r"""
import sys, json, traceback, builtins

SOURCE = {source!r}
INPUTS = {inputs!r}
events = []
out_lines = []
input_index = 0

class InputProvider:
    def __call__(self, prompt=""):
        global input_index
        if input_index < len(INPUTS):
            value = str(INPUTS[input_index])
            input_index += 1
            out_lines.append(str(prompt) + value)
            return value
        raise EOFError("No more input values were provided.")

provider = InputProvider()
real_input = builtins.input
builtins.input = provider

def safe_value(v):
    try:
        if isinstance(v, (str, int, float, bool)) or v is None:
            return v
        if isinstance(v, (list, tuple, dict, set)):
            return repr(v)
        return repr(v)
    except Exception:
        return "<unavailable>"

def snapshot(frame):
    return {k: safe_value(v) for k, v in frame.f_locals.items() if not k.startswith("__")}

def stack_snapshot(frame):
    stack = []
    f = frame
    while f:
        if f.f_code.co_filename == "<visualizer>":
            stack.append(f.f_code.co_name)
        f = f.f_back
    return list(reversed(stack))

def tracer(frame, event, arg):
    if frame.f_code.co_filename != "<visualizer>":
        return tracer
    if event == "line":
        events.append({
            "line": frame.f_lineno,
            "event": "line",
            "variables": snapshot(frame),
            "call_stack": stack_snapshot(frame)
        })
    elif event == "return":
        events.append({
            "line": frame.f_lineno,
            "event": "return",
            "variables": snapshot(frame),
            "call_stack": stack_snapshot(frame),
            "return_value": safe_value(arg)
        })
    return tracer

class Capture:
    def write(self, s):
        if s:
            out_lines.append(s)
    def flush(self):
        pass

old_stdout, old_stderr = sys.stdout, sys.stderr
sys.stdout = Capture()
sys.stderr = Capture()

result = {"events": [], "output": "", "error": None}
try:
    sys.settrace(tracer)
    ns = {"__name__": "__main__"}
    exec(compile(SOURCE, "<visualizer>", "exec"), ns, ns)
except Exception as exc:
    result["error"] = "".join(traceback.format_exception_only(type(exc), exc)).strip()
finally:
    sys.settrace(None)
    sys.stdout, sys.stderr = old_stdout, old_stderr
    builtins.input = real_input

result["events"] = events
result["output"] = "".join(out_lines)
print(json.dumps(result, ensure_ascii=False))
"""

@app.get("/")
def home():
    return FileResponse(BASE / "static" / "index.html")

@app.post("/api/execute")
def execute(req: RunRequest):
    code = req.code
    if len(code) > 12000:
        return {"events": [], "output": "", "error": "Code is too long (maximum 12,000 characters)."}
    script = TRACE_RUNNER.format(source=code, inputs=req.inputs)
    with tempfile.TemporaryDirectory() as td:
        runner = Path(td) / "runner.py"
        runner.write_text(script, encoding="utf-8")
        try:
            p = subprocess.run(
                [sys.executable, str(runner)],
                capture_output=True,
                text=True,
                timeout=5,
                cwd=td
            )
        except subprocess.TimeoutExpired:
            return {"events": [], "output": "", "error": "Execution stopped: time limit exceeded (5 seconds)."}
        if p.returncode != 0 and not p.stdout.strip():
            return {"events": [], "output": p.stderr[-4000:], "error": "Execution process failed."}
        try:
            return json.loads(p.stdout)
        except Exception:
            return {"events": [], "output": p.stdout[-4000:], "error": p.stderr[-4000:] or "Could not parse execution result."}
