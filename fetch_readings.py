import urllib.request
import json
import time
from datetime import date, timedelta

start_date = date(2026, 9, 12)
end_date = date(2026, 12, 31)

readings_db = {}

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)

for single_date in daterange(start_date, end_date):
    date_str = single_date.strftime("%d-%m-%Y")
    iso_date = single_date.strftime("%Y-%m-%d")
    
    url = f"https://syrocalendar.com/SyroMalabarCalendar/?Mode=JSON&Type=DailyReadings&Date={date_str}"
    req = urllib.request.Request(
        url, 
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://syrocalendar.com/daily-readings/',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            
            set_to_use = data.get("SetToUse", 1)
            items = data.get(f"Set{set_to_use}", [])
            
            if items:
                item = items[0]
                readings = []
                
                if item.get("Reading1_Eng"):
                    readings.append({"type": "First Reading", "reference_eng": item["Reading1_Eng"], "reference_mal": item.get("Reading1_Mal")})
                if item.get("Reading2_Eng"):
                    readings.append({"type": "Second Reading", "reference_eng": item["Reading2_Eng"], "reference_mal": item.get("Reading2_Mal")})
                if item.get("Reading3_Eng"):
                    readings.append({"type": "Third Reading", "reference_eng": item["Reading3_Eng"], "reference_mal": item.get("Reading3_Mal")})
                if item.get("ReadingGospal_Eng"):
                    readings.append({"type": "Gospel", "reference_eng": item["ReadingGospal_Eng"], "reference_mal": item.get("ReadingGospal_Mal")})
                
                season_eng = item.get("SeasonName_Eng_Full", "Ordinary Time")
                if "Elijah" in season_eng and "Cross" in season_eng and "Moses" in season_eng:
                    season_eng = "Elijah, Cross and Moses"
                season_mal = item.get("SeasonName_Mal_Full", "")
                
                readings_db[iso_date] = {
                    "day": single_date.strftime("%A"),
                    "liturgicalDay_eng": item.get("DayDescription_Eng", ""),
                    "liturgicalDay_mal": item.get("DayDescription_Mal", ""),
                    "season_eng": season_eng,
                    "season_mal": season_mal,
                    "readings": readings
                }
                print(f"Fetched {iso_date}")
            else:
                print(f"No items for {iso_date}")
            
    except Exception as e:
        print(f"Error on {iso_date}:", e)
        
    # sleep briefly to avoid rate limiting
    time.sleep(0.1)

# Write to readings.js
js_content = "const readingsDB = " + json.dumps(readings_db, indent=4) + ";\n"
with open("readings.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Successfully wrote readings for {len(readings_db)} days.")
