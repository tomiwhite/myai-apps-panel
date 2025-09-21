import os
import sys
import json
import shutil
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
APPS_DIR = os.path.join(ROOT, 'apps')
TEMPLATE_DIR = os.path.join(ROOT, 'app_template')

if len(sys.argv) < 4:
    print("Użycie: python create_category_and_app.py <kategoria> <nazwa_aplikacji> <tytuł> [opis]")
    sys.exit(1)

category = sys.argv[1]
app_name = sys.argv[2]
title = sys.argv[3]
description = sys.argv[4] if len(sys.argv) > 4 else "Nowa aplikacja AI."

cat_path = os.path.join(APPS_DIR, category)
app_path = os.path.join(cat_path, app_name)

# Tworzenie folderu kategorii jeśli nie istnieje
os.makedirs(cat_path, exist_ok=True)

# Tworzenie folderu aplikacji
if os.path.exists(app_path):
    print(f"Folder aplikacji już istnieje: {app_path}")
    sys.exit(1)
shutil.copytree(TEMPLATE_DIR, app_path)

# Aktualizacja meta.json
meta_path = os.path.join(app_path, 'meta.json')
with open(meta_path, encoding='utf-8') as f:
    meta = json.load(f)
meta['title'] = title
meta['description'] = description
meta['category'] = category
meta['status'] = 'aktywna'
meta['version'] = '1.0.0'
meta['last_modified'] = datetime.now().strftime('%Y-%m-%d')

with open(meta_path, 'w', encoding='utf-8') as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)

print(f"Utworzono aplikację: {app_path}")
