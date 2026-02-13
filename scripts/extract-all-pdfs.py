#!/usr/bin/env python3
"""Extract text from all TYQ PDFs and save to text files."""
import fitz
import os
import sys

pdf_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'tyq-pdfs')
out_dir = os.path.join(os.path.dirname(__file__), 'extracted')
os.makedirs(out_dir, exist_ok=True)

files = sorted([f for f in os.listdir(pdf_dir) if f.endswith('.pdf')])
print(f"Found {len(files)} PDFs")

for fname in files:
    fpath = os.path.join(pdf_dir, fname)
    out_name = fname.replace('.pdf', '.txt')
    out_path = os.path.join(out_dir, out_name)
    
    try:
        doc = fitz.open(fpath)
        text = ""
        for i, page in enumerate(doc):
            text += f"--- PAGE {i+1} ---\n"
            text += page.get_text() + "\n"
        
        with open(out_path, 'w') as f:
            f.write(text)
        print(f"✅ {fname} -> {out_name} ({len(text)} chars)")
    except Exception as e:
        print(f"❌ {fname}: {e}")
