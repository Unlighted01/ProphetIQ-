import json
try:
    with open('docs/logs.1778904649085.json', 'r') as f:
        data = json.load(f)
    
    messages = [item.get('message', '') for item in data]
    
    with open('scratch/filtered_logs.txt', 'w') as f:
        for msg in messages:
            f.write(msg + '\n')
except Exception as e:
    with open('scratch/filtered_logs.txt', 'w') as f:
        f.write(str(e))
