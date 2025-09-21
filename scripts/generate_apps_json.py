import os
import json
from glob import glob

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
APPS_DIR = os.path.join(ROOT, 'apps')
OUTPUT = os.path.join(ROOT, 'dashboard', 'apps.json')

apps = []

for category in os.listdir(APPS_DIR):
    cat_path = os.path.join(APPS_DIR, category)
    if not os.path.isdir(cat_path):
        continue
    for app_name in os.listdir(cat_path):
        app_path = os.path.join(cat_path, app_name)
        if not os.path.isdir(app_path):
            continue
        meta_path = os.path.join(app_path, 'meta.json')
        if os.path.exists(meta_path):
            with open(meta_path, encoding='utf-8') as f:
                meta = json.load(f)
            meta['category'] = category
            meta['url'] = f"/apps/{category}/{app_name}/index.html"
            meta['id'] = len(apps) + 1
            if 'last_modified' not in meta:
                meta['last_modified'] = ''
            apps.append(meta)

with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(apps, f, ensure_ascii=False, indent=2)

print(f"Wygenerowano {len(apps)} wpisów do {OUTPUT}")
