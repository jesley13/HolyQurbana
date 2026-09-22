import json
import os
import re

def main():
    try:
        with open("readings.js", "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("Error: readings.js not found.")
        return

    # Strip "const readingsDB = " and the trailing ";"
    json_str = content.replace("const readingsDB = ", "").strip()
    if json_str.endswith(";"):
        json_str = json_str[:-1]

    try:
        db = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Error parsing readings.js JSON: {e}")
        return

    report = ["# Readings Validation Report (2026-09-13 to 2026-12-31)\n"]

    dates_one_set = 0
    dates_multiple_sets = 0
    missing_data_dates = []
    broken_links = []
    source_ambiguities = []
    
    # Dates to check
    from datetime import date, timedelta
    start_date = date(2026, 9, 13)
    end_date = date(2026, 12, 31)
    
    for n in range(int((end_date - start_date).days) + 1):
        check_date = start_date + timedelta(n)
        iso_date = check_date.strftime("%Y-%m-%d")
        
        if iso_date not in db:
            missing_data_dates.append(iso_date)
            continue
            
        date_data = db[iso_date]
        reading_sets = date_data.get("readingSets", [])
        
        if len(reading_sets) == 0:
            missing_data_dates.append(iso_date)
            continue
        elif len(reading_sets) == 1:
            dates_one_set += 1
        else:
            dates_multiple_sets += 1
            report.append(f"## {iso_date}")
            for i, rs in enumerate(reading_sets):
                title = rs.get("title", {}).get("en", "Unknown Title")
                num_readings = len(rs.get("readings", []))
                rs_type = rs.get("type", "unknown")
                report.append(f"- **Set {i+1} ({rs_type})**: {title} - {num_readings} readings")
            report.append("")

    report.insert(1, "## Summary")
    report.insert(2, f"- **Dates with one reading set**: {dates_one_set}")
    report.insert(3, f"- **Dates with multiple reading sets**: {dates_multiple_sets}")
    report.insert(4, f"- **Dates with missing data**: {len(missing_data_dates)}")
    if missing_data_dates:
        report.insert(5, f"  - Missing dates: {', '.join(missing_data_dates)}")
    report.insert(6, "")

    with open("validation_report.md", "w", encoding="utf-8") as f:
        f.write("\n".join(report))
        
    print("Validation report generated successfully as validation_report.md")

if __name__ == "__main__":
    main()
