import os
import sys
from pathlib import Path

# Add the project root to the Python path
root_dir = Path(__file__).parent.absolute()
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

# Add the backend directory to the Python path as well, just in case
backend_dir = root_dir / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

print(f"--- Root main.py Startup Sequence ---", flush=True)
print(f"CWD: {os.getcwd()}", flush=True)
print(f"ROOT_DIR: {root_dir}", flush=True)
print(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not Set')}", flush=True)
print(f"SYS_PATH: {sys.path}", flush=True)

try:
    from backend.main import app
    print("Successfully imported app from backend.main", flush=True)
except Exception as e:
    print(f"CRITICAL ERROR during import: {e}", flush=True)
    import traceback
    traceback.print_exc()
    sys.exit(1)
