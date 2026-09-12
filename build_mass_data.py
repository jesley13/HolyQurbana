import json
import re

with open('qurbana.txt', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

data = {
    "sections": []
}

def create_section(title, content_lines, seasonal=False):
    if not seasonal:
        return {
            "title": title,
            "type": "static",
            "content": "\n".join(content_lines).strip()
        }
    else:
        # Parse seasonal content
        seasons_data = {}
        current_season = None
        current_content = []
        for line in content_lines:
            clean_line = re.sub(r'<[^>]+>', '', line).strip()
            if clean_line.startswith("Annunciation") or clean_line.startswith("Nativity") or clean_line.startswith("Epiphany") or clean_line.startswith("Great fast") or clean_line.startswith("Great Fast") or clean_line.startswith("Ressurection") or clean_line.startswith("Resurrection") or clean_line.startswith("Apostles") or clean_line.startswith("Summer") or clean_line.startswith("Elijah, Cross") or clean_line.startswith("Dedication"):
                if current_season:
                    seasons_data[current_season] = "\n".join(current_content).strip()
                current_season = clean_line.split('-')[0].strip()
                if "Elijah" in current_season:
                    current_season = "Elijah, Cross and Moses"
                current_content = []
            else:
                if current_season:
                    current_content.append(line)
        if current_season:
            seasons_data[current_season] = "\n".join(current_content).strip()
        
        return {
            "title": title,
            "type": "seasonal",
            "seasons": seasons_data
        }

# Manual bounds based on file inspection
bounds = {
    "Opening": (0, 18),
    "Psalms - Marmita": (19, 216),
    "Liturgy of the Word": (217, 276),
    "Proclamatory Prayer - Karozuta": (277, 486),
    "Before the Creed": (487, 504),
    "The Creed": (505, 513),
    "Liturgy of the Eucharist": (514, 538),
    "Anaphora": (539, 587),
    "Preparation for Communion": (588, 647),
    "Communion & Conclusion": (648, 674)
}

seasonal_sections = ["Psalms - Marmita", "Proclamatory Prayer - Karozuta"]

for title, (start, end) in bounds.items():
    is_seasonal = title in seasonal_sections
    section = create_section(title, lines[start:end+1], is_seasonal)
    data["sections"].append(section)

js_content = "const massData = " + json.dumps(data, indent=2) + ";\n"

with open('mass-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("mass-data.js generated successfully.")
