# -*- coding: utf-8 -*-

import fitz # install using: pip install PyMuPDF

import sys

# Access the command-line argument
variable_from_node = sys.argv[1]
# print(variable_from_node)
with fitz.open(variable_from_node) as doc:
    text = ""
    for page in doc:
        text += page.get_text()
        
print(text)


