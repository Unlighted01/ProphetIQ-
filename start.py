import os
import sys
import uvicorn
from pathlib import Path

# Force the project root into the Python path
root_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(root_dir))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting ProphetIQ Backend from {root_dir} on port {port}")
    # Import here after path is fixed
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, proxy_headers=True, forwarded_allow_ips="*")
