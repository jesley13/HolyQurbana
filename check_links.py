import json
import re

def generate_bible_gateway_link(reference):
    if not reference: return '#'
    clean_ref = re.sub(r'\(.*?\)', '', reference).strip()
    import urllib.parse
    encoded_ref = urllib.parse.quote(clean_ref)
    return f"https://www.biblegateway.com/passage/?search={encoded_ref}&version=ESV"

pocBookMap = {
    'gen': 'genesis', 'ex': 'exodus', 'lev': 'leviticus', 'num': 'numbers', 'deut': 'deuteronomy',
    'josh': 'joshua', 'judg': 'judges', 'ruth': 'ruth', '1 sam': '1-samuel', '2 sam': '2-samuel',
    '1 kgs': '1-kings', '2 kgs': '2-kings', '1 chr': '1-chronicles', '2 chr': '2-chronicles',
    'ezra': 'ezra', 'neh': 'nehemiah', 'tob': 'tobit', 'jdt': 'judith', 'esth': 'esther',
    '1 mac': '1-maccabees', '2 mac': '2-maccabees', 'job': 'job', 'ps': 'psalms', 'prov': 'proverbs',
    'eccl': 'ecclesiastes', 'song': 'song-of-songs', 'wis': 'wisdom', 'sir': 'sirach',
    'is': 'isaiah', 'jer': 'jeremiah', 'lam': 'lamentations', 'bar': 'baruch', 'ezek': 'ezekiel',
    'dan': 'daniel', 'hos': 'hosea', 'joel': 'joel', 'amos': 'amos', 'obad': 'obadiah',
    'jon': 'jonah', 'mic': 'micah', 'nah': 'nahum', 'hab': 'habakkuk', 'zeph': 'zephaniah',
    'hag': 'haggai', 'zech': 'zechariah', 'mal': 'malachi',
    'mt': 'matthew', 'mk': 'mark', 'lk': 'luke', 'jn': 'john', 'acts': 'acts',
    'rom': 'romans', '1 cor': '1-corinthians', '2 cor': '2-corinthians', 'gal': 'galatians',
    'eph': 'ephesians', 'phil': 'philippians', 'col': 'colossians', '1 thes': '1-thessalonians', '2 thes': '2-thessalonians',
    '1 tim': '1-timothy', '2 tim': '2-timothy', 'tit': 'titus', 'phlm': 'philemon', 'heb': 'hebrews',
    'jas': 'james', '1 pet': '1-peter', '2 pet': '2-peter', '1 pt': '1-peter', '2 pt': '2-peter', '1 jn': '1-john', '2 jn': '2-john', '3 jn': '3-john',
    'jude': 'jude', 'rev': 'revelation'
}

ntBooks = ['matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1-corinthians', '2-corinthians', 'galatians', 'ephesians', 'philippians', 'colossians', '1-thessalonians', '2-thessalonians', '1-timothy', '2-timothy', 'titus', 'philemon', 'hebrews', 'james', '1-peter', '2-peter', '1-john', '2-john', '3-john', 'jude', 'revelation']

def generate_poc_bible_link(english_ref):
    if not english_ref: return '#'
    clean_ref = re.sub(r'\(.*?\)', '', english_ref).strip().lower()
    match = re.match(r'^(\d?\s*[a-z]+)\s+(\d+):?(.*)$', clean_ref, re.IGNORECASE)
    if not match: return '#'
    
    bookAbbr = match.group(1).strip()
    chapter = match.group(2).strip()
    
    grandam = ''
    for abbr, id in pocBookMap.items():
        if bookAbbr.startswith(abbr) or abbr.startswith(bookAbbr):
            grandam = id
            break
            
    if not grandam: return '#'
    bib = 1 if grandam in ntBooks else 0
    return f"https://www.pocbible.com/thirayuka.asp?bib={bib}&grandam={grandam}&adyayam={chapter}"

with open("readings.js", "r", encoding="utf-8") as f:
    json_str = f.read().replace("const readingsDB = ", "").strip()
    if json_str.endswith(";"): json_str = json_str[:-1]
    db = json.loads(json_str)

broken_links = []
for iso_date, date_data in db.items():
    for rs in date_data.get("readingSets", []):
        for r in rs.get("readings", []):
            eng_ref = r.get("reference", {}).get("en")
            if eng_ref:
                esv_link = generate_bible_gateway_link(eng_ref)
                poc_link = generate_poc_bible_link(eng_ref)
                if esv_link == '#' or poc_link == '#':
                    broken_links.append(f"{iso_date} - {eng_ref} -> ESV: {esv_link}, POC: {poc_link}")

with open("validation_report.md", "a", encoding="utf-8") as f:
    f.write("\n## Broken Bible Links\n")
    if not broken_links:
        f.write("None. All links generated successfully.\n")
    else:
        for link in broken_links:
            f.write(f"- {link}\n")

print("Appended link validation to validation_report.md")
