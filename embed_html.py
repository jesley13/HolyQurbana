import json

with open('qurbana.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

js_content = "const fullQurbanaHtml = " + json.dumps(html_content) + ";\n"

with open('mass-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("mass-data.js updated with full html.")
