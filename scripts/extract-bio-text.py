import fitz
import os

pdf_path = os.path.join('..', 'public', 'pdfs', 'competency', 'biology', '20 year pyq mcq for bio.pdf')
doc = fitz.open(pdf_path)
text = ""
for page in doc:
    text += page.get_text() + "\n"

out_path = os.path.join('extracted', 'bio-text.txt')
os.makedirs('extracted', exist_ok=True)
with open(out_path, 'w') as f:
    f.write(text)
print(f"Extracted {len(text)} characters.")
