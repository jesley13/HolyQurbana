import urllib.request
import json

url = "https://syrocalendar.com/SyroMalabarCalendar/?Mode=JSON&Type=DailyReadings&Date=12-09-2026"
req = urllib.request.Request(
    url, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://syrocalendar.com/daily-readings/',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
    }
)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print("Error:", e)
    print("Error:", e)
