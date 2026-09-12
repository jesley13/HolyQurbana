import zipfile
import xml.etree.ElementTree as ET

def extract_html_from_docx(docx_path):
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    html_lines = []
    
    with zipfile.ZipFile(docx_path) as docx:
        tree = ET.fromstring(docx.read('word/document.xml'))
        for paragraph in tree.findall('.//w:p', namespaces):
            para_text = []
            for run in paragraph.findall('.//w:r', namespaces):
                t = run.find('w:t', namespaces)
                if t is not None and t.text:
                    run_text = t.text
                    # Escape HTML
                    run_text = run_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    
                    rpr = run.find('w:rPr', namespaces)
                    if rpr is not None:
                        # Check for bold
                        b = rpr.find('w:b', namespaces)
                        if b is not None:
                            val = b.attrib.get(f"{{{namespaces['w']}}}val")
                            if val not in ('0', 'false'):
                                run_text = f"<b>{run_text}</b>"
                                
                        # Check for italics
                        i = rpr.find('w:i', namespaces)
                        if i is not None:
                            val = i.attrib.get(f"{{{namespaces['w']}}}val")
                            if val not in ('0', 'false'):
                                run_text = f"<i>{run_text}</i>"
                                
                    para_text.append(run_text)
            
            # Paragraph formatting
            pPr = paragraph.find('w:pPr', namespaces)
            align = ""
            if pPr is not None:
                jc = pPr.find('w:jc', namespaces)
                if jc is not None:
                    val = jc.attrib.get(f"{{{namespaces['w']}}}val")
                    if val == "center":
                        align = ' style="text-align: center;"'
                    elif val == "right":
                        align = ' style="text-align: right;"'
                        
            p_text = ''.join(para_text)
            if p_text.strip() == '':
                html_lines.append(f"<p{align}><br></p>")
            else:
                html_lines.append(f"<p{align}>{p_text}</p>")
            
    return '\n'.join(html_lines)

try:
    with open('qurbana.html', 'w', encoding='utf-8') as f:
        f.write(extract_html_from_docx('qurbana.docx'))
    print("Success")
except Exception as e:
    print("Error:", e)
