import re
import codecs

try:
    with codecs.open('syro.html', 'r', encoding='utf-16le') as f:
        content = f.read()
except Exception as e:
    with open('syro.html', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

scripts = re.findall(r'<script.*?</script>', content, re.IGNORECASE | re.DOTALL)
with open('script12.js', 'w', encoding='utf-8') as f:
    f.write(scripts[12])
