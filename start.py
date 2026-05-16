import os
import sys
import uvicorn
from pathlib import Path

# Force the project root into the Python path
root_dir = Path(__file__).parent.absolute()
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    
    # Robust logging for Railway
    print(f"--- ProphetIQ Startup Sequence ---", flush=True)
    print(f"CWD: {os.getcwd()}", flush=True)
    print(f"ROOT_DIR: {root_dir}", flush=True)
    print(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not Set')}", flush=True)
    print(f"SYS_PATH: {sys.path}", flush=True)
    print(f"Starting uvicorn on port {port}...", flush=True)
    
    try:
        # Import here to verify path is correct
        from backend.main import app
        print("Successfully imported backend.main:app", flush=True)
        uvicorn.run(app, host="0.0.0.0", port=port, proxy_headers=True, forwarded_allow_ips="*")
    except Exception as e:
        print(f"CRITICAL ERROR during startup: {e}", flush=True)
        import traceback
        traceback.print_exc()
        sys.exit(1)
